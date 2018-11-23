import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Modal,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

import firebase from "react-native-firebase";

import {
  trainings,
  friends,
  not_in_a_team,
  reputation,
  not_at_any_field,
  h,
  min,
  under_minute,
  remove_friend,
  add_friend,
  report,
  info
} from "../../strings/strings";
import FastImage from "react-native-fast-image";
var moment = require("moment");
import I18n from "FieldsReact/i18n";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getuserData: () => dispatch(getuserData())
  };
};

class DetailProfileScreen extends Component {
  componentWillMount() {
    this.getTrainingTime();
  }
  static navigationOptions = {
    header: null
  };

  getProfileImage = () => {
    var { params } = this.props.navigation.state;

    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();
    storageRef
      .child("profilepics/" + params.id + "/" + params.id + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({ profileImagePath: { uri: downloadedFile } });
      })
      .catch(err => {});
  };

  loadFriendList() {
    const ref = firebase.firestore().collection("Friends");
    var serializedData;

    const friends = [];

    const query = ref.where("aI", "==", firebase.auth().currentUser.uid);
    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const { aI, fI, fN } = doc.data();
            const id = doc.id;
            friends.push({
              key: doc.id,
              id,
              aI,
              fI,
              fN
            });
          });
        }.bind(this)
      )
      .then(() => {
        serializedData = JSON.stringify(friends);
      })

      .then(() => {
        this.storeData(serializedData);
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

  retrieveData = async () => {
    var { params } = this.props.navigation.state;

    const value = await AsyncStorage.getItem("friends");
    if (value !== null) {
      this.setState({ friends: JSON.parse(value) });

      let friendArray = JSON.parse(value);

      let foundFriend = friendArray.find(
        friendArray => friendArray.fI === params.id
      );
      if (foundFriend === undefined) {
        this.setState({ friendStatus: false });
      } else {
        this.setState({ friendStatus: true });
      }
    } else {
      this.loadFriendList();
    }
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

  removeFriend = () => {
    this.setState({ friendStatus: null });

    var { params } = this.props.navigation.state;

    let friendArray = this.state.friends;

    let friendRemoved = friendArray.find(
      friendArray => friendArray.fI === params.id
    );
    let index = friendArray.indexOf(friendRemoved);
    friendArray.splice(index, 1);

    serializedData = JSON.stringify(friendArray);
    this.storeData(serializedData);

    let friendRemovedID = friendRemoved.docID;

    firebase
      .firestore()
      .collection("Friends")
      .doc(friendRemovedID)
      .delete();
  };

  addFriend = () => {
    this.setState({ friendStatus: null });
    var { params } = this.props.navigation.state;

    var friendID = this.guid().substring(0, 7);
    let friendArray = this.state.friends;
    const docID = friendID;
    const aI = firebase.auth().currentUser.uid;
    const fI = params.id;
    const fN = params.un;

    if (params.cFI !== undefined) {
      const startTime = params.ts;
      const currentTime = moment().format("x");
      var trainingTime = currentTime - startTime;
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
      friendArray.push({
        key: params.id,
        id: params.id,
        trainingTime: trainingTime,
        docID,
        aI,
        fI,
        fN,
        uTI: params.uTI,
        uTN: params.uTN,
        un: params.un,
        tC: params.tC,
        cFI: params.cFI,
        cFN: params.cFN,
        ts: params.ts,
        re: params.re
      });
    } else {
      friendArray.push({
        key: params.id,
        id: params.id,
        docID,
        aI,
        fI,
        fN,
        uTI: params.uTI,
        uTN: params.uTN,
        un: params.un,
        tC: params.tC,
        uIm: params.uIm,
        cFN: I18n.t("not_at_any_field"),
        ts: params.ts,
        re: params.re
      });
    }

    serializedData = JSON.stringify(friendArray);
    this.storeData(serializedData);

    firebase
      .firestore()
      .collection("Friends")
      .doc(friendID)
      .set({
        aI: firebase.auth().currentUser.uid,
        fI: params.id,
        fN: params.un
      });
  };

  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  constructor(props) {
    super(props);

    firebase
      .analytics()
      .setCurrentScreen("DetailProfileScreen", "DetailProfileScreen");

    this.retrieveData();
    var { params } = this.props.navigation.state;

    if (params.uIm === true) {
      this.getProfileImage();
    }

    this.state = {
      trainingTime: "",
      friends: [],
      friendStatus: null,
      infoVisible: false,
      //Karinainen perkele
      profileImagePath: null
    };
  }

  getTrainingTime = () => {
    var { params } = this.props.navigation.state;

    const startTime = params.ts;
    const currentTime = moment().format("x");
    const trainingTime = currentTime - startTime;
    this.setState({ trainingTime: trainingTime });
    const seconds = trainingTime / 1000;
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);

    if (minutes < 1) {
      this.setState({ trainingTime: [I18n.t("under_minute")] });
    } else if (hours < 1) {
      this.setState({ trainingTime: minutes + [I18n.t("min")] });
    } else {
      const minSub = minutes - hours * 60;
      this.setState({
        trainingTime: hours + [I18n.t("h")] + " " + minSub + [I18n.t("min")]
      });
    }
  };

  render() {
    let badge;
    if (this.state.friendStatus === true) {
      var friendButton = (
        <TouchableOpacity
          style={styles.roundTextContainer}
          onPress={() => this.removeFriend()}
        >
          <Text style={styles.blueText}>{I18n.t("remove_friend")}</Text>
        </TouchableOpacity>
      );
    } else if (this.state.friendStatus === null) {
      var friendButton = null;
    } else {
      var friendButton = (
        <TouchableOpacity
          style={styles.roundTextContainer}
          onPress={() => this.addFriend()}
        >
          <Text style={styles.blueText}>{I18n.t("add_friend")}</Text>
        </TouchableOpacity>
      );
    }
    var { params } = this.props.navigation.state;
    if (params.re === undefined) {
      var re = 0;
    } else {
      var re = params.re;
    }

    if (re < 200) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_1" }} />;
    } else if (re < 500) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_2" }} />;
    } else if (re < 900) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_3" }} />;
    } else if (re < 1500) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_4" }} />;
    } else if (re < 2300) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_5" }} />;
    } else if (re < 3500) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_6" }} />;
    } else if (re < 5000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_7" }} />;
    } else if (re < 7000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_8" }} />;
    } else if (re < 10000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_9" }} />;
    } else if (re < 15000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_10" }} />;
    } else if (re < 23000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_11" }} />;
    } else if (re < 35000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_12" }} />;
    } else if (re < 50000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_13" }} />;
    } else if (re < 70000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_14" }} />;
    } else if (re < 100000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_15" }} />;
    } else if (re >= 100000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_16" }} />;
    }

    var currentFieldPlaceHolder = (
      <TouchableOpacity style={styles.roundTextContainerBordered}>
        <Text style={styles.boxText}>{I18n.t("not_at_any_field")}</Text>
      </TouchableOpacity>
    );
    if (params.cFI !== undefined) {
      var currentFieldPlaceHolder = (
        <TouchableOpacity style={styles.roundTextContainerBordered}>
          <Text style={styles.boxText}>
            {params.cFN + ", " + this.state.trainingTime}
          </Text>
        </TouchableOpacity>
      );
    }

    if (params.uTI !== undefined) {
      var userTeamPlaceHolder = (
        <TouchableOpacity style={styles.roundTextContainer}>
          <Image style={styles.teamIcon} source={{ uri: "team" }} />
          <Text style={styles.boxText}>{params.uTN} </Text>
        </TouchableOpacity>
      );
    } else if (params.uTI === undefined) {
      var userTeamPlaceHolder = (
        <TouchableOpacity style={styles.roundTextContainer}>
          <Image style={styles.teamIcon} source={{ uri: "team" }} />
          <Text style={styles.boxText}>{I18n.t("not_in_a_team")} </Text>
        </TouchableOpacity>
      );
    }
    if (params.tC === undefined) {
      var tC = 0;
    } else {
      var tC = params.tC;
    }

    if (params.fC === undefined) {
      var fC = 0;
    } else {
      var fC = params.fC;
    }
    if (params.re === undefined) {
      var re = 0;
    } else {
      var re = params.re;
    }

    var navigation = (
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
    );

    if (this.state.profileImagePath === null) {
      var profileImage = (
        <Image
          style={styles.profileImage}
          source={{ uri: "profile_image_default" }}
          resizeMode="cover"
        />
      );
    } else {
      var profileImage = (
        <FastImage
          style={styles.profileImage}
          source={this.state.profileImagePath}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.container}>
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
                onPress={() => {
                  this.props.navigation.navigate("SupportScreen"),
                    this.setModalVisible(false);
                }}
              >
                <Text style={styles.infoText}>{I18n.t("report")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{params.un}</Text>
        </View>
        <View style={styles.containerHeader}>
          <View style={styles.backgroundGreen}>
            <View style={styles.imageTabContainer}>{profileImage}</View>
            <Text style={styles.username}>{params.un}</Text>

            {userTeamPlaceHolder}
            {friendButton}
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

          <ScrollView style={styles.actionContainer}>
            <View style={styles.imageTabContainer}>
              <TouchableOpacity style={styles.textContainer}>
                <Text style={styles.boxText}>
                  {tC} {I18n.t("trainings")}
                </Text>
              </TouchableOpacity>
            </View>

            {currentFieldPlaceHolder}

            <TouchableOpacity style={styles.roundTextContainerBordered}>
              {badge}
              <Text style={styles.boxText}>
                {re} {I18n.t("reputation")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {navigation}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailProfileScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  blueText: {
    color: "#3facff",
    fontWeight: "bold",
    margin: 4
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#3bd774"
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
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

  rowCont: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginLeft: 26
  },

  profileGreenBackground: {
    backgroundColor: "#3bd774",
    height: 100
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

  containerHeader: {
    flex: 1,
    backgroundColor: "white"
  },

  backgroundGreen: {
    backgroundColor: "#3bd774",

    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderRadius: 40,
    borderColor: "white"
  },

  username: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 8
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
    marginTop: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: 6,
    paddingBottom: 6,

    backgroundColor: "white",
    flexShrink: 1,
    marginTop: 8
  },

  boxTextWhite: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white"
  },

  boxText: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 2,
    color: "#636363"
  },

  teamIcon: {
    width: 25,
    height: 25,
    marginRight: 4
  },
  settingsIcon: {
    width: 25,
    height: 25,
    marginLeft: 4,
    marginTop: 1
  },

  imageTabContainer: {
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },

  actionContainer: {
    flex: 1,
    marginBottom: 50
  },

  roundTextContainerBordered: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,

    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ededed",
    flexShrink: 1,
    marginTop: 12
  },

  roundTextContainerGreen: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 14,

    backgroundColor: "#3bd774",
    borderRadius: 50,
    flexShrink: 1,
    marginTop: 12
  },
  playersButton: {
    padding: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    marginTop: 8
  },
  infoText: {
    fontWeight: "bold",
    margin: 4,
    textAlign: "center"
  }
});
