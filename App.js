import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { SwitchNavigator } from "react-navigation";
// import the different screens
import LoadingScreen from "FieldsReact/app/screens/LoadingScreen/LoadingScreen";
import  SignUpScreen  from "FieldsReact/app/screens/SignUpScreen/SignUpScreen";
import LoginScreen from "FieldsReact/app/screens/LoginScreen/LoginScreen";
import FeedScreen from "FieldsReact/app/screens/FeedScreen/FeedScreen";
// create our app's navigation stack
const App = SwitchNavigator(
  {
    LoadingScreen,
    SignUpScreen,
    LoginScreen,
    FeedScreen
  },
  {
    initialRouteName: "LoadingScreen"
  }
);
export default App;
