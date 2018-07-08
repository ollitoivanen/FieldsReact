import React, { Component } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import BottomBarProfile from "FieldsReact/app/components/BottomBar/BottomBarProfile.js";
import ProfileHeader from "FieldsReact/app/components/ProfileHeader/ProfileHeader.js";
import firebase from "react-native-firebase";
import { SharedElement } from "react-native-motion";

export default class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
    };
   
  }

  render() {
    return (
      <View style={styles.container}>
        <ProfileHeader />
        <View style={styles.navigationContainer}>
          <SharedElement id="source">
            <BottomBarProfile navigation={this.props.navigation} />
          </SharedElement>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  profileGreenBackground: {
    backgroundColor: "#3bd774",
    height: 100
  },

  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1
  }
});
