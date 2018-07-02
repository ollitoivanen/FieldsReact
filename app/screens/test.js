import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image
} from "react-native";


export default class test extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Home/home.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationItem}>
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Profile/profile.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },

  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },

  navigationItem: {
    flex: 1,
    
    backgroundColor: "white",
    alignItems: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  }
});
