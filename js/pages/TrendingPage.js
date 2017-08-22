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
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import RepositoryDetail from './RepositoryDetail'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
const API_URL = 'https://github.com/trending/';
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
var timeSpanTextArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')];

export default class TrendingPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0]
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result=> {
                this.setState({
                    languages: result
                })
            })
            .catch(error=> {
                console.log(error);
            })
    }

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref='button'
                onPress={()=>this.showPopover()}
            >
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text
                        style={{fontSize:18, color:'white',fontWeight:'400'}}
                    >趋势 {this.state.timeSpan.showText}</Text>
                    <Image style={{width: 12, height:12, marginLeft:5}}
                           source={require('../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </TouchableOpacity>
        </View>
    }

    closePopover() {
        this.setState({
            isVisible: false
        })
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan:timeSpan,
            isVisible:false
        })
    }

    render() {
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor:'#e7e7e7', height:2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >
                {this.state.languages.map((result, i, arr)=> {
                    let lan = arr[i];
                    return lan.checked ? <TrendingTab key={i} tabLabel={lan.name}
                                                      timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })}
            </ScrollableTabView> : null;
        let timeSpanView =
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={()=>this.closePopover()}
                contentStyle={{backgroundColor:'#343434', opacity:0.82}}
            >
                <View>
                    {timeSpanTextArray.map((result, i, arr)=> {
                        return <TouchableOpacity
                            key={i}
                            underlayColor='transparent'
                            onPress={()=>this.onSelectTimeSpan(arr[i])}
                        >
                            <Text
                                style={{fontSize:18, color:'white', padding:8, fontWeight:'400'}}
                            >{arr[i].showText}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </Popover>
        return <View style={styles.container}>
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={{
                    backgroundColor:'#2196F3'
                }}
            />
            {content}
            {timeSpanView}
        </View>
    }
}

class TrendingTab extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan)
        }
    }

    onRefresh() {
        this.loadData(this.props.timeSpan)
    }

    loadData(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true
        });
        let url = this.genFetchUrl(timeSpan, this.props.tabLabel);
        this.dataRepository
            .fetchRepository(url)
            .then(result=> {
                let items = result && result.items ? result.items : result ? result : [];
                this.updateState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
                if (result && result.update_date && !this.dataRepository.checkData(result.update_date)) {
                    return this.dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }
            })
            .then(items=> {
                if (!items || items.length === 0) return;
                this.updateState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error=> {
                console.log(error);
                this.setState({
                    isLoading: false
                })
            })
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    onSelect(item) {
        this.props.navigator.push({
            title: item.fullName,
            component: RepositoryDetail,
            params: {
                item: item,
                ...this.props
            }
        })
    }

    genFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText;
    }

    renderRow(data) {
        return <TrendingCell
            onSelect={()=>this.onSelect(data)}
            key={data.id}
            data={data}
        />
    }

    render() {
        return <View style={{flex:1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={<RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={()=>this.onRefresh()}
                                colors={['#2196F3']}
                                tintColor={'#2196F3'}
                                title={'Loading...'}
                                titleColor={'#2196F3'}
                />}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 29
    }
});