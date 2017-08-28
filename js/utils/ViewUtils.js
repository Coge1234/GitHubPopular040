/**
 * Created by JoChen on 2017/8/7.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    TouchableOpacity,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
export default class ViewUtils{
    /**
     * 获取设置页的Icon
     * @param callBack 单击item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyle 图标着色
     * @param expandableIcon 右侧图标
     */
    static getSettingItem(callBack, icon, text, tintStyle, expandableIcon) {
        return (
            <TouchableHighlight
                onPress={callBack}
            >
                <View style={styles.setting_item_container}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image source={expandableIcon ? expandableIcon : require('../../res/images/ic_tiaozhuan.png')}
                           style={[{width: 22, height: 22, marginRight: 10, alignSelf: 'center', opacity: 1}, tintStyle]}
                    />
                </View>
            </TouchableHighlight>
        )
    }

    static getLeftButton(callBack){
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callBack}>
            <Image
                style={{width: 26, height:26, margin:5, tintColor:'white'}}
                source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
});