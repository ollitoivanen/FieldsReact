import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  FlatList,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
var moment = require("moment");

import EventListItem from "FieldsReact/app/components/EventListItem/EventListItem"; // we'll create this next

import {
  info,
  players,
  edit_team,
  team_full_name,
  team_username,
  save,
  events,
  request_pending,
  request_pending_on_other_team,
  join_team,
  remove_old_request_and_send_new_request_to_this_team,
  remove_request,
  no_upcoming_events
} from "../../strings/strings";
import firebase from "react-native-firebase";
import PlayerListItem from "FieldsReact/app/components/PlayerListItem/PlayerListItem"; // we'll create this next
import FastImage from "react-native-fast-image";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class DetailTeamScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;
    this.loadEvents();
    this.getProfileImage();

    this.state = {
      events: [],
      infoVisible: false,
      editVisible: false,
      removeRequestVisible: false,
      removeAndSendRequestVisible: false,
      players: [],
      profileImage: require("FieldsReact/app/images/TeamImageDefault/team_image_default.png")
    };
  }

  getProfileImage = () => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();
    var { params } = this.props.navigation.state;

    storageRef
      .child("teampics/" + params.teamID + "/" + params.teamID + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({
          profileImage: { uri: downloadedFile.toString() }
        });
      });
  };

  loadEvents = () => {
    var { params } = this.props.navigation.state;
    var ref = firebase.firestore().collection("Events");
    const query = ref.where("tI", "==", params.teamID);
    const events = [];
    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const { eT, eFI, eFN, eTY } = doc.data();
          const id = doc.id;
          const date = moment(id).format("ddd D MMM");
          const startTime = moment(id).format("HH:mm");

          events.push({
            date,
            startTime,

            key: doc.id,
            doc,
            eTY,
            eFI,
            eFN,
            //How to fetch name
            id,
            eT
          });
        });
        this.setState({
          events
        });
      }.bind(this)
    );
  };

  openRemoveRequestModal = visible => {
    this.setState({ removeRequestVisible: visible });
  };

  openRemoveAndSendRequestModal = visible => {
    this.setState({ removeAndSendRequestVisible: visible });
  };

  render() {
    const removeRequest = () => {
      firebase
        .firestore()
        .collection("Teams")
        .doc(params.teamID)
        .collection("PTU")
        .doc(firebase.auth().currentUser.uid)
        .delete()

        .then(() => {
          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              pT: firebase.firestore.FieldValue.delete()
            });
        })
        .then(() => {
          this.props.getUserData();
        })

        .then(() => {
          this.openRemoveRequestModal(false);
        });
    };
    const sendRequest = () => {
      firebase
        .firestore()
        .collection("Teams")
        .doc(params.teamID)
        .collection("PTU")
        .doc(firebase.auth().currentUser.uid)
        .set({
          pUN: this.props.userData.un
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)

            .update({
              pT: params.teamID
            });
        })
        .then(() => {
          this.props.getUserData();
        });
    };
    const removeRequestAndSendNewOne = () => {
      firebase
        .firestore()
        .collection("Teams")
        .doc(this.props.userData.pT)
        .collection("PTU")
        .doc(firebase.auth().currentUser.uid)
        .delete()

        .then(() => {
          firebase
            .firestore()
            .collection("Teams")
            .doc(params.teamID)
            .collection("PTU")
            .doc(firebase.auth().currentUser.uid)
            .set({
              pUN: this.props.userData.un
            });
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)

            .update({
              pT: params.teamID
            });
        })
        .then(() => this.props.getUserData())
        .then(this.openRemoveAndSendRequestModal(false));
    };

    var { params } = this.props.navigation.state;

    //Set modals for remove request and remove request && send new request
    if (this.props.userData.pT !== undefined) {
      if (this.props.userData.pT === params.teamID) {
        var joinTeam = (
          <TouchableOpacity
            style={styles.roundTextContainer}
            onPress={() => this.openRemoveRequestModal(true)}
          >
            <Text style={styles.blueText}>{request_pending}</Text>
          </TouchableOpacity>
        );
      } else if (this.props.userData.pT !== params.teamID) {
        var joinTeam = (
          <TouchableOpacity
            style={styles.roundTextContainer}
            onPress={() => this.openRemoveAndSendRequestModal()}
          >
            <Text style={styles.blueText}>{request_pending_on_other_team}</Text>
          </TouchableOpacity>
        );
      }
    } else if (this.props.userData.pT === undefined) {
      if (this.props.userData.uTI === undefined) {
        var joinTeam = (
          <TouchableOpacity
            style={styles.roundTextContainer}
            onPress={() => sendRequest()}
            //Permissions
          >
            <Text style={styles.blueText}>{join_team}</Text>
          </TouchableOpacity>
        );
      } else if (this.props.userData.uTI !== undefined) {
        var joinTeam = null;
      }
    }

    if (this.state.events.length !== 0) {
      var eventList = (
        <FlatList
          style={{ marginBottom: 50 }}
          data={this.state.events}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                this.props.navigation.navigate("DetailEventScreen", {
                  eventFieldName: item.eFN,
                  eventType: item.eTY,
                  startTime: item.startTime,
                  endTime: item.eT,
                  date: item.date,
                  id: item.id
                })
              }
            >
              <EventListItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    } else {
      var eventList = (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>{no_upcoming_events}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.removeRequestVisible}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#00000080",
              alignItems: "center"
            }}
            onPress={() => {
              this.openRemoveRequestModal(false);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.openRemoveRequestModal(false);
              }}
            >
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  removeRequest();
                }}
              >
                <Text style={styles.removeText}>{remove_request}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.removeAndSendRequestVisible}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#00000080",
              alignItems: "center"
            }}
            onPress={() => {
              this.openRemoveAndSendRequestModal(false);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.openRemoveAndSendRequestModal(false);
              }}
            >
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  removeRequestAndSendNewOne();
                }}
              >
                <Text style={styles.removeText}>
                  {remove_old_request_and_send_new_request_to_this_team}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <View style={styles.greenBackground}>
          <View style={styles.greenRowContainer}>
            <TouchableOpacity
              style={styles.backButton}
              underlayColor="#bcbcbc"
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.backButton}
                source={require("FieldsReact/app/images/BackButton/back_button.png")}
              />
            </TouchableOpacity>
            <Text style={styles.teamName}>{params.teamUsername}</Text>
          </View>
          <View style={styles.greenRowContainer}>
            <FastImage
              style={styles.fieldImage}
              source={this.state.profileImage}
              resizeMode="cover"
            />

            <Text style={styles.teamFullName}>{params.teamUsername}</Text>
          </View>

          {joinTeam}
        </View>

        <View style={styles.eventRowContainer}>
          <Text style={styles.teamName}>{events}</Text>
        </View>
        {eventList}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("FeedScreen", {})}
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image style={styles.navigationImage} source={{ uri: "home" }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItemGreen}
            onPress={() =>
              this.props.navigation.navigate("FieldSearchScreen", {
                selectedIndex: 0,

                fromEvent: false
              })
            }
          >
            <Image
              style={styles.navigationImage}
              source={{ uri: "field_icon" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => this.props.navigation.navigate("ProfileScreen", {})}
          >
            <Image style={styles.navigationImage} source={{ uri: "profile" }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailTeamScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  locationBox: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  locationText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#e0e0e0",
    margin: 20
  },

  removeButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    elevation: 3
  },

  removeText: {
    color: "white",
    fontWeight: "bold"
  },

  blueText: {
    color: "#3facff",
    fontWeight: "bold",
    fontSize: 16
  },

  roundTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: 6,
    paddingBottom: 6,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 8
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1
  },
  playerListContainer: {
    flex: 1,

    backgroundColor: "white"
  },

  fieldImage: {
    width: 70,
    height: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "white",
    marginTop: 10,
    marginStart: 6,
    borderRadius: 35
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  teamFullName: {
    fontWeight: "bold",
    fontSize: 22,
    alignSelf: "center",
    marginStart: 20,
    flexWrap: "wrap",
    flex: 1
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  addIcon: {
    height: 44,
    width: 44,
    marginTop: 2
  },

  item: {
    width: "100%"
  },
  infoContainer: {
    position: "absolute",
    bottom: 18,
    end: 12,
    height: 36,
    width: 36
  },

  infoIcon: {
    height: 36,
    width: 36
  },

  infoText: {
    fontWeight: "bold",
    margin: 4,
    textAlign: "center"
  },

  editTeamButton: {
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

  textInput: {
    height: 60,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 20
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

  eventRowContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center"
  },

  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  editContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 10
  },
  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
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

  playersButton: {
    padding: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    marginTop: 8
  }
});
