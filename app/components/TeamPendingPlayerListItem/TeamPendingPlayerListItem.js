import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import {
 accept,
 decline
} from "../../strings/strings";
export default class TeamPlayerListItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    var usernameText = (
      <Text style={styles.textGray} numberOfLines={2}>
        {this.props.pUN}
      </Text>
    );

    return (
      <View style={styles.item}>
        <Image
          style={styles.fieldImage}
          source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          borderRadius={25}
          resizeMode="cover"
        />
        {usernameText}
       

      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    flex:1,
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

  textRed: {
    color: 'red',
    fontWeight:'bold',
    marginHorizontal: 10,
    marginEnd: 20


  },

  textGreen: {
    color: '#3bd774',
    fontWeight:'bold',
    marginHorizontal: 10

    
  },

  textGray: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
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
