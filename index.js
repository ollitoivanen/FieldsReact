import React, { Component } from "react";
import {
  AppRegistry,
  View,
  StyleSheet,
  StatusBar,
  DeviceEventEmitter,
  Platform,
  SafeAreaView
} from "react-native";
import { StackNavigatorApp } from "FieldsReact/App";
import { YellowBox } from "react-native";
import { Provider } from "react-redux";
import { store } from "FieldsReact/app/redux/app-redux.js"; //Import the store

import NavigationService from "./NavigationService";

export default class FieldsApp extends Component {
  constructor(props) {
    super(props);
    // this.notif = new PushService(this.onNotif.bind(this));
  }

  componentDidMount() {}

  render() {
    YellowBox.ignoreWarnings([
      "Warning: isMounted(...) is deprecated",
      "Module RCTImageLoader"
    ]);
    if (Platform.OS === "android") {
      return (
        <Provider store={store}>
          <View style={{ flex: 1 }}>
            <StatusBar
              translucent={false}
              backgroundColor="#3bd774"
              barStyle="light-content"
              animated={true}
            />

            <StackNavigatorApp
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </View>
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StackNavigatorApp
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </SafeAreaView>
        </Provider>
      );
    }
  }
}

AppRegistry.registerComponent("FieldsReact", () => FieldsApp);
