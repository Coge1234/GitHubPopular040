/**
 * Created by JoChen on 2017/6/23.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    Text,
    View,
    WebView,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../utils/ViewUtils'

export default class WebViewPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            url: this.props.url,
            title: this.props.title,
            canGoBack: false
        };
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url
        })
    }

    onBackPress() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    render() {
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar
                    title={this.state.title}
                    statusBar={{backgroundColor: '#2196F3'}}
                    style={{backgroundColor: '#2196F3'}}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                />
            </View>)
    }
}