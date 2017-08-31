/**
 * Created by JoChen on 2017/8/7.
 */
import React, {Component} from 'react';
import RepositoryDetail from '../pages/RepositoryDetail'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'

export default class ActionUtils {
    /**
     * 跳转到详情页
     * @param params 要传递的一些参数
     */
    static onSelect(params) {
        var {navigator} = params;
        navigator.push({
            component: RepositoryDetail,
            params: {
                ...params
            },
        });
    }

    /**
     * favoriteIcon的单击回调方法
     * @param item
     * @param isFavorite
     */
    static onFavorite(favoriteDao, item, isFavorite, flag) {
        var key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}