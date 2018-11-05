import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
export default class PlayerListItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    if (this.props.st === 0) {
      var usernameText = <Text style={styles.textGreen}>{this.props.unE}</Text>;
    } else if (this.props.st === 1) {
      var usernameText = <Text style={styles.textGray}>{this.props.unE}</Text>;
    } else if (this.props.st === 2) {
      var usernameText = <Text style={styles.textRed}>{this.props.unE}</Text>;
    }
    return (
      <View style={styles.item}>
        <Image
          style={styles.fieldImage}
          source={{ uri: "f_logo_white_bg" }}
          borderRadius={25}
          resizeMode="cover"
        />
        {usernameText}
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

  textGray: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    color: "gray",
    flexWrap: "wrap"
  },
  textGreen: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    color: "#3bd774",
    flexWrap: "wrap"
  },
  textRed: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    color: "red",
    flexWrap: "wrap"
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
