import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  AsyncStorage
} from "react-native";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import I18n from "FieldsReact/i18n";

import {
  getUserData,
  getUserAndTeamData
} from "FieldsReact/app/redux/app-redux.js";

import {
  please_fill_all_fields,
  team_username,
  edit_team,
  save,
  change_team_location
} from "../../strings/strings";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData()),
    getUserAndTeamData: () => dispatch(getUserAndTeamData())
  };
};

class EditTeamScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("EditTeamScreen", "EditTeamScreen");

    var { params } = this.props.navigation.state;
    this.retrieveData();

    this.state = {
      teamUsername: params.teamUsername,
      teamImage: params.teamImage,
      clearPath: null,
      players: [],
      errorMessage: "",

      ogLt: null
    };
  }
  loadPlayersList() {
    const ref = firebase.firestore().collection("Teams");
    var serializedData;

    const players = [];

    const query = ref.doc(this.props.userData.uTI).collection("TU");
    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const { unM } = doc.data();
            const id = doc.id;
            players.push({
              key: doc.id,
              id,
              unM
            });
          });
        }.bind(this)
      )
      .then(() => {
        const alreadyVisited = [];
        serializedData = JSON.stringify(players, function(key, value) {
          if (typeof value == "object") {
            if (alreadyVisited.indexOf(value.key) >= 0) {
              // do something other that putting the reference, like
              // putting some name that you can use to build the
              // reference again later, for eg.
              return value.key;
            }
            alreadyVisited.push(value.name);
          }
          return value;
        });
      })
      .then(() => {
        this.props.getUserAndTeamData();
      })
      .then(() => {
        if (players.length !== this.props.usersTeamData.pC) {
          //If player count differs from list length, update
          firebase
            .firestore()
            .collection("Teams")
            .doc(this.props.userData.uTI)
            .update({
              pC: players.length
            });
        }
      })
      .then(() => {
        this.storeData(serializedData);
      });
  }
  retrieveData = async () => {
    this.props.getUserAndTeamData();
    try {
      const value = await AsyncStorage.getItem("teamPlayers");
      if (value !== null) {
        //If player count changes, this falls out, propably should call getuserdata here
        if (JSON.parse(value).length === this.props.usersTeamData.pC) {
          this.setState({ players: JSON.parse(value) });
        } else {
          this.loadPlayersList();
        }
      } else {
        this.loadPlayersList();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  storeData = async data => {
    try {
      await AsyncStorage.setItem("teamPlayers", data).then(this.retrieveData());
    } catch (error) {
      // Error saving data
    }
  };

  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ teamUsername: newText });
  };

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

  openMap = () => {
    var { params } = this.props.navigation.state;

    if (params.lt === null) {
      firebase
        .firestore()
        .collection("Teams")
        .doc(this.props.userData.uTI)
        .get()
        .then(doc => {
          this.setState({ ogLt: doc.data().co.latitude });
          this.props.navigation.navigate("MapScreen", {
            markerSet: true,
            lt: doc.data().co.latitude,
            ln: doc.data().co.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            from: "editTeam"
          });
        });
    } else {
      this.props.navigation.navigate("MapScreen", {
        markerSet: true,
        lt: params.lt,
        ln: params.ln,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        from: "editTeam"
      });
    }
  };

  render() {
    var { params } = this.props.navigation.state;

    const saveTeamData = () => {
      var { params } = this.props.navigation.state;

      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();

      let imagePath = this.state.teamImage;
      let clearPath = this.state.clearPath;

      if (this.state.teamUsername !== "") {
        if (clearPath !== null) {
          ImageResizer.createResizedImage(
            clearPath,
            150,
            150,
            "JPEG",
            80
          ).then(({ uri }) => {
            var { params } = this.props.navigation.state;

            storageRef
              .child(
                "teampics/" +
                  this.props.userData.uTI +
                  "/" +
                  this.props.userData.uTI +
                  ".jpg"
              )
              .putFile(uri);
          });
        }
        if (this.state.teamUsername === this.props.userData.uTN) {
          if (this.state.ogLt === null || this.state.ogLt === params.lt) {
            this.props.navigation.goBack();
          } else {
            const co = new firebase.firestore.GeoPoint(
              Math.round(params.lt * 10000000) / 10000000,
              Math.round(params.ln * 10000000) / 10000000
            );
            firebase
              .firestore()
              .collection("Teams")
              .doc(this.props.userData.uTI)
              .update({
                co
              })
              .then(() => {
                this.props.navigation.goBack();
              });
          }
          //Only saving the changed
        } else if (this.state.teamUsername !== this.props.userData.uTN) {
          if (this.state.ogLt !== null && this.state.ogLt !== params.lt) {
            const co = new firebase.firestore.GeoPoint(
              Math.round(params.lt * 10000000) / 10000000,
              Math.round(params.ln * 10000000) / 10000000
            );
            firebase
              .firestore()
              .collection("Teams")
              .doc(this.props.userData.uTI)
              .update({
                tUN: this.state.teamUsername.toLowerCase().trim(),
                co
              })

              .then(() => {
                let playerList = this.state.players;
                playerList.forEach(doc => {
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(doc.id)
                    .update({
                      uTN: this.state.teamUsername.toLowerCase().trim()
                    });
                });
              })
              .then(() => {
                this.props.getUserAndTeamData();
              })

              .then(() => {
                this.props.navigation.navigate("TeamScreen");
              });
          } else {
            firebase
              .firestore()
              .collection("Teams")
              .doc(this.props.userData.uTI)
              .update({
                tUN: this.state.teamUsername.toLowerCase().trim()
              })

              .then(() => {
                let playerList = this.state.players;
                playerList.forEach(doc => {
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(doc.id)
                    .update({
                      uTN: this.state.teamUsername.toLowerCase().trim()
                    });
                });
              })
              .then(() => {
                this.props.getUserAndTeamData();
              })

              .then(() => {
                this.props.navigation.navigate("TeamScreen");
              });
          }
        }
      } else {
        this.setState({ errorMessage: I18n.t("please_fill_all_fields") });
      }
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.greenRowContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.fieldName}>{I18n.t("edit_team")}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => this.showPicker()}>
          <FastImage
            style={styles.profileImageEdit}
            source={this.state.teamImage}
            borderRadius={35}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{I18n.t("team_username")}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={I18n.t("team_username")}
          value={this.state.teamUsername}
          onChangeText={this.usernameHandle}
        />

        <TouchableOpacity
          style={styles.getLocationBox}
          onPress={() => this.openMap()}
        >
          <Text style={styles.getLocationText}>
            {I18n.t("change_team_location")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => saveTeamData()}
        >
          <Text style={styles.buttonText}>{I18n.t("save")}</Text>
        </TouchableOpacity>
        <Text style={styles.error}>{this.state.errorMessage}</Text>
      </ScrollView>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeamScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
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
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12,
    marginEnd: 40,
    flexWrap: "wrap"
  },

  greenRowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  pickerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
    marginBottom: 10,
    marginStart: 8
  },
  dialogText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 8
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
  },
  getLocationBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#e0e0e0"
  },
  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    marginStart: 8
  }
});
