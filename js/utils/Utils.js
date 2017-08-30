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
        let id = item.id ? item.id.toString() : item.fullName;
        for (var i = 0, len = items.length; i < len; i++) {
            if(id === items[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */
    static checkDate(longTime) {
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDate() !== tDate.getDate()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }
}