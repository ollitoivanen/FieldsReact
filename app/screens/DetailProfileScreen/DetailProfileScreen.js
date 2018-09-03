import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  AsyncStorage
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
  add_friend
} from "../../strings/strings";
import FastImage from "react-native-fast-image";
var moment = require("moment");

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
    friendArray.pop(friendRemoved);

    serializedData = JSON.stringify(friendArray);
    this.storeData(serializedData);

    let friendRemovedID = friendRemoved.id;

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
    const id = friendID;
    const aI = firebase.auth().currentUser.uid;
    const fI = params.id;
    const fN = params.un;
    friendArray.push({
      key: params.id,
      id,
      aI,
      fI,
      fN
    });

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

  constructor(props) {
    super(props);

    this.retrieveData();
    var { params } = this.props.navigation.state;

    this.getProfileImage();

    this.state = {
      trainingTime: "",
      friends: [],
      friendStatus: null,
      //Karinainen perkele
      profileImagePath: { uri: "profile_image_default" }
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
      this.setState({ trainingTime: [under_minute] });
    } else if (hours < 1) {
      this.setState({ trainingTime: minutes + [min] });
    } else {
      const minSub = minutes - hours * 60;
      this.setState({ trainingTime: hours + [h] + " " + minSub + [min] });
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
          <Text style={styles.blueText}>{remove_friend}</Text>
        </TouchableOpacity>
      );
    } else if (this.state.friendStatus === null) {
      var friendButton = (
        <View style={styles.roundTextContainer}>
          <Text style={styles.blueText}>{add_friend}</Text>
        </View>
      );
    } else {
      var friendButton = (
        <TouchableOpacity
          style={styles.roundTextContainer}
          onPress={() => this.addFriend()}
        >
          <Text style={styles.blueText}>{add_friend}</Text>
        </TouchableOpacity>
      );
    }
    var { params } = this.props.navigation.state;
    if (params.re === undefined) {
      var re = 0;
    } else {
      var re = params.re;
    }

    if (re < 500) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_1.png")}
        />
      );
    } else if (re < 1500) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_2.png")}
        />
      );
    } else if (re < 3000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_3.png")}
        />
      );
    } else if (re < 6000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_4.png")}
        />
      );
    } else if (re < 10000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_5.png")}
        />
      );
    } else if (re < 15000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_6.png")}
        />
      );
    } else if (re < 21000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_7.png")}
        />
      );
    } else if (re < 28000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_8.png")}
        />
      );
    } else if (re < 38000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_9.png")}
        />
      );
    } else if (re < 48000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_10.png")}
        />
      );
    } else if (re < 58000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_11.png")}
        />
      );
    } else if (re < 70000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_12.png")}
        />
      );
    } else if (re < 85000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_13.png")}
        />
      );
    } else if (re >= 85000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_14.png")}
        />
      );
    }

    var currentFieldPlaceHolder = (
      <TouchableOpacity style={styles.roundTextContainerBordered}>
        <Text style={styles.boxText}>{not_at_any_field}</Text>
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
          <Image
            style={styles.teamIcon}
            source={require("FieldsReact/app/images/Team/team.png")}
          />
          <Text style={styles.boxText}>{params.uTN} </Text>
        </TouchableOpacity>
      );
    } else if (params.uTI === undefined) {
      var userTeamPlaceHolder = (
        <TouchableOpacity style={styles.roundTextContainer}>
          <Image
            style={styles.teamIcon}
            source={require("FieldsReact/app/images/Team/team.png")}
          />
          <Text style={styles.boxText}>{not_in_a_team} </Text>
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

    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
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
          <Text style={styles.teamName}>{params.un}</Text>
        </View>
        <View style={styles.containerHeader}>
          <View style={styles.backgroundGreen}>
            <View style={styles.imageTabContainer}>
              <FastImage
                style={styles.profileImage}
                source={this.state.profileImagePath}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.username}>{params.un}</Text>

            {userTeamPlaceHolder}
            {friendButton}
          </View>

          <View style={styles.actionContainer}>
            <View style={styles.imageTabContainer}>
              <TouchableOpacity style={styles.textContainer}>
                <Text style={styles.boxText}>
                  {tC} {trainings}
                </Text>
              </TouchableOpacity>
            </View>

            {currentFieldPlaceHolder}

            <TouchableOpacity style={styles.roundTextContainerBordered}>
              {badge}
              <Text style={styles.boxText}>
                {re} {reputation}
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#3bd774"
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
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
    flex: 1
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
  }
});
