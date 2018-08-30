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
import CreateNewFieldScreen from "./app/screens/CreateNewFieldScreen/CreateNewFieldScreen";
import TeamScreen from "./app/screens/TeamScreen/TeamScreen";
import TeamPlayersScreen from "./app/screens/TeamPlayersScreen/TeamPlayersScreen";
import CreateEventScreen from "./app/screens/CreateEventScreen/CreateEventScreen";
import DetailEventScreen from "./app/screens/DetailEventScreen/DetailEventScreen";
import SearchScreen from "./app/screens/SearchScreen/SearchScreen";
import DetailProfileScreen from "./app/screens/DetailProfileScreen/DetailProfileScreen";
import DetailTeamScreen from "./app/screens/DetailTeamScreen/DetailTeamScreen";
import TeamPendingPlayersScreen from "./app/screens/TeamPendingPlayersScreen/TeamPendingPlayersScreen";
import NoTeamScreen from "./app/screens/NoTeamScreen/NoTeamScreen";
import CreateTeamScreen from "./app/screens/CreateTeamScreen/CreateTeamScreen";
import ReputationScreen from "./app/screens/ReputationScreen/ReputationScreen";
import SettingsScreen from "./app/screens/SettingsScreen/SettingsScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen/EditProfileScreen";
import UserFriendListScreen from "./app/screens/UserFriendListScreen/UserFriendListScreen";
import MapScreen from "./app/screens/MapScreen/MapScreen";






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

    
    CreateNewFieldScreen: {
      screen: CreateNewFieldScreen
    },

    TeamScreen: {
      screen: TeamScreen
    },

    TeamPlayersScreen: {
      screen: TeamPlayersScreen
    },

    CreateEventScreen: {
      screen: CreateEventScreen
    },
    DetailEventScreen: {
      screen: DetailEventScreen
    },
    SearchScreen: {
      screen: SearchScreen
    },
    DetailProfileScreen: {
      screen: DetailProfileScreen
    },
    DetailTeamScreen: {
      screen: DetailTeamScreen
    },
    TeamPendingPlayersScreen: {
      screen: TeamPendingPlayersScreen
    },

    NoTeamScreen: {
      screen: NoTeamScreen
    },

    CreateTeamScreen: {
      screen: CreateTeamScreen
    },

    ReputationScreen: {
      screen: ReputationScreen
    },

    SettingsScreen:{
      screen: SettingsScreen
    },


    EditProfileScreen:{
      screen: EditProfileScreen
    },

    UserFriendListScreen: {
      screen: UserFriendListScreen
    },
    MapScreen:{
      screen: MapScreen
    }
  },

  {
    initialRouteName: "LoadingScreen",
    transitionConfig
  }
);
