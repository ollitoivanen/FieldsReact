import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import firebase from "react-native-firebase";
export default class Searchitem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    return (
      <View style={styles.item}>
        <Text style={styles.text} >
          {this.props.fN}
        </Text>
        <View style={styles.div} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center"
  },

  div: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    margin: 20
  },

  fieldImage: {
    width: 50,
    height: 50,

    marginStart: 8,
    borderWidth: 5,
    borderColor: "white",
    margin: 5
  }
});
