/**
 * Created by JoChen on 2017/8/3.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    Text,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import RepositoryDetail from './RepositoryDetail'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
import Utils from '../utils/Utils'
import {FLAG_TAB} from './HomePage'
import MoreMenu, {MORE_MENU} from '../common/MoreMenu'
import ActionUtils from '../utils/ActionUtils'
import ViewUtils from '../utils/ViewUtils'

const API_URL = 'https://github.com/trending/';
var timeSpanTextArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);


export default class TrendingPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
            theme: this.props.theme
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab};
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Language, MORE_MENU.Sort_Language, MORE_MENU.Share, MORE_MENU.Custom_Theme,
                MORE_MENU.About_Author, MORE_MENU.About]}
            anchorView={() => this.refs.moreMenuButton}
        />
    }

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref='button'
                onPress={() => this.showPopover()}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                        style={{fontSize: 18, color: 'white', fontWeight: '400'}}
                    >趋势 {this.state.timeSpan.showText}</Text>
                    <Image style={{width: 12, height: 12, marginLeft: 5}}
                           source={require('../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </TouchableOpacity>
        </View>
    }

    closePopover() {
        this.setState({
            isVisible: false
        })
    }

    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan,
        })
    }

    render() {
        var statusBar = {
            backgroundColor: this.state.theme.themeColor
        };
        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
            />;
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor={this.state.theme.themeColor}
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                ref="scrollableTabView"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                      tabStyle={{height: 39}}/>}
            >
                {this.state.languages.map((result, i, arr) => {
                    let lan = arr[i];
                    return lan.checked ? <TrendingTab key={i} tabLabel={lan.name}
                                                      timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })}
            </ScrollableTabView> : null;
        let timeSpanView =
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={() => this.closePopover()}
                contentStyle={{backgroundColor: '#343434', opacity: 0.82}}
            >
                <View>
                    {timeSpanTextArray.map((result, i, arr) => {
                        return <TouchableOpacity
                            key={i}
                            underlayColor='transparent'
                            onPress={() => this.onSelectTimeSpan(arr[i])}
                        >
                            <Text
                                style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}
                            >{arr[i].showText}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </Popover>;
        return <View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
            {this.renderMoreView()}
        </View>
    }
}

class TrendingTab extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.isFavoriteChanged = false;
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
            theme: this.props.theme
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.isFavoriteChanged = true;
        });
        this.loadData(this.props.timeSpan, true);
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan)
        } else if (this.isFavoriteChanged) {
            this.isFavoriteChanged = false;
            this.getFavoriteKeys();
        }
    }

    onRefresh() {
        this.loadData(this.props.timeSpan)
    }

    /**
     * 更新Project Item 收藏(Favorite)的状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels)
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    /**
     * 获取本地用户收藏的ProjectItem
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then((keys) => {
                if (keys) {
                    this.updateState({favoriteKeys: keys})
                }
                this.flushFavoriteState();
            })
            .catch(e => {
                //有异常的话也是要刷新一下
                this.flushFavoriteState();
            });
    }

    loadData(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true
        });
        let url = this.genFetchUrl(timeSpan, this.props.tabLabel);
        dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items || result && result.update_date && !Utils.checkDate(result.update_date)) {
                    return dataRepository.fetchNetRepository(url);
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.items = items;
                this.getFavoriteKeys();
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading: false
                })
            })
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    genFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText;
    }

    renderRow(projectModel) {
        return <TrendingCell
            key={projectModel.item.fullName}
            theme={this.state.theme}
            projectModel={projectModel}
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props,
            })}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={<RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.onRefresh()}
                    colors={[this.props.theme.themeColor]}
                    tintColor={this.props.theme.themeColor}
                    title={'Loading...'}
                    titleColor={this.props.theme.themeColor}
                />}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 29
    }
});