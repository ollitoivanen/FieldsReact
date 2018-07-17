import React, { Component } from "react";
import { StyleSheet, View, BackHandler } from "react-native";

export default class TrainingSummaryScreen extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate("DetailFieldScreen", {
      currentFieldID: "",
      currentFieldName: ""
    });
    return true;
  };
  render() {
    return <View style={styles.container} />;
  }
}
const styles = StyleSheet.create({
  container: {}
});
