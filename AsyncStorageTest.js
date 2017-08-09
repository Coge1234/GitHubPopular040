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
    AsyncStorage,
    TextInput
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import NavigationBar from './js/common/NavigationBar'

const KEY = 'text';

export default class AsyncStorageTest extends Component {
    // 构造
    constructor(props) {
        super(props);
    }

    onSave() {
        AsyncStorage.setItem(KEY, this.text, (error)=> {
            if (!error) {
                this.toast.show('保存成功', DURATION.LENGTH_SHORT);
            } else {
                this.toast.show('保存失败', DURATION.LENGTH_SHORT);
            }
        })
    }

    onRemove() {
        AsyncStorage.removeItem(KEY, (error)=>{
            if (!error) {
                this.toast.show('移除成功', DURATION.LENGTH_SHORT);
            } else {
                this.toast.show('移除失败', DURATION.LENGTH_SHORT);
            }
        })
    }

    onFetch() {
        AsyncStorage.getItem(KEY, (error, result)=> {
            if (!error) {
                if (result !== '' && result !== null) {
                    this.toast.show('取出的内容为：' + result, DURATION.LENGTH_SHORT);
                }else{
                    this.toast.show('取出的内容为不存在', DURATION.LENGTH_SHORT);
                }
            } else {
                this.toast.show('取出失败', DURATION.LENGTH_SHORT);
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'AsyncStorageTest'}
                    statusBar={{
                        backgroundColor:'#2196F3'
                    }}
                    style={{
                        backgroundColor:'#2196F3'
                    }}
                />
                <TextInput
                    style={{borderWidth:1, height:40, margin:6}}
                    onChangeText={text=>this.text=text}
                />
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.text}
                          onPress={()=>this.onSave()}
                    >保存</Text>
                    <Text style={styles.text}
                          onPress={()=>this.onRemove()}
                    >移除</Text>
                    <Text style={styles.text}
                          onPress={()=>this.onFetch()}
                    >取出</Text>
                </View>
                <Toast ref={toast=>{this.toast=toast}}/>
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
        margin: 5,
        color: 'black'
    }
})