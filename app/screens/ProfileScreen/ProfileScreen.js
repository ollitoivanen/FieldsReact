import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import BottomBarProfile from "FieldsReact/app/components/BottomBar/BottomBarProfile.js";

export default class ProfileScreen extends Component {
    static navigationOptions = {
        header: null
      };
  render() {
    return (
      <View style={styles.container}>
        <BottomBarProfile navigation={this.props.navigation} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
