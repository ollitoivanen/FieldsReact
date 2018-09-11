import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  FlatList,
  TextInput,
  AsyncStorage,
  Platform
} from "react-native";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";

import {
  getUserData,
  getUserAndTeamData
} from "FieldsReact/app/redux/app-redux.js";

var moment = require("moment");

import EventListItem from "FieldsReact/app/components/EventListItem/EventListItem"; // we'll create this next
import I18n from "FieldsReact/i18n";

import {
  info,
  players,
  edit_team,
  team_full_name,
  team_username,
  save,
  events,
  pending_players,
  leave_team,
  are_you_sure_to_leave_team,
  nope,
  no_upcoming_events
} from "../../strings/strings";
import firebase from "react-native-firebase";
import PlayerListItem from "FieldsReact/app/components/PlayerListItem/PlayerListItem"; // we'll create this next

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

class TeamScreen extends Component {
  static navigationOptions = {
    header: null
  };

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

  storeData = async data => {
    try {
      await AsyncStorage.setItem("teamPlayers", data)
        .then(() => {})
        .then(this.retrieveData());
    } catch (error) {
      // Error saving data
    }
  };

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

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  constructor(props) {
    super(props);
    this.getProfileImage();

    this.ref = firebase
      .firestore()
      .collection("Events")
      .where("tI", "==", this.props.userData.uTI);
    this.unsubscribe = null;

    this.state = {
      events: [],
      infoVisible: false,
      editVisible: false,
      leaveVisible: false,
      players: [],
      teamImage: require("FieldsReact/app/images/TeamImageDefault/team_image_default.png"),
      editImageClearPath: null
    };
  }

  getProfileImage = () => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child(
        "teampics/" +
          this.props.userData.uTI +
          "/" +
          this.props.userData.uTI +
          ".jpg"
      )
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({
          teamImage: { uri: downloadedFile.toString() }
        });
      })
      .catch(err => {});
  };

  deleteEvent = id => {
    firebase
      .firestore()
      .collection("Events")
      .doc(id)
      .collection("EU")
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            firebase
              .firestore()
              .collection("Events")
              .doc(id)
              .collection("EU")
              .doc(doc.id)
              .delete();
          });
        }.bind(this)
      )
      //Arrow function waits till the whole collection is deleted!
      .then(() => {
        firebase
          .firestore()
          .collection("Events")
          .doc(id)
          .delete();
      });
  };

  onCollectionUpdate = querySnapshot => {
    const events = [];
    querySnapshot.forEach(doc => {
      const { eT, eFI, eFN, eTY } = doc.data();
      const id = doc.id;

      const date = moment(id).format("ddd D MMM");

      const startTime = moment(id).format("HH:mm");

      var diff = moment().format("x") - moment(id).format("x");
      if (diff > 86400000) {
        this.deleteEvent(id);
      }

      events.push({
        key: doc.id,
        date,
        startTime,
        eFI,

        eFN,
        //How to fetch name
        id,
        eT,
        eTY
      });
    });
    this.setState({
      events
    });
  };

  openPlayerList() {
    this.setModalVisible(false);
    this.props.navigation.navigate("TeamPlayersScreen", {
      plp: this.state.players
    });
  }

  openPendingPlayerList() {
    this.setModalVisible(false);
    this.props.navigation.navigate("TeamPendingPlayersScreen");
  }

  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  setLeaveVisible(visible) {
    this.setState({ infoVisible: false, leaveVisible: visible });
  }

  setEditVisible(visible) {
    this.setState({ infoVisible: false }),
      this.props.navigation.navigate("EditTeamScreen", {
        teamUsername: this.props.userData.uTN,
        teamImage: this.state.teamImage,
        lt: null,
        ln: null
      });
  }

  leaveTeam = () => {
    firebase
      .firestore()
      .collection("Teams")
      .doc(this.props.userData.uTI)
      .collection("TU")
      .doc(firebase.auth().currentUser.uid)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.uTI)
          .get()
          .then(doc => {
            if (doc.data().pC === 1) {
              firebase
                .firestore()
                .collection("Teams")
                .doc(this.props.userData.uTI)
                .delete();
            } else {
              firebase
                .firestore()
                .collection("Teams")
                .doc(this.props.userData.uTI)
                .update({
                  pC: doc.data().pC - 1
                });
            }
          })
          .then(() => {
            firebase
              .firestore()
              .collection("Users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                uTI: firebase.firestore.FieldValue.delete(),
                uTN: firebase.firestore.FieldValue.delete()
              });
          })
          .then(() => {
            this.props.getUserAndTeamData();
          });
      })

      .then(() => {
        this.props.navigation.popToTop();
      });
  };

  render() {
    var eventList;
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
          <Text style={styles.locationText}>
            {I18n.t("no_upcoming_events")}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.leaveVisible}
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
              this.setLeaveVisible(!this.state.leaveVisible);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.setLeaveVisible(!this.state.leaveVisible);
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 8,
                  marginStart: 4
                }}
              >
                {I18n.t("are_you_sure_to_leave_team")}
              </Text>

              <TouchableOpacity
                style={styles.leaveTeamButton}
                onPress={() => this.leaveTeam()}
              >
                <Text style={styles.buttonText}>{I18n.t("leave_team")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editTeamButton}
                onPress={() => this.openPendingPlayerList()}
              >
                <Text style={styles.buttonText}>{I18n.t("nope")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.infoVisible}
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
              this.setModalVisible(!this.state.infoVisible);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.setModalVisible(!this.state.infoVisible);
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 8,
                  marginStart: 4
                }}
              >
                {I18n.t("info")}
              </Text>

              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => this.openPlayerList()}
              >
                <Text style={styles.infoText}>{I18n.t("players")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => this.openPendingPlayerList()}
              >
                <Text style={styles.infoText}>{I18n.t("pending_players")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editTeamButton}
                onPress={() => this.setEditVisible(true)}
              >
                <Text style={styles.buttonText}>{I18n.t("edit_team")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.leaveTeamButton}
                onPress={() => this.setLeaveVisible(true)}
              >
                <Text style={styles.buttonText}>{I18n.t("leave_team")}</Text>
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
                source={{ uri: "back_button" }}
              />
            </TouchableOpacity>
            <Text style={styles.teamName}>{this.props.userData.uTN}</Text>
          </View>
          <View style={styles.greenRowContainer}>
            <FastImage
              style={styles.teamImage}
              source={this.state.teamImage}
              resizeMode="cover"
            />

            <Text style={styles.teamUsername}>{this.props.userData.uTN}</Text>
          </View>

          <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() => this.setModalVisible(true)}
          >
            <Image
              style={styles.infoIcon}
              source={{ uri: "info" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.eventRowContainer}>
          <Text style={styles.teamName}>{I18n.t("events")}</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateEventScreen", {
                fieldID: null
              })
            }
          >
            <Image style={styles.addIcon} source={{ uri: "add" }} />
          </TouchableOpacity>
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
)(TeamScreen);

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

  teamImage: {
    width: 80,
    height: 80,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "white",
    marginTop: 10,
    marginStart: 6,

    borderRadius: 40
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  teamUsername: {
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
    width: 36,
    elevation: 10
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

  leaveTeamButton: {
    backgroundColor: "red",
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
