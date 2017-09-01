/**
 * Created by JoChen on 2017/8/31.
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
    Platform,
    TouchableOpacity
} from 'react-native';
import Toast, {DURATION} from "react-native-easy-toast"
import {ACTION_HOME} from './HomePage'
import GlobalStyles from "../../res/styles/GlobalStyles"
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ActionUtils from '../utils/ActionUtils'
import ProjectModel from '../model/ProjectModel'
import Utils from '../utils/Utils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ViewUtils from "../utils/ViewUtils"

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class SearchPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            rightButtonText: '搜索',
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onBackPress() {
        this.refs.input.blur();
        this.props.navigator.pop();
    }

    updateState(dic) {
        this.setState(dic);
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({rightButtonText:'取消'})
        } else {
            this.updateState({rightButtonText:'搜索'})
        }
    }


    renderNavBar() {
        let backButton = ViewUtils.getLeftButton(() => this.onBackPress());
        let inputView = <TextInput
            ref='input'
            onChangeText={text => this.inputKey = text}
            style={styles.textInput}
        >
        </TextInput>
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.refs.input.blur();
                    this.onRightButtonClick();
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>{this.state.rightButtonText}</Text>
                </View>
            </TouchableOpacity>
        return <View style={{
            backgroundColor: '#2196F3',
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    render() {
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, {backgroundColor: '#2196F3'}]}/>
        }
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
        </View>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    statusBar: {
        height: 20,
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "white",
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: GlobalStyles.window_height - 45,
        right: 10,
        borderRadius: 3
    }
});