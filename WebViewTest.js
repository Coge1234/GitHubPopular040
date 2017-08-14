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
import NavigationBar from './js/common/NavigationBar'
const URL = 'http://www.imooc.com/';
export default class WebViewTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            url: URL,
            title: '',
            canGoBack: false
        };
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            DeviceEventEmitter.emit('showToast', '到顶了');
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            title: e.title
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'WebView使用'}
                    statusBar={{
                        backgroundColor:'#2196F3'
                    }}
                    style={{
                        backgroundColor:'#2196F3'
                    }}
                />
                <View style={styles.row}>
                    <Text
                        style={styles.tips}
                        onPress={()=>{
                        this.goBack()
                        }}
                    >返回</Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={URL}
                        onChangeText={text=>this.text=text}
                    />
                    <Text
                        style={styles.tips}
                        onPress={()=>{
                        this.go()
                        }}
                    >go</Text>
                </View>
                <WebView
                    ref={webView=> this.webView = webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
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