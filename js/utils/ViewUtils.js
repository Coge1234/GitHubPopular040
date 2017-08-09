/**
 * Created by JoChen on 2017/8/7.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
export default class ViewUtils{
    static getLeftButton(callBack){
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callBack}>
            <Image
                style={{width: 26, height:26, margin:5, tintColor:'white'}}
                source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }
}