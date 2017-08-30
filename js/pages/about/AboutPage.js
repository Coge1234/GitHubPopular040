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

                break;
            case MORE_MENU.WebSite:
                TargetComponent = WebViewPage;
                params.url = 'http://www.devio.org/io/GitHubPopular/';
                params.title = 'GitHubPopular';
                break;
            case MORE_MENU.Feedback:
                var url = 'mailto://crazycodeboy.gmail.com';
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
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.WebSite), require('../../../res/images/ic_computer.png'), MORE_MENU.WebSite, {tintColor: '#2196F3'}, null)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.About_Author), require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author, {tintColor: '#2196F3'}, null)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, {tintColor: '#2196F3'}, null)}
            <View style={GlobalStyles.line}/>
        </View>;
        return this.aboutCommon.render(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            'avatar': 'http://ww1.sinaimg.cn/mw690/6e32efe4gw1ejdw8vtqczj20dc0dcjsk.jpg',
            'backgroundImg': 'http://ww3.sinaimg.cn/mw690/6e32efe4jw1fao8jlc1f3j21kw16448s.jpg'
        });
    }
}