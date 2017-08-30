/**
 * Created by JoChen on 2017/8/29.
 */
import {
    AsyncStorage
} from 'react-native'
import Utils from '../../utils/Utils'
import DataRepository, {FLAG_STORAGE} from '../../expand/dao/DataRepository'

var itemMap = new Map();

export default class RepositoryUtils {
    constructor(aboutCommon) {
        this.aboutComon = aboutCommon;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    }

    /**
     * 更新数据
     * @param k
     * @param v
     */
    updateData(k, v) {
        itemMap.set(k, v);
        var arr = [];
        for (var value of itemMap.values()) {
            arr.push(value);
        }
        this.aboutComon.onNotifyDataChanged(arr);
    }

    /**
     * 获取指定url下的数据
     * @param url
     */
    fetchRepository(url) {
        this.dataRepository.fetchRepository(url)
            .then(result => {
                if (result) {
                    this.updateData(url, result);
                    if (!Utils.checkDate(result.update_date)) return this.dataRepository.fetchNetRepository(url);
                } else {
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then((item) => {
                if (item) {
                    this.updateData(url, item);
                }
            }).catch(e => {

        })
    }

    /**
     * 批量获取urls对应的数据
     * @param urls
     */
    fetchRepositories(urls) {
        for (let i = 0, l = urls.length; i < l; i++) {
            var url = urls[i];
            this.fetchRepository(url);
        }
    }
}