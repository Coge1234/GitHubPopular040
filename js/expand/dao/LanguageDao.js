/**
 * Created by JoChen on 2017/8/3.
 */
import React, {Component} from 'react';
import {
    AsyncStorage
} from 'react-native';

import keys from '../../../res/data/keys.json'
import langsData from '../../../res/data/langs.json'

export var FLAG_LANGUAGE = {flag_language: 'flag_language_language', flag_key: "flag_language_key"};
export default class LanguageDao {
    // 构造
    constructor(flag) {
        // 初始状态
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(this.flag, (error, result)=> {
                if (error) {
                    reject(error);
                } else {
                    if (result) {
                        try {
                            resolve(JSON.parse(result))
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        var data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langsData;
                        this.save(data);
                        resolve(data);

                    }
                }
            })
        })
    }

    save(data) {
        AsyncStorage.setItem(this.flag, JSON.stringify(data), (error)=> {

        })
    }
}