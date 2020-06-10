import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Firebase from '../../firebase';
import Cover from '../common/cover';
import Content from './content';
import Animated from 'react-native-reanimated';
import { DB } from '../../helper/db';

const { width, height } = Dimensions.get('window');

class Relax extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            urls: [],
            hour: new Date().getHours(),
            uri: 'https://firebasestorage.googleapis.com/v0/b/motivation-b2dcb.appspot.com/o/Relax%2Frelax-image.jpg?alt=media&token=788fd555-b87f-42e3-98cb-8885f7f2ba5a'
        }

        this.storageRef = Firebase.storage().ref('Relax');
        this.firebaseRef = Firebase.firestore().collection(DB.relax);
        this.animatedValue = new Animated.Value(0);
    }

    getStringFromHour() {
        if (this.state.hour >= 4 && this.state.hour <= 12) {
            return 'Morning';
        } else if (this.state.hour > 12 && this.state.hour <= 18) {
            return 'Afternoon'
        } else if (this.state.hour > 18 && this.state.hour <= 22) {
            return 'Evening'
        } else {
            return 'Night'
        }
    }

    getFavourites() {
        this.firebaseRef.where('is_farvorite', '==', true)
        .get()
        .then(result => {
            let items = [];
            if(result.docs.length > 0) {
                result.docs.forEach(doc => items.push({id: doc.id, ...doc.data()}));
                this.setState({ items })
            }
        })
    }

    componentDidMount() {
        this.getFavourites();
        // this.storageRef.listAll()
        //     .then(result => {
        //         var promises = [];
        //         if (result.items.length > 0) {
        //             promises = result.items.map(item => {
        //                 return this.storageRef.child(item.name).getDownloadURL()
        //                     .then(url => {
        //                         return url;
        //                     })
        //             });
        //             Promise.all(promises).then(urls => this.setState({ urls }))
        //         }
        //     })
    }

//     <View style={styles.container}>
//     <ImageBackground source={{uri: this.state.uri}} style={[styles.image]}>
//         <Text style={[{ marginBottom: 120, marginLeft: 15, fontSize: 26, color: 'white' }]}>Good {this.getStringFromHour()}</Text>
//     </ImageBackground>
//     <LinearGradient
//         start={[0, .3]}
//         end={[0, 1]}
//         colors={['transparent', 'rgba(0,0,0,.2)', 'black']}
//         style={styles.gradient} />
// </View>

    render() {
        const style = {
            cover : {uri: this.state.uri},
            header: 'Good ' + this.getStringFromHour(),
            items: this.state.items.length > 0 ? this.state.items: []
        }
        return (
            <View style={styles.main}>

                <Cover style={style} animatedValue={this.animatedValue} />
                <Content navigation={this.props.navigation} style={style} animatedValue={this.animatedValue} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
       width: width,
       height: height/2
    },
    type: {
        flex: 1,
        flexDirection: 'row'
    },
    typeItem: {
        width: 200, 
        height: 200,
        backgroundColor: 'red',
        marginHorizontal: 10
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: 'flex-end',
        alignItems: 'center',
        opacity: .90
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2
    },
    buttonInBackdrop: {
        position: 'absolute',
        top:50, 
        right: 20, 
        alignSelf: 'flex-end',
        borderColor: 'white', 
        borderWidth: 2,
        backgroundColor: '#cdd1d1',
        zIndex: 3,
        borderRadius: 5,
        color: 'white',
        padding: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Relax;