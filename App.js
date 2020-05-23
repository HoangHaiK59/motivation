import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
//import { Navigation } from 'react-native-navigation';
import Container from './src/container';
import { decode, encode } from 'base-64';

if(!global.btoa) {
  global.btoa = encode;
}

if(!global.atob) {
  global.atob = decode;
}

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});


// export default function registerScreens() {
//     Navigation.registerComponent('Dashboard', () => require('./components/dashboard').default);
// }

export default function App() {
    return (
      <Container />
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333333'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
