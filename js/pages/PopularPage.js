/**
 * Created by JoChen on 2017/8/3.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    Text,
    View,
    TextInput,
    ListView
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=stars';

export default class PopularPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {result: ''};
        this.dataRepository = new DataRepository();
    }

    onLoad() {
        let url = this.genUrl(this.text);
        // let url = 'https://api.github.com/search/repositories?q=java&sort=stars';
        this.dataRepository.fetchNetRepository(url)
            .then(result=> {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error=> {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    genUrl(key) {
        return URL + key + QUERY_STAR;
    }

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
            />
            <ScrollableTabView
                renderTabBar={()=><ScrollableTabBar/>}
            >
                <PopularTab tabLabel="Java">JAVA</PopularTab>
                <PopularTab tabLabel="iOS">IOS</PopularTab>
                <PopularTab tabLabel="Android">Android</PopularTab>
                <PopularTab tabLabel="JavaScript">js</PopularTab>
            </ScrollableTabView>
        </View>
    }
}

class PopularTab extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.dataRepository = new DataRepository();
        this.state = {
            result: '',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
        };
    }

    componentDidMount() {
        this.onLoad();
    }

    onLoad() {
        let url = URL + this.props.tabLabel + QUERY_STAR;
        this.dataRepository.fetchNetRepository(url)
            .then(result=> {
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.items)
                })
            })
            .catch(error=> {
                console.log(error);
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    renderRow(data){
        return <RepositoryCell data={data}/>
    }

    render(){
        return <View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    }
});