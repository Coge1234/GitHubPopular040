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
    DeviceEventEmitter
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

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
import ActionUtils from '../utils/ActionUtils'

export default class PopularPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {languages: []};
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

    render() {
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.languages.map((result, i, arr) => {
                    let lan = arr[i];
                    return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab> : null;
                })}
            </ScrollableTabView> : null;
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
            {content}
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
            favoriteKeys: []
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
                    colors={['#2196F3']}
                    tintColor={'#2196F3'}
                    title={'Loading...'}
                    titleColor={'#2196F3'}
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