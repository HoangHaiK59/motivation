import { ToastAndroid } from 'react-native';

/**
 * Toast general
 * @param {string} message 
 * @param {number} duration 
 */
export const callToast = (message, duration) => {
    ToastAndroid.show(message, duration)
}

/**
 * Toast with gravity
 * @param {string} message 
 * @param {number} duration 
 * @param {number} gravity
 */
export const callToastWithGravity = (message, duration, gravity) => {
    ToastAndroid.showWithGravity(message, duration, gravity)
}

/**
 * Toast with gravity and offset
 * @param {string} message 
 * @param {number} duration 
 * @param {number} gravity 
 * @param {number} offsetX 
 * @param {number} offsetY 
 */
export const callToastWithGravityAndOffset = (message, duration, gravity, offsetX, offsetY) => {
    ToastAndroid.showWithGravityAndOffset(message, duration, gravity, offsetX, offsetY)
}

export const Gravity = {
    top: ToastAndroid.TOP,
    bottom: ToastAndroid.BOTTOM,
    center: ToastAndroid.CENTER
}

export const Duration = {
    short: ToastAndroid.SHORT,
    long: ToastAndroid.LONG
}