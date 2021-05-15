import React, { useState, useRef } from 'react';

import { Image, View, StyleSheet, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';
import { Constants } from 'react-native-unimodules';
import Animated, {
    Value,
    add,
    and,
    call,
    clockRunning,
    cond,
    divide,
    eq,
    floor,
    multiply,
    neq,
    not,
    onChange,
    set,
    sub,
    useCode,
} from 'react-native-reanimated';
import {
    clamp,
    snapPoint,
    timing,
    translate as translateVector,
    useClock,
    usePanGestureHandler,
    usePinchGestureHandler,
    useValue,
    vec,
} from 'react-native-redash';

import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { CANVAS, usePinch } from '../../../utils/animation';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const { width, height } = Dimensions.get('window');


const Swiper = (props) => {

    const { images } = props;
    const snapPoints = images.map((_, i) => -width * i);

    const index = useValue(0);
    const pinchRef = useRef(null);
    const panRef = useRef(null);

    const pan = usePanGestureHandler();
    const pinch = usePinchGestureHandler();

    const scale = useValue(1);
    const translate = vec.createValue(0, 0);

    const clock = useClock();
    const offsetX = useValue(0);
    const translationX = useValue(0);
    const translateX = useValue(0);

    const minVec = vec.min(vec.multiply(-0.5, CANVAS, sub(scale, 1)), 0);
    const maxVec = vec.max(vec.minus(minVec), 0);

    usePinch({ pan, pinch, translate, scale, minVec, maxVec, translationX });
    const snapTo = clamp(
        snapPoint(translateX, pan.velocity.x, snapPoints),
        multiply(add(index, 1), -width),
        multiply(sub(index, 1), -width)
    );
    useCode(
        () => [
            onChange(
                translationX,
                cond(eq(pan.state, State.ACTIVE), [
                    set(translateX, add(offsetX, translationX)),
                ])
            ),
            cond(and(eq(pan.state, State.END), neq(translationX, 0)), [
                set(translateX, timing({ clock, from: translateX, to: snapTo })),
                set(offsetX, translateX),
                cond(not(clockRunning(clock)), [
                    vec.set(translate, 0),
                    set(scale, 1),
                    set(index, floor(divide(translateX, -width))),
                ]),
            ]),
        ],
        [index]
    );
    const myStyles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'black'
        },
        pictures: {
            flexDirection: 'row',
            height,
            width: width * images.length
        },
        picture: {
            width,
            height,
            overflow: 'hidden'
        },
        image: {
            ...StyleSheet.absoluteFillObject,
            width: undefined,
            height: undefined,
            resizeMode: 'cover'
        }
    })

    return (
        <PinchGestureHandler
            ref={pinchRef}
            simultaneousHandlers={panRef}
            {...pinch.gestureHandler}
        >
            <Animated.View style={StyleSheet.absoluteFill}>
                <PanGestureHandler
                    ref={panRef}
                    minDist={10}
                    avgTouches
                    simultaneousHandlers={pinchRef}
                    {...pan.gestureHandler}
                >
                    <Animated.View style={myStyles.container}>
                        <Animated.View style={[myStyles.pictures, { transform: [{ translateX }] }]}>
                            {
                                images.map((url, i) => {
                                    const isActive = eq(index, i);
                                    return (
                                        <View key={i} style={myStyles.picture}>
                                            <Animated.Image
                                                style={[myStyles.image, {
                                                    transform: [
                                                        { translateX: cond(isActive, translate.x, 0) },
                                                        {
                                                            translateY: cond(isActive, translate.y, 0)
                                                        },
                                                        {
                                                            scale: cond(isActive, scale, 1)
                                                        }
                                                    ]
                                                }]}
                                                source={{ uri: url }}
                                            />
                                        </View>
                                    )
                                })
                            }
                        </Animated.View>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </PinchGestureHandler>
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
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: "contain"
    }
})