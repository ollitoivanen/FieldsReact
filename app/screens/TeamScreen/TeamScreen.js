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
  events
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
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  constructor(props) {
    super(props);

    this.ref = firebase
      .firestore()
      .collection("Events").where("team", "==", this.props.userData.userTeamID);
    this.unsubscribe = null;

    this.state = {
      events: [],
      infoVisible: false,
      editVisible: false,
      players: [], // remove text prefix here
      teamUsernameEdit: this.props.usersTeamData.teamUsername,
      teamFullNameEdit: this.props.usersTeamData.teamFullName
    };
  }

  onCollectionUpdate = querySnapshot => {
    const events = [];
    querySnapshot.forEach(doc => {
      const { endTime, eventFieldID, eventFieldName, eventType } = doc.data();
      const id = doc.id;
      const date = moment(id).format("ddd D MMM");
      const startTime = moment(id).format("HH:mm");

      events.push({
        date,
        startTime,

        key: doc.id,
        doc,
        eventType,
        eventFieldID,
        eventFieldName,
        //How to fetch name
        id,
        endTime
      });
    });
    this.setState({
      events
    });
  };

  openPlayerList() {
    this.setModalVisible(false);
    this.props.navigation.navigate("TeamPlayersScreen");
  }

  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  setEditVisible(visible) {
    this.setState({ infoVisible: false, editVisible: visible });
  }

  render() {
    const saveTeamData = () => {
      if (
        this.state.teamFullNameEdit === this.props.usersTeamData.teamFullName &&
        this.state.teamUsernameEdit === this.props.usersTeamData.teamUsername
      ) {
        this.setEditVisible(false);
        //Only saving the changed
      } else if (
        this.state.teamFullNameEdit !== this.props.usersTeamData.teamFullName &&
        this.state.teamUsernameEdit === this.props.usersTeamData.teamUsername
      ) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.usersTeamData.id)
          .update({
            teamFullName: this.state.teamFullNameEdit
          })
          .then(() => {
            this.props.getUserData();
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.teamFullNameEdit === this.props.usersTeamData.teamFullName &&
        this.state.teamUsernameEdit !== this.props.usersTeamData.teamUsername
      ) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.usersTeamData.id)
          .update({
            teamUsername: this.state.teamUsernameEdit
          })
          .then(() => {
            this.props.getUserData();
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.teamFullNameEdit !== this.props.usersTeamData.teamFullName &&
        this.state.teamUsernameEdit !== this.props.usersTeamData.teamUsername
      ) {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.usersTeamData.id)
          .update({
            teamUsername: this.state.teamUsernameEdit,
            teamFullName: this.state.teamFullNameEdit
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
              onChangeText={teamUsernameEdit =>
                this.setState({ teamUsernameEdit })
              }
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
                style={styles.editTeamButton}
                onPress={() => this.setEditVisible(true)}
              >
                <Text style={styles.buttonText}>{edit_team}</Text>
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
            <Text style={styles.teamName}>
              {this.props.usersTeamData.teamUsername}
            </Text>
          </View>
          <View style={styles.greenRowContainer}>
            <Image
              style={styles.fieldImage}
              source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
              borderRadius={35}
              resizeMode="cover"
            />

            <Text style={styles.teamFullName}>
              {this.props.usersTeamData.teamFullName}
            </Text>
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
                  eventFieldName: item.eventFieldName,
                  eventType: item.eventType,
                  startTime: item.startTime,
                  endTime: item.endTime,
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
                this.props.navigation.navigate("FieldSearchScreen", {})
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
