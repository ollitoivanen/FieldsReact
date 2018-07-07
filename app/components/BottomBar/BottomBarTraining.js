import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image
} from "react-native";

export default class BottomBarTraining extends Component {
  render() {
    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("FeedScreen")}
          style={styles.navigationItem}
          underlayColor="#bcbcbc"
        >
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Home/home.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationItemBlue}>
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

  navigationItemBlue: {
    flex: 1,
    height: 50,
    backgroundColor: "#3facff",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  }
});
