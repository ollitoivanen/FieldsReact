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
  pending_players,
  leave_team,
  are_you_sure_to_leave_team,
  nope
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
    getUserData: () => dispatch(getUserData())
  };
};

class TeamScreen extends Component {
  static navigationOptions = {
    header: null
  };

  loadPlayersList() {
    const ref = firebase.firestore().collection("Teams");

    const players = [];

    const query = ref.doc(this.props.userData.uTI).collection("TU");
    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const { unM } = doc.data();
            players.push({
              key: doc.id,
              doc,
              unM
            });
          });
          seen = [];

          /* json = JSON.stringify(obj, function(key, val) {
            if (typeof val == "object") {
              if (seen.indexOf(val) >= 0) return;
              seen.push(val);
            }
            return val;
          });*/
          this.setState({
            players
          });
        }.bind(this)
      )
      .then(() => {});
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  constructor(props) {
    super(props);
    this.loadPlayersList();

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
      teamUsernameEdit: this.props.userData.uTN
    };
  }

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
        date,
        startTime,

 
        eFN,
        //How to fetch name
        id,
        eT
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
    this.setState({ infoVisible: false, editVisible: visible });
  }

  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ teamUsernameEdit: newText });
  };

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
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({ uTI: firebase.firestore.FieldValue.delete() });
      })
      .then(() => {
        this.props.getUserData();
      })
      .then(() => {
        this.props.navigation.popToTop();
      });
  };

  render() {
    const saveTeamData = () => {
      if (this.state.teamUsernameEdit === this.props.userData.uTN) {
        this.setEditVisible(false);
        //Only saving the changed
      } else if (this.state.teamUsernameEdit !== this.props.userData.uTN) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.id)
          .update({
            tUN: this.state.teamFullNameEdit
          })
          .then(() => {
            //Save team users
            firebase.firestore().collection("Users").do;
          })
          .then(() => {
            this.props.getUserData();
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.teamFullNameEdit === this.props.userData.tFN &&
        this.state.teamUsernameEdit !== this.props.userData.uTN
      ) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.id)
          .update({
            uTN: this.state.teamUsernameEdit
          })
          .then(() => {
            this.props.getUserData();
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.teamFullNameEdit !== this.props.userData.tFN &&
        this.state.teamUsernameEdit !== this.props.userData.uTN
      ) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.id)
          .update({
            uTN: this.state.teamUsernameEdit,
            tFN: this.state.teamFullNameEdit
          })
          .then(() => {
            this.props.getUserData();
          })

          .then(() => {
            this.setEditVisible(false);
          });
      }
    };

    return (
      <View style={styles.container}>
        <Modal visible={this.state.editVisible} onRequestClose={() => {}}>
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
              <Text style={styles.teamName}>{edit_team}</Text>
            </View>

            <Text style={styles.headerText}>{team_username}</Text>
            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={team_username}
              value={this.state.teamUsernameEdit}
              onChangeText={this.usernameHandle}
            />
            <Text style={styles.headerText}>{team_full_name}</Text>

            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={team_full_name}
              value={this.state.teamFullNameEdit}
              onChangeText={teamFullNameEdit =>
                this.setState({ teamFullNameEdit })
              }
            />

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => saveTeamData()}
            >
              <Text style={styles.buttonText}>{save}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
                {are_you_sure_to_leave_team}
              </Text>

              <TouchableOpacity
                style={styles.leaveTeamButton}
                onPress={() => this.leaveTeam()}
              >
                <Text style={styles.buttonText}>{leave_team}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editTeamButton}
                onPress={() => this.openPendingPlayerList()}
              >
                <Text style={styles.buttonText}>{nope}</Text>
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
                {info}
              </Text>

              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => this.openPlayerList()}
              >
                <Text style={styles.infoText}>{players}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => this.openPendingPlayerList()}
              >
                <Text style={styles.infoText}>{pending_players}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editTeamButton}
                onPress={() => this.setEditVisible(true)}
              >
                <Text style={styles.buttonText}>{edit_team}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.leaveTeamButton}
                onPress={() => this.setLeaveVisible(true)}
              >
                <Text style={styles.buttonText}>{leave_team}</Text>
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
            <Text style={styles.teamName}>{this.props.userData.uTN}</Text>
          </View>
          <View style={styles.greenRowContainer}>
            <Image
              style={styles.fieldImage}
              source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
              borderRadius={35}
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
              source={require("FieldsReact/app/images/Info/info.png")}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.eventRowContainer}>
          <Text style={styles.teamName}>{events}</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateEventScreen", {
                fieldID: null
              })
            }
          >
            <Image
              style={styles.addIcon}
              source={require("FieldsReact/app/images/Add/add.png")}
            />
          </TouchableOpacity>
        </View>
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

        <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FeedScreen", {})}
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
                  fromEvent: false
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
                this.props.navigation.navigate("ProfileScreen", {})
              }
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Profile/profile.png")}
              />
            </TouchableOpacity>
          </View>
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

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10
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
    borderWidth: 5,
    padding: 5,
    borderColor: "white",
    marginTop: 10,
    marginStart: 6
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

  playersButton: {
    padding: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    marginTop: 8
  }
});
