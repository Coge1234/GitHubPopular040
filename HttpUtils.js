/**
 * Created by JoChen on 2017/8/2.
 */
export default class HttpUtils {
    static get(url) {
        return new Promise((resolve, reject)=> {
            fetch(url)
                .then(response=>response.json())
                .then(result=> {
                    resolve(result);
                })
                .catch(error=> {
                    reject(error);
                })
        })
    }

    static post(url, data) {
        return new Promise((resolve, reject)=> {
            fetch(url, {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/josn'
                },
                body: JSON.stringify(data)
            })
                .then(response=>response.json())
                .then(result=> {
                    resolve(result);
                })
                .catch(error=> {
                    reject(error);
                })
        })
    }
}