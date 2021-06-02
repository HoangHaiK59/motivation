import React from 'react';
import { Text } from 'react-native';

const TextWrap = props => {
    return <Text {...props} style={[{fontFamily: 'Lato'}, props.style]}>{props.children}</Text>
}

export default TextWrap;