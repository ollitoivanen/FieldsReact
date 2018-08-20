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
var moment = require("moment");

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

    this.state = {
      trainingTime: "",
      fC: ""
    };
  }

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
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_1.png")}
        />
      );
    } else if (this.props.userData.re < 1500) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_2.png")}
        />
      );
    } else if (this.props.userData.re < 3000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_3.png")}
        />
      );
    } else if (this.props.userData.re < 6000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_4.png")}
        />
      );
    } else if (this.props.userData.re < 10000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_5.png")}
        />
      );
    } else if (this.props.userData.re < 15000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_6.png")}
        />
      );
    } else if (this.props.userData.re < 21000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_7.png")}
        />
      );
    } else if (this.props.userData.re < 28000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_8.png")}
        />
      );
    } else if (this.props.userData.re < 38000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_9.png")}
        />
      );
    } else if (this.props.userData.re < 48000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_10.png")}
        />
      );
    } else if (this.props.userData.re < 58000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_11.png")}
        />
      );
    } else if (this.props.userData.re < 70000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_12.png")}
        />
      );
    } else if (this.props.userData.re < 85000) {
      badge = (
        <Image
          style={styles.teamIcon}
          source={require("FieldsReact/app/images/Badges/badge_13.png")}
        />
      );
    } else if (this.props.userData.re >= 85000) {
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
          <Image
            style={styles.teamIcon}
            source={require("FieldsReact/app/images/Team/team.png")}
          />
          <Text style={styles.boxText}>{this.props.userData.uTN} </Text>
        </TouchableOpacity>
      );
    } else if (this.props.userData.uTI === undefined) {
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
    return (
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <View style={styles.backgroundGreen}>
            <View style={styles.imageTabContainer}>
              <Image
                style={styles.profileImage}
              
                source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
                borderRadius={35}
                resizeMode="cover"
              />
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.username}>{this.props.userData.un}</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SettingsScreen")}
              >
                <Image
                  style={styles.settingsIcon}
                  source={require("FieldsReact/app/images/Settings/settings.png")}
                />
              </TouchableOpacity>
            </View>
            {userTeamPlaceHolder}
          </View>

          <View style={styles.actionContainer}>
            <View style={styles.imageTabContainer}>
              <TouchableOpacity
                style={styles.roundTextContainer}
                onPress={() =>
                  this.props.navigation.navigate("UserFriendListScreen")
                }
              >
                <Text style={styles.boxText}>
                  {this.state.fC} {friends}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.roundTextContainer}>
                <Text style={styles.boxText}>
                  {this.props.userData.tC} {trainings}
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
                {this.props.userData.re} {reputation}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FeedScreen")}
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
            <TouchableOpacity style={styles.navigationItem}>
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Profile/profile_green.png")}
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

  containerHeader: {
    flex: 1,
    backgroundColor: "white"
  },

  backgroundGreen: {
    backgroundColor: "#3bd774",

    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20
  },

  profileImage: {
    width: 70,
    height: 70,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 5,
    padding: 5,
    borderColor: "white",
    marginTop: 16
  },

  username: {
    fontWeight: "bold",
    fontSize: 22
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
