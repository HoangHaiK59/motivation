import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useCode, cond, set, Clock, clockRunning, eq, not, add, min, abs, call } from 'react-native-reanimated';
import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from '../../../model/constants';
import {
    PanGestureHandler,
    State,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {
    onScrollEvent,
    clamp,
    snapPoint,
    timing,
    useClock,
    usePanGestureHandler,
    useValue,
} from 'react-native-redash';
import Action, { CARD_HEIGHT, WIDTH } from '../action';

const { interpolate, Extrapolate } = Animated;
const { width } = Dimensions.get('window');

const snapPoints = [-width, -100, 0];


const Item = ({ id, title, onSwipe }) => {
    const { translation, velocity, state, gestureHandler } = usePanGestureHandler();
    const translateX = useValue(0);
    const offsetX = useValue(0);
    const height = useValue(CARD_HEIGHT);
    const deleteOpacity = useValue(1);
    const clock = useClock();
    const to = snapPoint(translateX, velocity.x, snapPoints);
    const shouldRemove = useValue(0);
    useCode(() => [
        cond(eq(state, State.ACTIVE), set(translateX, add(offsetX, min(translation.x, 0)))),
        cond(eq(state, State.END), [
            set(translateX, timing({ clock, from: CARD_HEIGHT, to })),
            set(offsetX, translateX),
            cond(eq(to, -width), set(shouldRemove, 1))
        ]),
        cond(shouldRemove, [
            set(height, timing({ from: CARD_HEIGHT, to: 0 })),
            set(deleteOpacity, 0),
            cond(not(clockRunning(clock)), call([], onSwipe)),
        ])
    ], [onSwipe])
    return (
        <Animated.View style={{ marginVertical: 8 }}>
            <View style={styles.background}>
                <TouchableWithoutFeedback onPress={() => shouldRemove.setValue(1)}>
                    <Action x={abs(translateX)} deleteOpacity={deleteOpacity} />
                </TouchableWithoutFeedback>
            </View>
            <PanGestureHandler {...gestureHandler}>
                <Animated.View style={{ height, transform: [{ translateX }] }}>
                    <View style={styles.item}>
                        <Text style={styles.text}>{title}</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    )
}

export default function Content({ y, item: { items }, onSwipe }) {
    const height = interpolate(y, {
        inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
        outputRange: [0, MAX_HEADER_HEIGHT + 48],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolate(y, {
        inputRange: [- MAX_HEADER_HEIGHT / 2, 0, MAX_HEADER_HEIGHT / 2],
        outputRange: [0, 1, 0],
        extrapolate: Extrapolate.CLAMP
    });

    //     <View style={styles.headerContainer}>
    //     <Animated.Text style={[styles.headerName, { opacity }]}>{header}</Animated.Text>
    // </View>
    // <View style={styles.header}>
    // <Header animatedValue={animatedValue} header={header} />
    // </View>

    return (
        <Animated.ScrollView
            contentContainerStyle={styles.container}
            onScroll={onScrollEvent({ y })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            bounces={false}
            decelerationRate={'fast'}
        //stickyHeaderIndices={[1]}
        >
            <View style={styles.cover}>
                <Animated.View style={[styles.gradient, { height }]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,.2)', 'black']}
                        start={[0, 0.3]}
                        end={[0, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            </View>
            <View style={styles.list}>
                {
                    items.map((item, id) => <Item key={id} title={item} onSwipe={onSwipe}/>)
                }
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: MIN_HEADER_HEIGHT - 24, //48/2,

    },
    cover: {
        height: MAX_HEADER_HEIGHT - 48
    },
    gradient: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
    },
    headerContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerName: {
        textAlign: 'center',
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold'
    },
    header: {
        marginTop: -24
    },
    list: {
        paddingTop: 32,
        backgroundColor: 'black',
        //flex: 1,
        paddingBottom: 24,
        marginBottom: 10,
        alignItems: 'center'
    },
    item: {
        //backgroundColor: '#f9c2ff',
        backgroundColor: '#2d4269',
        padding: 20,
        //marginVertical: 16,
        //marginHorizontal: 8,
        height: CARD_HEIGHT,
        width: WIDTH
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: "hidden",
    },
})