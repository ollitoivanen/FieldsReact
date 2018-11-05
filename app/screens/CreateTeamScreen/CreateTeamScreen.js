import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import {
  edit_team,
  team_full_name,
  team_username,
  save,
  create_team,
  please_fill_all_fields,
  get_team_location,
  team_location_set
} from "../../strings/strings";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import {
  getUserData,
  getUserAndTeamData
} from "FieldsReact/app/redux/app-redux.js";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";
import I18n from "FieldsReact/i18n";

const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData()),
    getUserAndTeamData: () => dispatch(getUserAndTeamData())
  };
};

class CreateTeamScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    firebase
      .analytics()
      .setCurrentScreen("CreateTeamScreen", "CreateTeamScreen");

    this.state = {
      teamUsername: "",
      errorMessage: "",
      teamImage: null,
      clearPath: null
    };
  }
  showPicker = () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = response.uri;
        let clearPath = response.uri;

        this.setState({
          teamImage: { uri: source },
          clearPath: clearPath
        });
      }
    });
  };

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
  };
  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ teamUsername: newText });
  };

  createTeam = () => {
    var { params } = this.props.navigation.state;

    var userID = firebase.auth().currentUser.uid;
    var teamID = this.guid().substring(0, 7);
    var teamName = this.state.teamUsername;
    let clearPath = this.state.clearPath;

    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    if (this.state.teamUsername !== "" && params.markerSet === true) {
      firebase.analytics().logEvent("newTeam");

      const co = new firebase.firestore.GeoPoint(
        Math.round(params.lt * 10000000) / 10000000,
        Math.round(params.ln * 10000000) / 10000000
      );
      if (clearPath !== null) {
        ImageResizer.createResizedImage(clearPath, 150, 150, "JPEG", 80).then(
          ({ uri }) => {
            var { params } = this.props.navigation.state;

            storageRef
              .child("teampics/" + teamID + "/" + teamID + ".jpg")
              .putFile(uri);
          }
        );
      }
      firebase
        .firestore()
        .collection("Teams")
        .doc(teamID)
        .set({
          tUN: this.state.teamUsername.trim(),
          pC: 1,
          co
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
                uTI: teamID,
                uTN: teamName.trim()
              });
          } else {
            firebase
              .firestore()
              .collection("Users")
              .doc(userID)
              .update({
                uTI: teamID,
                uTN: teamName.trim()
              });
          }
        })
        .then(() => {
          this.props.getUserAndTeamData();
        })
        .then(() => {
          this.props.navigation.popToTop();
        });
    } else {
      this.setState({ errorMessage: I18n.t("please_fill_all_fields") });
    }
  };
  render() {
    var { params } = this.props.navigation.state;

    if (params.lt === null) {
      var getTeamLocationBox = (
        <TouchableOpacity
          style={styles.getLocationBox}
          onPress={() =>
            this.props.navigation.navigate("MapScreen", {
              markerSet: false,
              lt: 0,
              ln: 0,
              latitudeDelta: 10000,
              longitudeDelta: 10000,
              from: "createTeam"
            })
          }
        >
          <Text style={styles.getLocationText}>
            {I18n.t("get_team_location")}
          </Text>
        </TouchableOpacity>
      );
    } else {
      var getTeamLocationBox = (
        <TouchableOpacity
          style={styles.getLocationBox}
          onPress={() =>
            this.props.navigation.navigate("MapScreen", {
              markerSet: true,
              lt: params.lt,
              ln: params.ln,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              from: "createTeam"
            })
          }
        >
          <Text style={styles.getLocationText}>
            {I18n.t("team_location_set")}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.state.teamImage === null) {
      var teamImage = (
        <Image
          style={styles.profileImageEdit}
          source={{ uri: "team_image_default" }}
          borderRadius={35}
          resizeMode="cover"
        />
      );
    } else {
      var teamImage = (
        <FastImage
          style={styles.profileImageEdit}
          source={this.state.teamImage}
          borderRadius={35}
          resizeMode="cover"
        />
      );
    }
    return (
      <ScrollView style={styles.editContainer}>
        <View style={styles.greenRowContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{I18n.t("create_team")}</Text>
        </View>

        <TouchableOpacity onPress={() => this.showPicker()}>
          {teamImage}
        </TouchableOpacity>

        <Text style={styles.headerText}>{I18n.t("team_username")}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={team_username}
          value={this.state.teamUsername}
          onChangeText={this.usernameHandle}
          autoCapitalize={"none"}
        />

        {getTeamLocationBox}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.createTeam()}
        >
          <Text style={styles.buttonText}>{I18n.t("create_team")}</Text>
        </TouchableOpacity>
        <Text style={styles.error}>{this.state.errorMessage}</Text>
      </ScrollView>
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
  },
  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    marginStart: 8
  },
  profileImageEdit: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "#e0e0e0",
    marginTop: 16,
    borderRadius: 40
  },

  getLocationBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#e0e0e0"
  },

  getLocationText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3bd774"
  }
});
