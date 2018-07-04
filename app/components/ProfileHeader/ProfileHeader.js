import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

export default class ProfileHeader extends Component {
  render() {
    return (
      <View style={styles.backgroundGreen}>
        <Image
          style={styles.profileImage}
          source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          borderRadius={35}
          resizeMode="cover"
        />
        <Text style={styles.username}>Testi</Text>
        <View style={styles.roundTextContainer}>
          <Image
            style={styles.teamIcon}
            source={require("FieldsReact/app/images/Team/team.png")}
          />
          <Text style={styles.boxText}>Tiimi</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  backgroundGreen: {
    backgroundColor: "#3bd774",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20
  },

  profileImage: {
    width: 70,
    height: 70,
    alignSelf: "center",
    borderWidth: 5,
    padding: 5,
    borderColor: "white",
    marginTop: 16
  },

  username: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 22
  },
  roundTextContainer: {
    flexDirection: "row",
    alignItems: 'center',
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1
  },

  boxText: {
    fontWeight: "bold",
    marginStart: 4,
    marginEnd: 2
  },

  teamIcon: {
    width: 25,
    height: 25
  }
});
