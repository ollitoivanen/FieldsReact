import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
export default class TeamPlayerListItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
      var usernameText = (
        <Text style={styles.textGray} numberOfLines={2}>
          {this.props.unM}
        </Text>
      );
   
    return (
      <View style={styles.item}>
       
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
    margin: 20,
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
