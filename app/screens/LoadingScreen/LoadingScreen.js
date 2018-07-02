import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";

export default class LoadingScreen extends Component {
  static navigationOptions = {
    header: null
  };
  componentWillMount() {
    const startFeed = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "FeedScreen" })]
    });

    const startSignUp = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "SignUpScreen" })]
    });

    firebase.auth().onAuthStateChanged(user => {
      user
        ? this.props.navigation.dispatch(startFeed)
        : this.props.navigation.dispatch(startSignUp);
    });
  }

  render() {
    return <View style={styles.container} />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 200
  }
});
