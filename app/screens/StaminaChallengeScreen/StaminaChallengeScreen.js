import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

export default class StaminaChallengeScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return <View style={styles.container} />;
  }
}
const styles = StyleSheet.create({
  container: {}
});
