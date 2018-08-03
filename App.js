import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  AppRegistry,
  Animated,
  Easing
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
import ProfileScreen from "FieldsReact/app/screens/ProfileScreen/ProfileScreen";

import ForgotPasswordScreen from "FieldsReact/app/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import FieldSearchScreen from "./app/screens/FieldSearchScreen/FieldSearchScreen";
import DetailFieldScreen from "./app/screens/DetailFieldScreen/DetailFieldScreen";
import TrainingScreen from "./app/screens/TrainingScreen/TrainingScreen";
import TrainingSummaryScreen from "./app/screens/TrainingSummaryScreen/TrainingSummaryScreen";
import EditFieldScreen from "./app/screens/EditFieldScreen/EditFieldScreen";
import CreateNewFieldScreen from "./app/screens/CreateNewFieldScreen/CreateNewFieldScreen";
import TeamScreen from "./app/screens/TeamScreen/TeamScreen";
import TeamPlayersScreen from "./app/screens/TeamPlayersScreen/TeamPlayersScreen";


const transitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.linear
  }
});

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

    LoadingScreen: {
      screen: LoadingScreen
    },

    FeedScreen: {
      screen: FeedScreen
    },

    ProfileScreen: {
      screen: ProfileScreen
    },
    FieldSearchScreen: {
      screen: FieldSearchScreen
    },
    DetailFieldScreen: {
      screen: DetailFieldScreen
    },

    TrainingScreen: {
      screen: TrainingScreen
    },

    TrainingSummaryScreen: {
      screen: TrainingSummaryScreen
    },

    EditFieldScreen: {
      screen: EditFieldScreen
    },
    CreateNewFieldScreen: {
      screen: CreateNewFieldScreen
    },

    TeamScreen: {
      screen: TeamScreen
    },

    TeamPlayersScreen: {
      screen: TeamPlayersScreen
    }
  },

  {
    initialRouteName: "LoadingScreen",
    transitionConfig
  }
);
