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
    ListView,
    TouchableOpacity
} from 'react-native';

export default class RepositoryCell extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ?
                require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item
            : this.props.projectModel;
        let favoriteButton = this.props.projectModel.item ? <TouchableOpacity
            onPress={() => this.onPressFavorite()} underlayColor='transparent'>
            <Image
                ref='favoriteIcon'
                style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]}
                source={this.state.favoriteIcon}/>
        </TouchableOpacity> : null;
        return <TouchableOpacity
            onPress={this.props.onSelect}>
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.full_name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text>Author:</Text>
                        <Image
                            style={{height: 22, width: 22}}
                            source={{uri: item.owner.avatar_url}}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>Stars:</Text>
                        <Text>{item.stargazers_count}</Text>
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
        borderRadius: 2
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    }
});