import * as React from 'react';

import { Image, View, StyleSheet, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';
import { Constants } from 'react-native-unimodules';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const Swiper = (props) => {

    const { images } = props;
    return (
        <ScrollView horizontal pagingEnabled={true}>
            {
                images && images.map((image, id) => (
                    <View key={id} style={styles.container}>
                        <Image source={{ uri: image }} style={{width: screenWidth, height: screenHeight - Constants.statusBarHeight}} />
                    </View>
                ))
            }
        </ScrollView>
    )
}

export default function ViewImage({ route }) {
    const { params } = route;
    const images = params.items.map(item => item.url)
    return (
        <Swiper images={images} />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    },
    image: {
        flex: 1,
        resizeMode: "contain"
    }
})