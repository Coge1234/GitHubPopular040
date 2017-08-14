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
import AsyncStoreTest from '../../AsyncStorageTest'
import MyPage from './my/MyPage'
import Toast, {DURATION}from 'react-native-easy-toast'

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

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        title="最热"
                        selectedTitleStyle={{color:'#2196F3'}}
                        renderIcon={()=> <Image style={styles.image} source={require('../../res/images/ic_polular.png')}/>}
                        renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'#2196F3'}]} source={require('../../res/images/ic_polular.png')}/>}
                        onPress={()=> this.setState({selectedTab : 'tb_popular'})}>
                        <PopularPage/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        title="趋势"
                        selectedTitleStyle={{color:'yellow'}}
                        renderIcon={()=> <Image style={styles.image} source={require('../../res/images/ic_trending.png')}/>}
                        renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'yellow'}]} source={require('../../res/images/ic_trending.png')}/>}
                        onPress={()=> this.setState({selectedTab : 'tb_trending'})}>
                        <AsyncStoreTest/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        title="收藏"
                        selectedTitleStyle={{color:'blue'}}
                        renderIcon={()=> <Image style={styles.image} source={require('../../res/images/ic_favorite.png')}/>}
                        renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'blue'}]} source={require('../../res/images/ic_favorite.png')}/>}
                        onPress={()=> this.setState({selectedTab : 'tb_favorite'})}>
                        <View style={styles.page3}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        title="我的"
                        selectedTitleStyle={{color:'gray'}}
                        renderIcon={()=> <Image style={styles.image} source={require('../../res/images/ic_my.png')}/>}
                        renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'gray'}]} source={require('../../res/images/ic_my.png')}/>}
                        onPress={()=> this.setState({selectedTab : 'tb_my'})}>
                        <MyPage {...this.props}/>
                    </TabNavigator.Item>
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
