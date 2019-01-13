import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  PushNotificationIOS,
  AppState
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import FastImage from "react-native-fast-image";
import FeedFriendListItem from "FieldsReact/app/components/FeedFriendListItem/FeedFriendListItem"; // we'll create this next
var moment = require("moment");

import NavigationService from "FieldsReact/NavigationService";
import PushNotification from "react-native-push-notification";
import PushService from "FieldsReact/PushService";
import I18n from "FieldsReact/i18n";

import {
  not_in_a_team,
  not_at_any_field,
  friends,
  h,
  min,
  under_minute,
  add_friends_from_search
} from "../../strings/strings";
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

class FeedScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    setInterval(() => {
      console.warn(1);
    }, 1000);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    // console.warn(nextAppState);
    // this.notif.scheduledNotif("moi", "tämä", "toimii");
    if (nextAppState === "background") {
    }
  };
  onNotif(notif) {
    notif.finish(PushNotificationIOS.FetchResult.NoData);
    firebase.analytics().logEvent("from_notification");
    NavigationService.navigate("TrainingScreen", {
      startTime: notif.data.startTime,
      fieldID: notif.data.fieldID
    });
  }

  retrieveData = async () => {
    var { params } = this.props.navigation.state;

    const value = await AsyncStorage.getItem("friends");
    if (value !== null) {
      this.setState({ refreshing: false });
      firebase.analytics().logEvent("fetchingFriendsFromAsync");
      let friendArray = JSON.parse(value);
      //this.getCurrentFields(friendArray);
      this.setState({ friends: friendArray });
    } else {
      this.setState({ refreshing: false });

      this.loadFriendList();
    }
  };

  //Executed when async is null
  loadFriendList() {
    firebase.analytics().logEvent("fetchingFriendsFromDB");
    const ref = firebase.firestore().collection("Friends");
    var serializedData;

    const friends = [];

    const query = ref
      .where("aI", "==", firebase.auth().currentUser.uid)
      .limit(10);
    query.get().then(doc1 => {
      var promise = doc1.forEach(item => {
        firebase
          .firestore()
          .collection("Users")
          .doc(item.data().fI)
          .get()
          .then(doc => {
            if (doc.data().cFI === undefined) {
              friends.push({
                key: doc.id,
                aI: item.data().aI,
                fI: item.data().fI,
                fN: item.data().fN,
                cFN: I18n.t("not_at_any_field"),
                id: doc.id,

                uTI: doc.data().uTI,
                uTN: doc.data().uTN,
                un: doc.data().un,
                tC: doc.data().tC,
                cFI: doc.data().cFI,
                ts: doc.data().ts,
                docID: item.id,
                uIm: doc.data().uIm,
                re: doc.data().re
              });
            } else {
              const startTime = doc.data().ts;
              const currentTime = moment().format("x");
              const trainingTime = currentTime - startTime;
              const seconds = trainingTime / 1000;
              const minutes = Math.trunc(seconds / 60);
              const hours = Math.trunc(minutes / 60);

              if (minutes < 1) {
                var trainingTime = [under_minute];
              } else if (hours < 1) {
                var trainingTime = minutes + [min];
              } else {
                const minSub = minutes - hours * 60;
                var trainingTime = hours + [h] + " " + minSub + [min];
              }

              friends.push({
                key: doc.id,
                aI: item.data().aI,
                fI: item.data().fI,
                fN: item.data().fN,
                id: doc.id,

                ts: doc.data().ts,
                cFN: doc.data().cFN,
                trainingTime: trainingTime,
                uTI: doc.data().uTI,
                uTN: doc.data().uTN,
                un: doc.data().un,
                tC: doc.data().tC,
                cFI: doc.data().cFI,
                uIm: doc.data().uIm,
                re: doc.data().re
              });
            }
            this.setState({ friends: friends }),
              this.storeData(JSON.stringify(this.state.friends));
          });
      });

      Promise.all([promise]);
    });
  }

  storeData = async data => {
    try {
      await AsyncStorage.setItem("friends", data).then(() => {
        this.retrieveData();
      });
    } catch (error) {
      // Error saving data
    }
  };

  getTrainingTime = () => {
    var { params } = this.props.navigation.state;

    const startTime = params.ts;
    const currentTime = moment().format("x");
    const trainingTime = currentTime - startTime;
    const seconds = trainingTime / 1000;
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);

    if (minutes < 1) {
      this.setState({ trainingTime: [under_minute] });
    } else if (hours < 1) {
      this.setState({ trainingTime: minutes + [min] });
    } else {
      const minSub = minutes - hours * 60;
      this.setState({ trainingTime: hours + [h] + " " + minSub + [min] });
    }
  };

  getCurrentFields = array => {
    firebase.analytics().logEvent("fetchingFriendFields");
    var promise1 = this.retrieveData();
    let friendArrayEmpty = [];
    var friendArray = [];
    Promise.all([promise1])
      .then(() => {
        friendArray = this.state.friends;
        //It wokrs!!! that was 2 hours of pure focus
      })
      .then(() => {
        friendArray.forEach(
          function(item) {
            firebase
              .firestore()
              .collection("Users")
              .doc(item.fI)
              .get()
              .then(
                function(doc) {
                  if (doc.data().cFI === undefined) {
                    friendArrayEmpty.push({
                      key: item.key,
                      aI: item.aI,
                      fI: item.fI,
                      fN: doc.data().un,
                      cFN: I18n.t("not_at_any_field"),
                      id: doc.id,

                      uTI: doc.data().uTI,
                      uTN: doc.data().uTN,
                      un: doc.data().un,
                      tC: doc.data().tC,
                      docID: item.docID,
                      uIm: doc.data().uIm,
                      re: doc.data().re
                    });
                  } else {
                    const startTime = doc.data().ts;
                    const currentTime = moment().format("x");
                    const trainingTime = currentTime - startTime;
                    const seconds = trainingTime / 1000;
                    const minutes = Math.trunc(seconds / 60);
                    const hours = Math.trunc(minutes / 60);

                    if (minutes < 1) {
                      var trainingTime = [under_minute];
                    } else if (hours < 1) {
                      var trainingTime = minutes + [min];
                    } else {
                      const minSub = minutes - hours * 60;
                      var trainingTime = hours + [h] + " " + minSub + [min];
                    }

                    friendArrayEmpty.push({
                      key: item.key,
                      docID: item.docID,
                      id: doc.id,

                      aI: item.aI,
                      fI: item.fI,
                      fN: doc.data().un,
                      ts: doc.data().ts,
                      cFN: doc.data().cFN,
                      trainingTime: trainingTime,
                      uTI: doc.data().uTI,
                      uTN: doc.data().uTN,
                      un: doc.data().un,
                      tC: doc.data().tC,
                      cFI: doc.data().cFI,
                      uIm: doc.data().uIm,
                      re: doc.data().re
                    });
                  }
                }.bind(this)
              )
              .then(() => {
                if (friendArrayEmpty.length === friendArray.length) {
                  this.storeData(JSON.stringify(friendArrayEmpty));
                }
              });
          }.bind(this)
        );
      });
  };
  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getCurrentFields();
    });
  };

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
        this.setState({ teamImage: { uri: downloadedFile.toString() } });
      })
      .catch(err => {});
  };

  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("FeedScreen", "FeedScreen");
    this.notif = new PushService(this.onNotif.bind(this));

    this.getCurrentFields();
    this.getProfileImage();

    var { params } = this.props.navigation.state;

    this.state = {
      refreshing: false,
      currentUser: null,
      homeArea: "",
      friends: [],
      teamImage: null
    };
  }
  componentWillMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }

  render() {
    const { currentUser } = this.state;

    var teamCard;
    if (this.state.teamImage === null) {
      var teamImage = (
        <Image
          style={styles.profileImage}
          source={{ uri: "team_image_default" }}
          resizeMode="cover"
        />
      );
    } else {
      var teamImage = (
        <FastImage
          style={styles.profileImage}
          source={this.state.teamImage}
          resizeMode="cover"
        />
      );
    }

    if (this.props.userData.uTI !== undefined) {
      teamCard = (
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => {
            this.props.navigation.navigate("TeamScreen"),
              firebase.analytics().logEvent("feed_to_team");
          }}
        >
          {teamImage}

          <Text style={styles.teamCardText}>{this.props.userData.uTN}</Text>
        </TouchableOpacity>
      );
    } else {
      teamCard = (
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => {
            this.props.navigation.navigate("NoTeamScreen"),
              firebase.analytics().logEvent("feed_to_noteam");
          }}
        >
          <Image
            style={styles.profileImage}
            source={{ uri: "team_image_default" }}
            resizeMode="cover"
            borderRadius={50}
          />
          <Text style={styles.teamCardText}>{I18n.t("not_in_a_team")}</Text>
        </TouchableOpacity>
      );
    }

    var startGameButton = (
      <TouchableOpacity
        style={styles.startGameButton}
        onPress={() => {
          this.props.navigation.navigate("StartGameScreen");
        }}
      >
        <Text style={styles.startGameButtonText}>{I18n.t("challenges")}</Text>
      </TouchableOpacity>
    );

    if (this.state.friends.length === 0) {
      var feedFriendList = (
        <View style={{ flex: 1 }}>
          <FlatList
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            data={this.state.friends}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  this.props.navigation.navigate("DetailProfileScreen", {
                    uTI: item.uTI,
                    uTN: item.uTN,
                    un: item.un,
                    tC: item.tC,
                    cFI: item.cFI,
                    cFN: item.cFN,
                    ts: item.ts,
                    id: item.id,
                    re: item.re,
                    docID: item.docID
                  }),
                    firebase
                      .analytics()
                      .logEvent("opening_detail_profile_from_feed");
                }}
              >
                <FeedFriendListItem {...item} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("FieldSearchScreen", {
                selectedIndex: 2
              });
            }}
          >
            <Text style={styles.add_friends_text}>
              {I18n.t("add_friends_from_search")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      var feedFriendList = (
        <FlatList
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          data={this.state.friends}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                this.props.navigation.navigate("DetailProfileScreen", {
                  uTI: item.uTI,
                  uTN: item.uTN,
                  un: item.un,
                  tC: item.tC,
                  cFI: item.cFI,
                  cFN: item.cFN,
                  ts: item.ts,
                  re: item.re,
                  docID: item.docID,
                  id: item.id,
                  uIm: item.uIm
                }),
                  firebase
                    .analytics()
                    .logEvent("opening_detail_profile_from_feed");
              }}
            >
              <FeedFriendListItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.rowCont}>{teamCard}</View>
        {startGameButton}

        {feedFriendList}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image
              style={styles.navigationImage}
              source={{ uri: "home_icon_activated" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItemGreen}
            onPress={() => {
              this.props.navigation.navigate("FieldSearchScreen", {
                selectedIndex: 0,
                fromEvent: false
              }),
                firebase.analytics().logEvent("feed_to_search");
            }}
          >
            <Image
              style={styles.navigationImage2}
              source={{ uri: "stribe_icon" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => {
              this.props.navigation.navigate("ProfileScreen"),
                firebase.analytics().logEvent("feed_to_profile");
            }}
          >
            <Image
              style={styles.navigationImage}
              source={{ uri: "profile_icon" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111"
  },
  profileImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#4A4A4A",
    borderRadius: 30
  },
  rowCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40
  },

  item: {
    width: "100%"
  },

  addFriendBox: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  add_friends_text: {
    fontSize: 20,
    marginBottom: 200,
    textAlign: "center",
    color: "#e0e0e0",
    fontFamily: "Product Sans"
  },

  navigationContainer: {
    ...Platform.select({
      ios: {
        backgroundColor: "#111111",
        flexDirection: "row",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        backgroundColor: "#111111",
        flexDirection: "row",
        alignItems: "flex-end",
        elevation: 10
      }
    })
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemGreen: {
    flex: 1,
    height: 50,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center"
  },

  infoContainer: {
    height: 36,
    width: 36,
    marginEnd: 15,
    marginStart: 5
  },

  infoIcon: {
    height: 36,
    width: 36
  },

  navigationImage: {
    height: 30,
    width: 30
  },
  navigationImage2: {
    height: 40,
    width: 40
  },

  teamCard: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#202020",
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: "center"
  },
  startGameButton: {
    padding: 20,
    backgroundColor: "#D73B3B",
    borderRadius: 5,
    marginTop: 16,
    marginHorizontal: 10,
    alignItems: "center"
  },

  teamCardText: {
    flex: 1,
    flexWrap: "wrap",
    color: "white",
    fontSize: 18,
    marginStart: 16,
    fontFamily: "Product Sans"
  },
  startGameButtonText: {
    flexWrap: "wrap",
    color: "white",
    fontSize: 18,
    fontFamily: "Product Sans"
  },
  friendsText: {
    color: "black",
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
    fontSize: 16
  },
  friendsTextGreen: {
    color: "#3bd774",
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
    fontSize: 16
  }
});
