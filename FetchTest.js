/**
 * Created by JoChen on 2017/8/2.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    TouchableOpacity,
    Text,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';
import HttpUtils from './HttpUtils'

export default class FetchTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            result: ''
        };
    }

    onLoad(url) {
        // fetch(url)
        //     .then(response=>response.json())
        //     .then(result=> {
        //         this.setState({
        //             result: JSON.stringify(result)
        //         })
        //     })
        //     .catch(error=>{
        //         this.setState({
        //             result:JSON.stringify(error)
        //         })
        //     })
        HttpUtils.get(url)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error=>{
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    onSummit(url, data){
        // fetch(url, {
        //     method:'POST',
        //     header:{
        //         'Accept':'application/json',
        //         'Content-Type':'application/josn'
        //     },
        //     body:JSON.stringify(data)
        // })
        //     .then(response=>response.json())
        //     .then(result=>{
        //         this.setState({
        //             result:JSON.stringify(result)
        //         })
        //     })
        //     .catch(error=>{
        //         this.setState({
        //             result:JSON.stringify(error)
        //         })
        //     })
        HttpUtils.post(url, data)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error=>{
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'FetchTest的使用'}
                    statusBar={{
                        backgroundColor:'gray'
                    }}
                />

                <Text style={styles.text}
                    onPress={()=>this.onLoad('http://rapapi.org/mockjsdata/11793/test')}
                >获取数据
                </Text>

                <Text style={styles.text}
                      onPress={()=>this.onSummit('http://rapapi.org/mockjsdata/11793/submit',{userName:'小明', password:'123456'})}
                >提交数据
                </Text>

                <Text style={styles.text}>
                    返回结果：{this.state.result}
                </Text>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
    }
});