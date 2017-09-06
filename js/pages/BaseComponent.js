/**
 * Created by JoChen on 2017/8/3.
 */
import React, {Component} from 'react';
import {
    DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME} from './HomePage'

export default class BaseComponent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            theme: this.props.theme,
        }
    }

    componentDidMount() {
        this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE',
            (action, params) => this.onBaseAction(action, params));
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onBaseAction(action, params) {
        if (ACTION_HOME.A_THEME === action) {
            this.onThemeChange(params)
        }
    }

    componentWillUnmount() {
        if (this.baseListener) {
            this.baseListener.remove();
        }
    }

    /**
     * 当主题改变后更新主题
     * @param theme
     */
    onThemeChange(theme) {
        if (!theme) return;
        this.setState({
            theme: theme
        })
    }
}