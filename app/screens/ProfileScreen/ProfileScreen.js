import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Platform
} from "react-native";
import { connect } from "react-redux";
var moment = require("moment");
import FastImage from "react-native-fast-image";
import I18n from "FieldsReact/i18n";

import firebase from "react-native-firebase";

import {
  trainings,
  friends,
  not_in_a_team,
  reputation,
  not_at_any_field,
  under_minute,
  h,
  min
} from "../../strings/strings";

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

class ProfileScreen extends Component {
  componentWillMount() {
    this.getTrainingTime();
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.retrieveData();
    if (this.props.userData.uIm === true) {
      this.getProfileImage();
    }

    this.state = {
      trainingTime: "",
      fC: "",
      profileImage: require("FieldsReact/app/images/ProfileImageDefault/profile_image_default.png")
    };
  }

  getProfileImage = () => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child(
        "profilepics/" +
          firebase.auth().currentUser.uid +
          "/" +
          firebase.auth().currentUser.uid +
          ".jpg"
      )
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({ profileImage: { uri: downloadedFile.toString() } });
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
      let friendArray = JSON.parse(value);
      this.setState({ fC: friendArray.length });
    } else {
      this.loadFriendList();
    }
  };

  getTrainingTime = () => {
    const startTime = this.props.userData.ts;
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
    if (this.props.userData.re < 500) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_1" }} />;
    } else if (this.props.userData.re < 1500) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_2" }} />;
    } else if (this.props.userData.re < 3000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_3" }} />;
    } else if (this.props.userData.re < 6000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_4" }} />;
    } else if (this.props.userData.re < 10000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_5" }} />;
    } else if (this.props.userData.re < 15000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_6" }} />;
    } else if (this.props.userData.re < 21000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_7" }} />;
    } else if (this.props.userData.re < 28000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_8" }} />;
    } else if (this.props.userData.re < 38000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_9" }} />;
    } else if (this.props.userData.re < 48000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_10" }} />;
    } else if (this.props.userData.re < 58000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_11" }} />;
    } else if (this.props.userData.re < 70000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_12" }} />;
    } else if (this.props.userData.re < 85000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_13" }} />;
    } else if (this.props.userData.re >= 85000) {
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_14" }} />;
    }

    var currentFieldPlaceHolder = (
      <TouchableOpacity style={styles.roundTextContainerBordered}>
        <Text style={styles.boxText}>{I18n.t("not_at_any_field")}</Text>
      </TouchableOpacity>
    );
    if (this.props.userData.cFI !== "") {
      var currentFieldPlaceHolder = (
        <TouchableOpacity
          style={styles.roundTextContainerBordered}
          onPress={() =>
            this.props.navigation.navigate("TrainingScreen", {
              startTime: this.props.userData.ts,
              fieldID: this.props.userData.cFI
            })
          }
        >
          <Text style={styles.boxText}>
            {this.props.userData.cFN + ", " + this.state.trainingTime}
          </Text>
        </TouchableOpacity>
      );
    }

    //This
    if (this.props.userData.uTI !== undefined) {
      var userTeamPlaceHolder = (
        <TouchableOpacity
          style={styles.roundTextContainer}
          onPress={() => this.props.navigation.navigate("TeamScreen")}
        >
          <Image style={styles.teamIcon} source={{ uri: "team" }} />
          <Text style={styles.boxText}>{this.props.userData.uTN} </Text>
        </TouchableOpacity>
      );
    } else if (this.props.userData.uTI === undefined) {
      var userTeamPlaceHolder = (
        <TouchableOpacity style={styles.roundTextContainer}>
          <Image style={styles.teamIcon} source={{ uri: "team" }} />
          <Text style={styles.boxText}>{I18n.t("not_in_a_team")} </Text>
        </TouchableOpacity>
      );
    }

    if (this.state.profileImage !== null) {
      var profileImage = (
        <FastImage
          style={styles.profileImage}
          source={this.state.profileImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <View style={styles.backgroundGreen}>
            {profileImage}
            <View style={styles.rowCont}>
              <Text style={styles.username}>{this.props.userData.un}</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SettingsScreen")}
              >
                <Image
                  style={styles.settingsIcon}
                  source={{ uri: "settings" }}
                />
              </TouchableOpacity>
            </View>
            {userTeamPlaceHolder}
          </View>

          <View style={styles.actionContainer}>
            <View style={styles.imageTabContainer}>
              <TouchableOpacity
                style={styles.textContainer}
                onPress={() =>
                  this.props.navigation.navigate("UserFriendListScreen")
                }
              >
                <Text style={styles.boxText}>
                  {this.state.fC} {I18n.t("friends")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textContainer}
                onPress={() =>
                  this.props.navigation.navigate("AllTrainingsScreen")
                }
              >
                <Text style={styles.boxText}>
                  {this.props.userData.tC} {I18n.t("trainings")}
                </Text>
              </TouchableOpacity>
            </View>

            {currentFieldPlaceHolder}

            <TouchableOpacity
              style={styles.roundTextContainerBordered}
              onPress={() => this.props.navigation.navigate("ReputationScreen")}
            >
              {badge}
              <Text style={styles.boxText}>
                {this.props.userData.re} {I18n.t("reputation")}
              </Text>
            </TouchableOpacity>

          </View>
<View style={{flex: 1, width: '100%',  position: "absolute",
                bottom: 66,}}>
            <TouchableOpacity
              style={{
                padding: 10,
                paddingVertical: 15,
                backgroundColor: "#3facff",
                borderWidth: 3, 
                borderColor: "#e0e0e0",
               
                marginHorizontal: 16,
                borderRadius: 50,
                justifyContent: "center"
              }}
              onPress={() => this.props.navigation.navigate("FieldsPlusScreen")}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16
                }}
              >
                {I18n.t("fields_plus")}
              </Text>
            </TouchableOpacity>
            </View>
        </View>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("FeedScreen")}
            style={styles.navigationItem}
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
          <TouchableOpacity style={styles.navigationItem}>
            <Image
              style={styles.navigationImage}
              source={{ uri: "profile_green" }}
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
)(ProfileScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
    ...Platform.select({
      ios: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "flex-end",
        elevation: 10
      }
    })
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
    padding: 20,
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
    borderRadius: 40,
    padding: 5,
    borderColor: "white",
    marginTop: 16
  },

  username: {
    fontWeight: "bold",
    fontSize: 22,
    color: "black"
  },
  roundTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: 6,
    paddingBottom: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,

    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 8
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
