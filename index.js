import React, { Component } from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import App from "FieldsReact/App";

export default class FieldsApp extends Component {
  render() {
    return (
      <View>
        <App />

      </View>
    );
  }
}


AppRegistry.registerComponent("FieldsReact", () => FieldsApp);






