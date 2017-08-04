/**
 * Created by JoChen on 2017/6/23.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import NavigationBar from './js/common/NavigationBar'
export default class Girl extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    renderButton(image) {
        return <TouchableOpacity
            onPress={()=>{
                this.props.navigator.pop();
            }}
        >
            <Image style={{width: 22, height:22, margin:5}} source={image}></Image>
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'Girl'}
                    style={{
                        backgroundColor:'#EE6363'
                    }}
                    leftButton={
                        this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))
                    }
                    rightButton={
                        this.renderButton(require('./res/images/ic_star.png'))
                    }
                />
                <Text style={styles.text}>I am Girl.</Text>
                <Text style={styles.text}>我收到了男孩送的:{this.props.what}</Text>
                <Text style={styles.text} onPress={()=>{
                    this.props.onCallBack('一盒巧克力')
                    this.props.navigator.pop()
                }}>
                    回赠男孩巧克力
                </Text>
            </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    text: {
        fontSize: 22,
    }
})