import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import firebase from "react-native-firebase";

import {
  trainings,
  friends,
  not_in_a_team,
  reputation,
  not_at_any_field
} from "FieldsReact/app/strings/strings";

export default class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.state = {
      username: params.username,
      trainingCount: params.trainingCount,
      friendCount: params.friendCount,
      userTeamID: params.usersTeamID,
      usersTeam: params.usersTeam,
      reputation: params.reputation,
      currentFieldName: params.currentFieldName,
      currentFieldID: params.currentFieldID,
      timestamp: params.timestamp,
      homeArea: params.homeArea,
      userID: params.userID
    };
    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <View style={styles.backgroundGreen}>
            <View style={styles.imageTabContainer}>
              <TouchableOpacity style={styles.roundTextContainer}>
                <Text style={styles.boxText}>
                  {this.state.friendCount} {friends}
                </Text>
              </TouchableOpacity>

              <Image
                style={styles.profileImage}
                source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
                borderRadius={35}
                resizeMode="cover"
              />

              <TouchableOpacity style={styles.roundTextContainer}>
                <Text style={styles.boxText}>
                  {this.state.trainingCount} {trainings}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.username}>{this.state.username}</Text>
            <TouchableOpacity style={styles.roundTextContainer}>
              <Image
                style={styles.teamIcon}
                source={require("FieldsReact/app/images/Team/team.png")}
              />
              <Text style={styles.boxText}>{this.state.usersTeam}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.roundTextContainerBordered}>
              <Text style={styles.boxText}>
                {this.state.reputation} {reputation}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundTextContainerGreen}>
              <Text style={styles.boxTextWhite}>
                {this.state.currentFieldName}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
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
            <TouchableOpacity
              style={styles.navigationItemGreen}
              onPress={() =>
                this.props.navigation.navigate("FieldSearchScreen", {
                  homeArea: this.state.homeArea,
                  currentFieldID: this.state.currentFieldID,
                  currentFieldName: this.state.currentFieldName,
                  timestamp: this.state.timestamp,
                  userID: this.state.userID,
                  username: this.state.username,
                  trainingCount: this.state.trainingCount,
                  reputation: this.state.reputation,
                  friendCount: this.state.friendCount,
                  userTeamID: this.state.userTeamID,
                  usersTeam: this.state.usersTeam

                })
              }
            >
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

  profileGreenBackground: {
    backgroundColor: "#3bd774",
    height: 100
  },

  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1
  },

  navigationContainerIn: {
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
  },

  containerHeader: {
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

  boxTextWhite: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white"
  },

  boxText: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 2,
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
  },

  roundTextContainerBordered: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,

    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ededed",
    flexShrink: 1,
    marginTop: 12
  },

  roundTextContainerGreen: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 12,

    backgroundColor: "#3bd774",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 12
  }
});
