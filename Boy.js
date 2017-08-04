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
    View
} from 'react-native';
import Girl from './Girl'
import NavigationBar from './js/common/NavigationBar'
export default class Boy extends Component{
    // 构造
      constructor(props){
        super(props);
        // 初始状态
        this.state = {
            what :''
        };
      }
    render(){
        let what = this.state.what===''?'':'我收到了女孩回赠的:'+this.state.what
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'Boy'}
                    statusBar={{
                        backgroundColor:'#EE6363'
                    }}
                    style={{
                        backgroundColor:'#EE6363'
                    }}
                />
                <Text style={styles.text}>Hello I am boy</Text>
                <Text style={styles.text}
                      onPress={()=>{
                        this.props.navigator.push({
                            component:Girl,
                            name:'Girl',
                            params:{
                                what:'一枝玫瑰',
                                onCallBack:(what)=>{
                                    this.setState({
                                        what:what
                                    })
                                }
                            }
                        })
                      }}>送女孩一枝玫瑰</Text>
                <Text style={styles.text}>{what}</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'gray'
    },
    text:{
        fontSize:22,
        marginTop:10,
    }
})