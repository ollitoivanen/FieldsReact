import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
export default class FieldSearchitem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    return (
      <View style={styles.item}>
        <Image
          style={styles.fieldImage}
          source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          borderRadius={25}
          resizeMode="cover"
        />
        <Text style={styles.text} numberOfLines={2}>
          {this.props.fieldName}{" "}
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
