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
    WebView,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../utils/ViewUtils'
import NavigationBar from '../../js/common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao'
const URL = 'http://www.imooc.com/';
const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url
            : TRENDING_URL + this.props.projectModel.item.fullName;
        let title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name
            : this.props.projectModel.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ?
                require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        };
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url
        })
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite ? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_star_navbar.png')
        })
    }

    onRightButtonClick() {
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite=!projectModel.isFavorite);
        var key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    renderRightButton() {
        return <TouchableOpacity
            onPress={() => this.onRightButtonClick()}
        >
            <Image
                style={{width: 20, height: 20, marginRight: 10}}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    statusBar={{
                        backgroundColor: '#2196F3'
                    }}
                    style={{
                        backgroundColor: '#2196F3'
                    }}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
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
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 2
    },
    tips: {
        fontSize: 20
    }
});