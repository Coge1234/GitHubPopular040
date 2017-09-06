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
import ThemeDao from '../expand/dao/ThemeDao'
import ThemeFactory from "../../res/styles/ThemeFactory";

export default class WelcomePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            theme: ThemeFactory.createTheme('#2196F3')
        };
    }

    componentDidMount() {
        new ThemeDao().getTheme().then((data) => {
            this.theme = data;
            this.setState({
                theme: data
            })
        });
        this.timer = setTimeout(() => {
            this.props.navigator.resetTo({
                component: HomePage,
                params: {
                    theme: this.theme,
                }
            })
        }, 1000)
    }

    componentWillUnmount() {
        //防止定时器异常，退出时候清楚定时器
        this.timer && clearTimeout(this.timer);
    }

    render() {
        var statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar
            title={'欢迎'}
            statusBar={statusBar}
            style={this.state.theme.styles.navBar}
        />;
        return <View>
            {navigationBar}
            <Text>欢迎</Text>
        </View>
    }
}