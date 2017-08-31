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
import TrendingCell from '../common/TrendingCell'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ArrayUtils from '../utils/ArrayUtils'
import ActionUtils from '../utils/ActionUtils'

export default class FavoritePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        let content = <ScrollableTabView
            tabBarBackgroundColor="#2196F3"
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="white"
            ref="scrollableTabView"
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                  tabStyle={{height: 39}}/>}
        >
            <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>;
        return <View style={styles.container}>
            <NavigationBar
                title={'收藏'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
            {content}
        </View>
    }
}

class FavoriteTab extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.unFavoriteItems = [];
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        };
    }

    componentDidMount() {
        this.loadData(true);
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(false);
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    loadData(isShowLoading) {
        if (isShowLoading) {
            this.updateState({
                isLoading: true
            })
        }
        this.favoriteDao.getAllItems()
            .then((items) => {
                var resultData = [];
                for (var i = 0, len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                this.updateState({
                    isLoading: false,
                    dataSource: this.getDataSource(resultData)
                })
            })
            .catch(e => {
                this.updateState({
                    isLoading: false
                })
            })
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    /**
     * favoriteIcon的单击回调方法
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        var key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
        ArrayUtils.updateArray(this.unFavoriteItems, item);
        if (this.unFavoriteItems.length > 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChanged_popular');
            } else {
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }
        }
    }

    renderRow(projectModel) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        return <CellComponent
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id
                : projectModel.item.fullName}
            projectModel={projectModel}
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: this.props.flag,
                ...this.props
            })}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                enableEmptySections={true}
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