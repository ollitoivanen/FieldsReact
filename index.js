import React, { Component } from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import { StackNavigatorApp } from "FieldsReact/App";
import { YellowBox } from "react-native";
import { SharedElementRenderer } from "react-native-motion";
import { Provider } from "react-redux";
import {store} from "FieldsReact/app/redux/app-redux.js"; //Import the store

export default class FieldsApp extends Component {
  render() {
    YellowBox.ignoreWarnings([
      "Warning: isMounted(...) is deprecated",
      "Module RCTImageLoader"
    ]);

    return (
      <Provider store={store}>
        <StackNavigatorApp />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("FieldsReact", () => FieldsApp);
