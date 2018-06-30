import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import firebase from 'react-native-firebase'

export default class LoadingScreen extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
          this.props.navigation.navigate(user ? 'FeedScreen' : 'SignUpScreen')
        })
      }
  render() {
    return (
      <View style={styles.container}>
      
          </View>
            );
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
  },
});
