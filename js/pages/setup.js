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
import WelcomePage from '../pages/WelcomePage.js'

function setup() {
    //进行一些初始化配置
    class Root extends Component {
        renderScene(route, navigator){
            let Component=route.component;
            return <Component {...route.params} navigator={navigator}/>
        }
        render() {
            return <Navigator
                initialRoute={{component:WelcomePage}}
                renderScene={(route, navigator)=>this.renderScene(route, navigator)}
            />
        }
    }
    return <Root/>
}
module.exports = setup;