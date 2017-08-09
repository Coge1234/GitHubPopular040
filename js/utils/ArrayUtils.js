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
export default class ArrayUtils{
    /**
     * 更新数组，若item已存在则从数组中移除，否则添加进数组
     */
    static updateArray(array, item){
        for (var i = 0, len = array.length; i < len; i++) {
            var temp = array[i];
            if (temp === item){
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }
}