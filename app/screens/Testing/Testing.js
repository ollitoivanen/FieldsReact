import React, { Component } from "react";
import { StyleSheet, View, Geolocation, Text } from "react-native";

export default class Testing extends Component {
  getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
        console.warn(position)

    },  error => {
        this.setState({ locationIOS: "disabled", loading: false });
      })
//{ enableHighAccuracy: false, timeout: 20000, maximumAge: 0 });
  }
  constructor(props) {
    super(props);
    this.state = {
      co: null
    };
    this.getLocation();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.co}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
