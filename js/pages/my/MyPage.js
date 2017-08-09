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
    View
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage'

export default class MyPage extends Component {
    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'我的'}
                style={{backgroundColor:'#2196F3'}}
            />
            <Text
                style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{...this.props}
                    })
                }}
            >自定义标签</Text>
        </View>
    }
}
const styles = StyleSheet.create({
   container:{
       flex:1,
       backgroundColor: 'white'
   },
    tips:{
        fontSize:29
    }
});