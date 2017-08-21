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
    ListView,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import AsyncStoreTest from '../../AsyncStorageTest';
import WebViewTest from '../../WebViewTest'
import MyPage from './my/MyPage'
import Toast, {DURATION}from 'react-native-easy-toast'
import TrendingPage from './TrendingPage'

export default class HomePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: 'tb_popular',
        }
    }

    componentDidMount() {
        this.listener=DeviceEventEmitter.addListener('showToast', (text)=>{
            this.toast.show(text, DURATION.LENGTH_SHORT);
        })
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    _renderTab(Component, selectTab, title, renderIcon) {
        return <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            title= {title}
            selectedTitleStyle={{color:'#2196F3'}}
            renderIcon={()=> <Image style={styles.image}
                                    source={renderIcon}/>}
            renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'#2196F3'}]}
                                            source={renderIcon}/>}
            onPress={()=> this.setState({selectedTab : selectTab})}>
            <Component {...this.props}/>
        </TabNavigator.Item>
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage, 'tb_popular', '最热', require('../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage, 'tb_trending', '趋势', require('../../res/images/ic_trending.png'))}
                    {this._renderTab(WebViewTest, 'tb_favorite', '收藏', require('../../res/images/ic_favorite.png'))}
                    {this._renderTab(MyPage, 'tb_my', '我的', require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast=>this.toast=toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red'
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    page3: {
        flex: 1,
        backgroundColor: 'blue'
    },
    page4: {
        flex: 1,
        backgroundColor: 'gray'
    },
    image: {
        height: 22,
        width: 22
    }
});
