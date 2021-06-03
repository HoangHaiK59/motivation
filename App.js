import * as React from 'react';
import { Platform, InteractionManager, LogBox } from 'react-native';
//import { Navigation } from 'react-native-navigation';
import Container from './src/container';
import { decode, encode } from 'base-64';
import UserProvider from './src/components/context/user.context';
import { MenuProvider } from 'react-native-popup-menu'

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs(['Setting a timer'])

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 120 * 1000;
if (Platform.OS === "android") {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = "_lt_" + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = id => {
    if (typeof id === "string" && id.startsWith("_lt_")) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
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
    <UserProvider>
      <MenuProvider>
        <Container />
      </MenuProvider>
    </UserProvider>
  )
}
