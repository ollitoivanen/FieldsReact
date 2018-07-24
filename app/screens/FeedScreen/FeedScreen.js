import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import {
  not_in_a_team,
  not_at_any_field
} from "FieldsReact/app/strings/strings";

import {currentFieldID1} from 'FieldsReact/index.js'

export default class FeedScreen extends React.Component {
  componentWillUnmount() {
    this.unsubscribe();
  }
  static navigationOptions = {
    header: null
  };

  getUserData = () => {
    this.ref.get().then(
      function(doc) {
        if (doc.exists) {
          this.setState({
            homeArea: doc.data().homeArea,
            userID: doc.data().userID,
            currentFieldID: doc.data().currentFieldID,
            currentFieldName: doc.data().currentFieldName,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
            trainingCount: doc.data().trainingCount,
            friendCount: doc.data().friendCount,
            userTeamID: doc.data().userTeamID,
            reputation: doc.data().reputation
          });
          if (this.state.currentFieldID == "") {
            this.setState({
              currentFieldName: [not_at_any_field]
            });
          }

          if (this.state.userTeamID == null) {
            this.setState({
              usersTeam: [not_in_a_team],
              loading: false
            });
          } else {
            const teamRef = firebase.firestore().collection("Teams");
            const query = teamRef.where("teamID", "==", this.state.userTeamID);
            query.get().then(
              function(teamDoc) {
                if (!teamDoc.empty) {
                  teamDoc.forEach(
                    function(teamData) {
                      this.setState({
                        usersTeam: teamData.data().teamUsernameText,
                        loading: false
                      });
                    }.bind(this)
                  );
                }
              }.bind(this)
            );
          }
        }
      }.bind(this)
    );
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.unsubscribe = null;

    this.state = {
      currentUser: null,
      homeArea: "",
      loading: true
    };
    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }
  componentWillMount() {
    this.unsubscribe = this.getUserData();

    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }
  render() {
    const { currentUser, loading } = this.state;

    if (loading == true) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <Text
            style={styles.container1}
            onPress={() => firebase.auth().signOut()}
          />
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Home/home_green.png")}
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
            <TouchableOpacity
              style={styles.navigationItem}
              onPress={() =>
                this.props.navigation.navigate("ProfileScreen", {
                  homeArea: this.state.homeArea,
                  currentFieldID: this.state.currentFieldID,
                  currentFieldName: this.state.currentFieldName,
                  timestamp: this.state.timestamp,
                  userID: this.state.userID,
                  username: this.state.username,
                  trainingCount: this.state.trainingCount,
                  friendCount: this.state.friendCount,
                  userTeamID: this.state.userTeamID,
                  reputation: this.state.reputation,
                  usersTeam: this.state.usersTeam
                })
              }
            >
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
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60
  },
  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
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
