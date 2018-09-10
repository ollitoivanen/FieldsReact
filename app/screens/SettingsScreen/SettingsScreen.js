import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import firebase from "react-native-firebase";

import {
  settings,
  log_out,
  edit_profile,
  support
} from "../../strings/strings";
const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};
class SettingsScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{settings}</Text>
        </View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate("EditProfileScreen")}
        >
          <Text style={styles.itemText}>{edit_profile}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate("SupportScreens")}
        >
          <Text style={styles.itemText}>{support}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => firebase.auth().signOut()}
        >
          <Text style={styles.itemText}>{log_out}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  item: {
    width: "100%",
    backgroundColor: "white"
  },

  div: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  itemText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20
  }
});
