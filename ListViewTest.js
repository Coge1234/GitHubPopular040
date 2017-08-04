/**
 * Created by JoChen on 2017/8/2.
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
    ListView,
    RefreshControl
} from 'react-native';
import NavigationBar from './js/common/NavigationBar'
import Toast, {DURATION} from 'react-native-easy-toast'

var data = {
    "result": [
        {
            "email": "s.hernandez@williams.net",
            "fullName": "刘一"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "陈二"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "张三"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "李四"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "王五"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "赵六"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "孙七"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "周八"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "吴九"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "郑十"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "刘一刘一"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "陈二陈二"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "张三张三"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "李四李四"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "王五王五"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "赵六赵六"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "孙七孙七"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "周八周八"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "吴九吴九"
        },
        {
            "email": "s.hernandez@williams.net",
            "fullName": "郑十郑十"
        }
    ],
    "statusCode": 0
};

export default class ListViewTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading:true,
        }
        this.onLoad();
    }

    renderRow(item) {
        return <View style={styles.row}>
            <TouchableOpacity
                onPress={()=>{
                    this.toast.show('你单击了：'+item.fullName, DURATION.LENGTH_SHORT);
                }}
            >
                <Text style={styles.text}>{item.fullName}</Text>
                <Text style={styles.text}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={styles.line}></View>
    }

    renderFooter() {
        return <Image
            style={{width: 400, height:100}}
            /*网络图片在加载之前先确定宽和高*/
            source={{uri:'https://images.gr-assets.com/hostedimages/1406479536ra/10555627.gif'}}/>
    }

    onLoad() {
        setTimeout(()=>{
            this.setState({
                isLoading:false
            })
        }, 2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'ListViewTest'}
                    statusBar={{
                        backgroundColor:'gray'
                    }}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(item)=>this.renderRow(item)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderFooter={()=>this.renderFooter()}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onLoad()}
                    />}
                />
                <Toast ref={toast=>{this.toast=toast}}/>
            </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
    },
    row: {
        height: 50
    },
    line: {
        height: 1,

        backgroundColor: 'black'
    }

})