/**
 * Created by JoChen on 2017/8/4.
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
    ListView
} from 'react-native';

export default class RepositoryCell extends Component {
    render() {
        return <View style={{margin:10}}>
            <Text style={styles.title}>{this.props.data.full_name}</Text>
            <Text style={styles.description}>{this.props.data.description}</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text >Author:</Text>
                    <Image
                        style={{height: 22, width:22}}
                        source={{uri:this.props.data.owner.avatar_url}}
                    />
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text>Stars:</Text>
                    <Text>{this.props.data.stargazers_count}</Text>
                </View>
                <Image style={{height: 22, width:22}} source={require('../../res/images/ic_star.png')}/>
            </View>
        </View>
    }
}

const styles=StyleSheet.create({
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575'
    }
});