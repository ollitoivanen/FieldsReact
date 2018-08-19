import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text
} from "react-native";
import {
  edit_team,
  team_full_name,
  team_username,
  save,
  create_team,
  please_enter_username
} from "../../strings/strings";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class CreateTeamScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      teamUsername: "",
    };
  }
  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ teamUsername: newText });
  };

  createTeam = () => {
    var userID = firebase.auth().currentUser.uid;
    var teamID = this.guid().substring(0, 7);

    firebase
      .firestore()
      .collection("Teams")
      .doc(teamID)
      .set({
        tUN: this.state.teamUsername.toLowerCase().trim(),
        pC: 1
      })
      .then(() => {
        firebase
          .firestore()
          .collection("Teams")
          .doc(teamID)
          .collection("TU")
          .doc(userID)
          .set({
            unM: this.props.userData.un
          });
      })
      .then(() => {
        if (this.props.userData.pT !== undefined) {
          firebase
            .firestore()
            .collection("Teams")
            .doc(this.props.userData.pT)
            .collection("PTU")
            .doc(userID)
            .delete();
          firebase
            .firestore()
            .collection("Users")
            .doc(userID)
            .update({
              pT: firebase.firestore.FieldValue.delete(),
              uTI: teamID
            });
        } else {
          firebase
            .firestore()
            .collection("Users")
            .doc(userID)
            .update({
              uTI: teamID
            });
        }
      }).then(()=>{
          this.props.getUserData()
      }).then(()=>{
          this.props.navigation.popToTop()
      });
  };
  render() {
    return (
      <View style={styles.editContainer}>
        <View style={styles.greenRowContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.setEditVisible(false)}
          >
            <Image
              style={styles.backButton}
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.teamName}>{create_team}</Text>
        </View>

        <Text style={styles.headerText}>{team_username}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={team_username}
          value={this.state.teamUsername}
          onChangeText={this.usernameHandle}
          autoCapitalize={"none"}
        />

        <Text></Text>
       

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.createTeam()}
        >
          <Text style={styles.buttonText}>{create_team}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTeamScreen);
const styles = StyleSheet.create({
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },

  editContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },

  textInput: {
    height: 60,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 20
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10
  },

  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
  },
  greenRowContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});
