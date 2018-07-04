import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

export default class ProfileHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundGreen}>
          <View style={styles.imageTabContainer}>
            <TouchableOpacity style={styles.roundTextContainer}>
              <Text style={styles.boxText}>Friends</Text>
            </TouchableOpacity>

            <Image
              style={styles.profileImage}
              source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
              borderRadius={35}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.roundTextContainer}>
              <Text style={styles.boxText}>Trainings</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>ollitoivanen</Text>
          <TouchableOpacity style={styles.roundTextContainer}>
            <Image
              style={styles.teamIcon}
              source={require("FieldsReact/app/images/Team/team.png")}
            />
            <Text style={styles.boxText}>Tiimi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.roundTextContainerBig}>
            <Text style={styles.boxText}>Trainings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundTextContainerBig}>
            <Text style={styles.boxText}>Trainings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundTextContainerBig}>
            <Text style={styles.boxText}>Trainings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  backgroundGreen: {
    backgroundColor: "#3bd774",

    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20
  },

  profileImage: {
    width: 70,
    height: 70,
    alignSelf: "center",
    alignItems: "center",
    marginStart: 8,
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
    alignItems: "center",
    alignSelf: "center",
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: 6,
    paddingBottom: 6,

    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 8
  },

  roundTextContainerBig: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingStart: 12,
    paddingEnd: 12,
    paddingTop: 10,
    paddingBottom: 10,

    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 8
  },

  boxText: {
    fontWeight: "bold",
    marginStart: 4,
    marginEnd: 2,
    color: "#636363"
  },

  teamIcon: {
    width: 25,
    height: 25
  },

  imageTabContainer: {
    flexDirection: "row",
    flexShrink: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center"
  },

  actionContainer: {
    flex: 1
  }
});
