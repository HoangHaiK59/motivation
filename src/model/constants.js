import { Dimensions } from 'react-native';
import Constants from 'expo-constants';

const { height } = Dimensions.get('window');
const delta = (1 + Math.sqrt(6)) / 2;

export const MIN_HEADER_HEIGHT = 48 + Constants.statusBarHeight;
export const MAX_HEADER_HEIGHT = height * (1 - 1/delta);
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;
