/**
 * Created by JoChen on 2017/8/7.
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
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

export default class MyPage extends Component {
    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'我的'}
                style={{backgroundColor:'#2196F3'}}
            />
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_key
                        }
                    })
                }}
            >自定义标签</Text>
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_language
                        }
                    })
                }}
            >自定义语言</Text>
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:SortKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_key
                        }
                    })
                }}
            >标签排序</Text>
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:SortKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_language
                        }
                    })
                }}
            >语言排序</Text>
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                        ...this.props,
                        isRemoveKey:true
                        }
                    })
                }}
            >标签移除</Text>
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.clearArray()
                }}
            >清除</Text>
        </View>
    }

    clearArray() {
        AsyncStorage.removeItem("flag_language_key", (error)=> {
        });
        AsyncStorage.removeItem("flag_language_language", (error)=> {
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 29
    }
});