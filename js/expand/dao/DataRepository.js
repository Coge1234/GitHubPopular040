/**
 * Created by JoChen on 2017/8/3.
 */
import {
    AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending'

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending',
    flag_my: 'my'
};
export default class DataRepository {
    // 构造
    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending();
    }

    saveResponsitory(url, items, callBack) {
        if (!url || !items) return;
        let wrapData;
        if (this.flag === FLAG_STORAGE.flag_my) {
            wrapData = {item: items, update_date: new Date().getTime()};
        } else {
            wrapData = {items: items, update_date: new Date().getTime()};
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
    }

    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地数据
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result, true);
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result)
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(e => {
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result)
                        })
                        .catch(e => {
                            resolve(e);
                        })
                })

        })
    }

    /**
     *获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            if (this.flag !== FLAG_STORAGE.flag_trending) {
                fetch(url)
                    .then(response => response.json())
                    .catch((error)=> {
                        reject(error);
                    })
                    .then((result) => {
                        // if (!result || !result.items) {
                        //     reject(new Error('responseData is null'));
                        //     return;
                        // }
                        // resolve(result.items);
                        // this.saveResponsitory(url, result.items);
                        if (this.flag === FLAG_STORAGE.flag_my && result) {
                            this.saveResponsitory(url, result);
                            resolve(result);
                        } else if (result && result.items) {
                            this.saveResponsitory(url, result.items);
                            resolve(result.items);
                        } else {
                            reject(new Error('responseData is null'));
                        }
                    });
            } else {
                this.trending.fetchTrending(url)
                    .then((result) => {
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return;
                        }
                        resolve(result);
                        this.saveResponsitory(url, result);
                    }).catch((error)=>{
                    reject(error);
                })
            }
        })
    }
}