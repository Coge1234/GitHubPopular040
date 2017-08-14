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
    View
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage'

export default class WelcomePage extends Component {
    componentDidMount() {
        this.timer = setTimeout(()=> {
            this.props.navigator.resetTo({
                component: HomePage
            })
        }, 1000)
    }

    componentWillUnmount() {
        //防止定时器异常，退出时候清楚定时器
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return <View>
            <NavigationBar
                title={'欢迎'}
            />
            <Text>欢迎</Text>
        </View>
    }
}