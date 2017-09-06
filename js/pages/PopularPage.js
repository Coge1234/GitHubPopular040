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
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../utils/Utils'
import ViewUtils from '../utils/ViewUtils'
import ActionUtils from '../utils/ActionUtils'
import SearchPage from './SearchPage'
import WebViewTest from '../../WebViewTest'
import MoreMenu, {MORE_MENU} from '../common/MoreMenu'
import {FLAG_TAB} from './HomePage'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: [],
            theme: this.props.theme,
            customThemeViewVisible: false,
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

    renderRightButton() {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.push({
                        component: SearchPage,
                        params: {
                            ...this.props
                        }
                    })
                }}
            >
                <View style={{padding: 5, marginRight: 8}}>
                    <Image
                        style={{width: 24, height: 24}}
                        source={require('../../res/images/ic_search_white_48pt.png')}
                    />
                </View>
            </TouchableOpacity>
            {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
        </View>
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab};
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Key, MORE_MENU.Sort_Key, MORE_MENU.Remove_Key, MORE_MENU.Share, MORE_MENU.Custom_Theme,
                MORE_MENU.About_Author, MORE_MENU.About]}
            anchorView={() => this.refs.moreMenuButton}
        />
    }

    render() {
        var statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={this.state.theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />;
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                ref="scrollableTabView"
                tabBarBackgroundColor={this.state.theme.themeColor}
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                      tabStyle={{height: 39}}/>}
            >
                {this.state.languages.map((result, i, arr) => {
                    let lan = arr[i];
                    return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab> : null;
                })}
            </ScrollableTabView> : null;
        return <View style={styles.container}>
            {navigationBar}
            {content}
            {this.renderMoreView()}
        </View>
    }
}

class PopularTab extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.isFavoriteChanged = false;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
            theme: this.props.theme
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
            this.isFavoriteChanged = true;
        });
        this.loadData();
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.isFavoriteChanged) {
            this.isFavoriteChanged = false;
            this.getFavoriteKeys();
        }
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

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    loadData() {
        this.updateState({
            isLoading: true
        });
        let url = URL + this.props.tabLabel + QUERY_STAR;
        this.dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (result && result.update_date && !Utils.checkDate(result.update_date)) {
                    return this.dataRepository.fetchNetRepository(url);
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

    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
            theme = {this.props.theme}
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            })}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={<RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.loadData()}
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