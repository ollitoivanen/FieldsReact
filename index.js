import React, { Component } from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import { StackNavigatorApp } from "FieldsReact/App";
import { YellowBox } from 'react-native';


export default class FieldsApp extends Component {
  
  
  render() {
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

    return(
    <StackNavigatorApp/>
    );
  }
}

AppRegistry.registerComponent("FieldsReact", () => FieldsApp);
