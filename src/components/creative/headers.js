import React from 'react';
import { View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import {
   SMALL_HEADER_HEIGHT, MEDIUM_HEADER_HEIGHT, PADDING, CURSOR_WIDTH,
} from './model';
import Header from './header';
import Label from './label';
import Cursor from './cursor';

const {
  Value, Extrapolate, interpolateNode, add, multiply, divide, greaterThan, cond,
} = Animated;


const backgroundColor = '#343761';
const { width, height } = Dimensions.get('window');

export default class Headers extends React.PureComponent {
  tX = (index) => {
    const { x, y } = this.props;
    return add(interpolateNode(y, {
      inputRange: [0, height - MEDIUM_HEADER_HEIGHT],
      outputRange: [x, index * width],
      extrapolate: Extrapolate.CLAMP,
    }), multiply(x, -1));
  }

  tY = (index) => {
    const { y, sections } = this.props;
    const FULL_HEADER_HEIGHT = height / sections.length;
    return interpolateNode(y, {
      inputRange: [0, height - MEDIUM_HEADER_HEIGHT, height - SMALL_HEADER_HEIGHT],
      outputRange: [index * FULL_HEADER_HEIGHT, 0, 0],
      extrapolate: Extrapolate.CLAMP,
    });
  }

  getStyle = (headerHeight, index) => {
    const translateX = this.tX(index);
    const translateY = this.tY(index);
    return {
      height: headerHeight,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [
        { translateX },
        { translateY },
      ],
    };
  };

  render() {
    const { sections, x, y } = this.props;
    const FULL_HEADER_HEIGHT = height / sections.length;
    const headerHeight = interpolateNode(y, {
      inputRange: [0, height - MEDIUM_HEADER_HEIGHT, height - SMALL_HEADER_HEIGHT],
      outputRange: [FULL_HEADER_HEIGHT, MEDIUM_HEADER_HEIGHT, SMALL_HEADER_HEIGHT],
      extrapolate: Extrapolate.CLAMP,
    });
    const labelHeight = interpolateNode(y, {
        inputRange: [0, height - MEDIUM_HEADER_HEIGHT, height - SMALL_HEADER_HEIGHT],
        outputRange: [FULL_HEADER_HEIGHT, MEDIUM_HEADER_HEIGHT , SMALL_HEADER_HEIGHT - 45],
        extrapolate: Extrapolate.CLAMP,
    });
    return (
      <View style={{ height, width: sections.length * width, backgroundColor }}>
        {
          sections.map((section, key) => {
            const style = this.getStyle(headerHeight, key);
            return (
              <Animated.View {...{ key, style }}>
                <Header index={key} {...{ section }} />
              </Animated.View>
            );
          })
        }
        {
          sections.map((section, key) => {
            const style = this.getStyle(labelHeight, key);
            return (
              <Animated.View {...{ key, style }}>
                <Label index={key} {...{ section, x, y }} />
              </Animated.View>
            );
          })
        }
        {
          sections.map((section, key) => {
            const opacity = interpolateNode(x, {
              inputRange: key === 0 ? [0, 0, width] : [width * (key - 1), width * key, width * (key + 1)],
              outputRange: [0.5, 1, 0.5],
              extrapolate: Extrapolate.CLAMP,
            });
            const translateX1 = interpolateNode(y, {
              inputRange: [0, height - MEDIUM_HEADER_HEIGHT],
              outputRange: [-width / 2 + CURSOR_WIDTH / 2 + PADDING, 0],
              extrapolate: Extrapolate.CLAMP,
            });
            const translateX2 = interpolateNode(y, {
              inputRange: [0, height - MEDIUM_HEADER_HEIGHT, height - SMALL_HEADER_HEIGHT],
              outputRange: [0, (width / 2) * key, (CURSOR_WIDTH + PADDING) * key - width / 4 + PADDING * 2],
              extrapolate: Extrapolate.CLAMP,
            });
            const translateX = add(translateX1, translateX2);
            const translateY = interpolateNode(y, {
              inputRange: [0, height - MEDIUM_HEADER_HEIGHT],
              outputRange: [multiply(headerHeight, key), 0],
              extrapolate: Extrapolate.CLAMP,
            });
            const style = {
              height: headerHeight,
              position: 'absolute',
              top: -10,
              left: -30,
              opacity,
              transform: [
                { translateY },
                { translateX },
              ],
            };
            return (
              <Animated.View {...{ key, style }}>
                <Cursor />
              </Animated.View>
            );
          })
        }
      </View>
    );
  }
}