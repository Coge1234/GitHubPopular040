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
import ViewUtils from '../utils/ViewUtils'
import NavigationBar from '../../js/common/NavigationBar'
const URL = 'http://www.imooc.com/';
const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.url = this.props.item.html_url ? this.props.item.html_url
            : TRENDING_URL + this.props.item.fullName;
        let title = this.props.item.full_name ? this.props.item.full_name
            : this.props.item.fullName;
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false
        };
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    statusBar={{
                        backgroundColor:'#2196F3'
                    }}
                    style={{
                        backgroundColor:'#2196F3'
                    }}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                />
                <WebView
                    ref={webView=> this.webView = webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 22,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 2
    },
    tips: {
        fontSize: 20
    }
});