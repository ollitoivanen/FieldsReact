import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  AppRegistry
} from "react-native";
import {
  StackNavigator,
  SwitchNavigator,
  TabNavigator,
  DrawerNavigator
} from "react-navigation";
// import the different screens
import LoadingScreen from "FieldsReact/app/screens/LoadingScreen/LoadingScreen";
import SignUpScreen from "FieldsReact/app/screens/SignUpScreen/SignUpScreen";
import LoginScreen from "FieldsReact/app/screens/LoginScreen/LoginScreen";
import FeedScreen from "FieldsReact/app/screens/FeedScreen/FeedScreen";
import ForgotPasswordScreen from "FieldsReact/app/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import test from "FieldsReact/app/screens/test";





// create our app's navigation stack
 export const StackNavigatorApp = StackNavigator(
     
  {
      
    
    SignUpScreen: {
      screen: SignUpScreen
    },
    LoginScreen: {
      screen: LoginScreen
    },
    
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen
    },

    test: {
      screen: test
    },

    LoadingScreen:{
        screen: LoadingScreen
    },

    FeedScreen:{
        screen: FeedScreen
    }
  },

  {
    initialRouteName: "LoadingScreen"
  }
);




