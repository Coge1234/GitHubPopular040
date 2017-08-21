/**
 * Created by JoChen on 2017/6/23.
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
    TextInput
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import NavigationBar from './js/common/NavigationBar'
import GitHubTrending from 'GitHubTrending'
const URL = 'https://github.com/trending/';

const KEY = 'text';

export default class TrendingTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.trending = new GitHubTrending();
        this.state = {
            result:''
        }
    }

    onLoad() {
        let url = URL + this.text;
        this.trending.fetchTrending(url)
            .then(result=> {
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'GitHubTrending的使用'}
                    statusBar={{
                        backgroundColor:'#2196F3'
                    }}
                    style={{
                        backgroundColor:'#2196F3'
                    }}
                />
                <TextInput
                    style={{borderWidth:1, height:40, margin:6}}
                    onChangeText={text=>this.text=text}
                />
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.text}
                          onPress={()=>this.onLoad()}
                    >加载数据</Text>
                    <Text style={{flex:1}}>{this.state.result}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 22,
        margin: 5,
        color: 'black'
    }
})