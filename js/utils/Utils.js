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
export default class Utils {
    /**
     * 检查该Item，有没有被收藏过
     * @param item
     * @param items
     * @returns {boolean}
     */
    static checkFavorite(item, items) {
        for (var i = 0, len = items.length; i < len; i++) {
            if(item.id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }
}