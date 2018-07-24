import React, { Component } from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import { StackNavigatorApp } from "FieldsReact/App";
import { YellowBox } from "react-native";
import { SharedElementRenderer } from "react-native-motion";
import { Provider } from "react-redux";

<<<<<<< HEAD
import store from "./app/store"; //Import the store
import Home from "./app/components/home"; //Import the component file

=======
>>>>>>> parent of 4f4dfc6... before going redux
export default class FieldsApp extends Component {
  render() {
    YellowBox.ignoreWarnings([
      "Warning: isMounted(...) is deprecated",
      "Module RCTImageLoader"
    ]);

    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("FieldsReact", () => FieldsApp);
