/**
 * Created by JoChen on 2017/8/7.
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
    ScrollView,
    TouchableHighlight,
    Dimensions,
    ListView,
    PixelRatio,
    Platform,
    Linking
} from 'react-native';
import ViewUtils from '../../utils/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'
import WebViewPage from '../../pages/WebViewPage'
import config from '../../../res/data/config.json'
import AboutMePage from './AboutMePage'

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about, config);
        this.state = {
            projectModels: [],
        }
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount();
    }

    updateState(dic) {
        this.setState(dic)
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.Website:
                TargetComponent = WebViewPage;
                params.url = 'http://www.devio.org/io/GitHubPopular/';
                params.title = 'GitHubPopular';
                break;
            case MORE_MENU.Feedback:
                var url = 'mailto://crazycodeboy@gmail.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params

            })
        }
    }

    render() {
        let content = <View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Website), require('../../../res/images/ic_computer.png'), MORE_MENU.Website, this.props.theme.styles.tabBarSelectedIcon, null)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.About_Author), require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author, this.props.theme.styles.tabBarSelectedIcon, null)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, this.props.theme.styles.tabBarSelectedIcon, null)}
            <View style={GlobalStyles.line}/>
        </View>;
        return this.aboutCommon.render(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            'avatar': config.author.avatar1,
            'backgroundImg': config.author.backgroundImg1
        });
    }
}