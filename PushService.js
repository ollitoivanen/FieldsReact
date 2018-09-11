import PushNotification from "react-native-push-notification";
import { current_training, currently_training_at } from "./app/strings/strings";

export default class PushService {
  constructor(onNotification) {
    this.configure(onNotification);
  }

  localNotif(field, startTime) {
    PushNotification.localNotification({
      autoCancel: false,
      ongoing: true,
      largeIcon: "ic_launcher",
      smallIcon: "ic_notification",
      color: "green",
      vibrate: true,
      vibration: 300,
      title: current_training,
      message: [currently_training_at] + " " + field,
      playSound: true,
      foreground: false,
      soundName: "default",

      data: { field: field, startTime: startTime }
    });
  }

  configure(onNotification) {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: onRegister, //this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification: onNotification, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: false
    });
  }
  cancelNotif() {
    PushNotification.cancelLocalNotifications({ id: "" + this.lastId });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
