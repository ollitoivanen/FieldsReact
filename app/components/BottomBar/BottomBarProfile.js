import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image
} from "react-native";

export default class BottomBarProfile extends Component {
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
        <TouchableOpacity style={styles.navigationItemGreen}>
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Field/field_icon.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationItem}>
          <Image
            style={styles.navigationImage}
            source={require("FieldsReact/app/images/Profile/profile_green.png")}
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
