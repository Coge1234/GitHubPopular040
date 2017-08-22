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
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import LanguageDao, {FLAG_LANGUAGE}from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../../utils/ArrayUtils'

export default class CustomKeyPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.changeValues = [];
        this.isRemoveKey = this.props.isRemoveKey ? true : false;
        this.state = {
            dataArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result=> {
                this.setState({
                    dataArray: result
                })
            })
            .catch(error=> {
                console.log(error);
            })
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        if (this.isRemoveKey) {
            for (let i = 0, len = this.changeValues.length; i < len; i++) {
                ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
            }
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) {
            return null;
        }
        let len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
                <View style={styles.line}></View>
            </View>
        );
        return views;
    }

    onClick(data) {
        if (!this.isRemoveKey) data.checked = !data.checked;
        ArrayUtils.updateArray(this.changeValues, data);
    }

    renderCheckBox(data) {
        let leftText = data.name;
        let isChecked = this.isRemoveKey ? false : data.checked;
        return (
            <CheckBox
                style={{flex: 1, padding:10}}
                onClick={()=>this.onClick(data)}
                leftText={leftText}
                isChecked={isChecked}
                checkedImage={<Image style={{tintColor:'#6495ED'}}
                    source={require('./images/ic_check_box.png')}/>}
                unCheckedImage={<Image style={{tintColor:'#6495ED'}}
                    source={require('./images/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    onBack() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        Alert.alert(
            '提示',
            '要保存修改吗？',
            [
                {
                    text: '不保存', onPress: ()=> {
                    this.props.navigator.pop();
                }, style: 'cancel'
                },
                {
                    text: '保存', onPress: ()=> {
                    this.onSave()
                }
                }
            ]
        )
    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.props.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : '自定义标签';
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
        >
            <View style={{margin:10}}>
                <Text style={styles.title}>{rightButtonTitle}</Text>
            </View>
        </TouchableOpacity>
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    style={{backgroundColor:'#2196F3'}}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    rightButton={rightButton}
                />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>)
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 29
    },
    title: {
        fontSize: 20,
        color: 'white'
    },
    line: {
        height: 0.5,
        backgroundColor: 'darkgray'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});