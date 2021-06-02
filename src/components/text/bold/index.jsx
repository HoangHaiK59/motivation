import React from 'react';
import { Text } from 'react-native';

const TextWrap = props => {
    return <Text {...props} style={[{fontFamily: 'LatoBold'}, props.style]}>{props.children}</Text>
}

export default TextWrap;