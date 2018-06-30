import React from "react";
import { StyleSheet, Platform, Image, Text, View, AppRegistry } from "react-native";
import { createStackNavigator, navigationOptions } from "react-navigation";
// import the different screens
import LoadingScreen from "FieldsReact/app/screens/LoadingScreen/LoadingScreen";
import  SignUpScreen  from "FieldsReact/app/screens/SignUpScreen/SignUpScreen";
import LoginScreen from "FieldsReact/app/screens/LoginScreen/LoginScreen";
import FeedScreen from "FieldsReact/app/screens/FeedScreen/FeedScreen";
import ForgotPasswordScreen from "FieldsReact/app/screens/ForgotPasswordScreen/ForgotPasswordScreen";

// create our app's navigation stack
const App = createStackNavigator(
 
  
  {
    LoadingScreen:{
      screen: LoadingScreen,
      
    },
    SignUpScreen: {
      screen: SignUpScreen
    },
    LoginScreen: {
     screen: LoginScreen
    },
    FeedScreen:{
      screen: FeedScreen
    },
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen
    }
  },

  
  {
    initialRouteName: "LoadingScreen"

    
  },
  {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
}
  
  
);

export default App;
AppRegistry.registerComponent("FieldsReact", () => App);

