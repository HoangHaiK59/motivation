import PushNotifycation, { PushNotificationObject } from 'react-native-push-notification';

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification)
    },
    popInitialNotification: true,
    requestPermissions: true
})

/**
 * Push local notification
 * @param {PushNotificationObject} notifiCation 
 */
export const notifiCation = (notifiCation) => {
    // PushNotifycation.localNotification({
    //     autoCancel: true,
    //     bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
    //     subText: 'Local Notification Demo',
    //     title: 'Local Notification Title',
    //     message: 'Expand me to see more',
    //     vibrate: true,
    //     vibration: 300,
    //     playSound: true,
    //     soundName: 'default',
    //     actions: '["Yes", "No"]'
    // })
    PushNotifycation.localNotification(notifiCation)
}

/**
 * Push schedule notification
 * @param {PushNotificationObject} notifiCation 
 */
export const notifiCationSchedule = (notifiCation) => {
    // PushNotifycation.localNotification({
    //     autoCancel: true,
    //     bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
    //     subText: 'Local Notification Demo',
    //     title: 'Local Notification Title',
    //     message: 'Expand me to see more',
    //     vibrate: true,
    //     vibration: 300,
    //     playSound: true,
    //     soundName: 'default',
    //     actions: '["Yes", "No"]'
    // })
    PushNotifycation.localNotificationSchedule(notifiCation)
}