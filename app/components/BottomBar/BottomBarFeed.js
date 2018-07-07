import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";

export default class BottomBarFeed extends Component {
  render() {
    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navigationItem} underlayColor="#bcbcbc">
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Home/home_green.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationItemGreen}
          onPress={() => this.props.navigation.navigate("FieldSearchScreen")}
        >
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Field/field_icon.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationItem}
          onPress={() => this.props.navigation.navigate("ProfileScreen")}
        >
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Profile/profile.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4fff8",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemGreen: {
    flex: 1,
    height: 50,
    backgroundColor: "#3bd774",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  }
});
