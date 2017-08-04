/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    Text,
    View,
    ListView,
} from 'react-native';
// import TabNavigator from 'react-native-tab-navigator';
// import Boy from './Boy'
// import ListViewTest from './ListViewTest'
// import FetchTest from './FetchTest'
import setup from './js/pages/setup.js'
//
// export default class GitHubPopular040 extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             selectedTab: 'tb_popular',
//         }
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {/*<TabNavigator>
//                  <TabNavigator.Item
//                  selected={this.state.selectedTab === 'tb_popular'}
//                  title="最热"
//                  selectedTitleStyle={{color:'red'}}
//                  renderIcon={()=> <Image style={styles.image} source={require('./res/images/ic_polular.png')}/>}
//                  renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'red'}]} source={require('./res/images/ic_polular.png')}/>}
//                  badgeText="1"
//                  onPress={()=> this.setState({selectedTab : 'tb_popular'})}>
//                  <View style={styles.page1}></View>
//                  </TabNavigator.Item>
//                  <TabNavigator.Item
//                  selected={this.state.selectedTab === 'tb_trending'}
//                  title="趋势"
//                  selectedTitleStyle={{color:'yellow'}}
//                  renderIcon={()=> <Image style={styles.image} source={require('./res/images/ic_trending.png')}/>}
//                  renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'yellow'}]} source={require('./res/images/ic_trending.png')}/>}
//                  onPress={()=> this.setState({selectedTab : 'tb_trending'})}>
//                  <View style={styles.page2}></View>
//                  </TabNavigator.Item>
//                  <TabNavigator.Item
//                  selected={this.state.selectedTab === 'tb_favorite'}
//                  title="收藏"
//                  selectedTitleStyle={{color:'blue'}}
//                  renderIcon={()=> <Image style={styles.image} source={require('./res/images/ic_favorite.png')}/>}
//                  renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'blue'}]} source={require('./res/images/ic_favorite.png')}/>}
//                  badgeText="1"
//                  onPress={()=> this.setState({selectedTab : 'tb_favorite'})}>
//                  <View style={styles.page3}></View>
//                  </TabNavigator.Item>
//                  <TabNavigator.Item
//                  selected={this.state.selectedTab === 'tb_my'}
//                  title="我的"
//                  selectedTitleStyle={{color:'gray'}}
//                  renderIcon={()=> <Image style={styles.image} source={require('./res/images/ic_my.png')}/>}
//                  renderSelectedIcon={()=> <Image style={[styles.image, {tintColor:'gray'}]} source={require('./res/images/ic_my.png')}/>}
//                  onPress={()=> this.setState({selectedTab : 'tb_my'})}>
//                  <View style={styles.page4}></View>
//                  </TabNavigator.Item>
//                  </TabNavigator>
//                  <Navigator
//                  initialRoute={{
//                  component:Boy
//                  }}
//                  renderScene={(route,navigator)=>{
//                  let Component=route.component;
//                  return <Component navigator={navigator}{...route.params}/>
//                  }}
//                  />*/}
//                 <FetchTest/>
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//     },
//     page1: {
//         flex: 1,
//         backgroundColor: 'red'
//     },
//     page2: {
//         flex: 1,
//         backgroundColor: 'yellow'
//     },
//     page3: {
//         flex: 1,
//         backgroundColor: 'blue'
//     },
//     page4: {
//         flex: 1,
//         backgroundColor: 'gray'
//     },
//     image: {
//         height: 22,
//         width: 22
//     }
// });

AppRegistry.registerComponent('GitHubPopular040', () => setup);
