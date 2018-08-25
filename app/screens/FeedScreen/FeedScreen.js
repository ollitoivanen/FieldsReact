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
  AsyncStorage
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import FastImage from "react-native-fast-image";
import FeedFriendListItem from "FieldsReact/app/components/FeedFriendListItem/FeedFriendListItem"; // we'll create this next
var moment = require("moment");

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

  retrieveData = async () => {
    var { params } = this.props.navigation.state;

    const value = await AsyncStorage.getItem("friends");
    if (value !== null) {
      let friendArray = JSON.parse(value);
      this.getCurrentFields(friendArray);
      //this.setState({ friends: friendArray });
    }
    //Else
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
    let friendArray = [];
    array.forEach(item => {
      firebase
        .firestore()
        .collection("Users")
        .doc(item.fI)
        .get()
        .then(doc => {
          if (doc.data().cFI === undefined) {
            friendArray.push({
              key: item.key,
              id: item.id,
              aI: item.aI,
              fI: item.fI,
              fN: item.fN,
              cFN: [not_at_any_field],

              uTI: doc.data().uTI,
              uTN: doc.data().uTN,
              un: doc.data().un,
              tC: doc.data().tC,
              cFI: doc.data().cFI,
              ts: doc.data().ts,
              id: doc.id
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

            friendArray.push({
              key: item.key,
              id: item.id,
              aI: item.aI,
              fI: item.fI,
              fN: item.fN,
              ts: doc.data().ts,
              cFN: doc.data().cFN,
              trainingTime: trainingTime,
              uTI: doc.data().uTI,
              uTN: doc.data().uTN,
              un: doc.data().un,
              tC: doc.data().tC,
              cFI: doc.data().cFI,
              id: doc.id
            });
          }
        })
        .then(() => {
          this.setState({
            friends: friendArray
          });
        });
    });
  };

  constructor(props) {
    super(props);
    // this.props.getUserData();
    this.retrieveData();

    var { params } = this.props.navigation.state;

    this.state = {
      currentUser: null,
      homeArea: "",
      friends: []
    };
  }
  componentWillMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }

  render() {
    const { currentUser } = this.state;

    var teamCard;

    if (this.props.userData.uTI !== undefined) {
      teamCard = (
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => this.props.navigation.navigate("TeamScreen")}
        >
          <FastImage
            style={styles.profileImage}
            source={require("FieldsReact/app/images/TeamImageDefault/team_image_default.png")}
            resizeMode="cover"
            borderRadius={50}
          />
          <Text style={styles.teamCardText}>{this.props.userData.uTN}</Text>
        </TouchableOpacity>
      );
    } else {
      teamCard = (
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => this.props.navigation.navigate("NoTeamScreen")}
        >
          <FastImage
            style={styles.profileImage}
            source={require("FieldsReact/app/images/TeamImageDefault/team_image_default.png")}
            resizeMode="cover"
            borderRadius={50}
          />
          <Text style={styles.teamCardText}>{not_in_a_team}</Text>
        </TouchableOpacity>
      );
    }

    if (this.state.friends.length === 0) {
      var feedFriendList = (
        <View style={styles.addFriendBox}>
          <Text style={styles.add_friends_text}>{add_friends_from_search}</Text>
        </View>
      );
    } else {
      var feedFriendList = (
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                this.props.navigation.navigate("DetailProfileScreen", {
                  uTI: item.uTI,
                  uTN: item.uTN,
                  un: item.un,
                  tC: item.tC,
                  cFI: item.cFI,
                  cFN: item.cFN,
                  ts: item.ts,
                  id: item.id
                })
              }
            >
              <FeedFriendListItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.rowCont}>
          {teamCard}

          <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() =>
              this.props.navigation.navigate("SearchScreen", {
                selectedIndex: 0
              })
            }
          >
            <Image
              style={styles.infoIcon}
              source={require("FieldsReact/app/images/Search/search.png")}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.friendsText}>{friends}</Text>
        {feedFriendList}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Home/home_green.png")}
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
            onPress={() => this.props.navigation.navigate("ProfileScreen")}
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Profile/profile.png")}
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
    backgroundColor: "white"
  },
  profileImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e0e0e0",
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
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#e0e0e0"
  },

  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60
  },
  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
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
    height: 35,
    width: 35
  },

  teamCard: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "#e0e0e0",
    marginHorizontal: 10,
    flex: 1,
    alignItems: "center"
  },

  teamCardText: {
    fontWeight: "bold",
    flex: 1,
    flexWrap: "wrap",
    color: "black",
    fontSize: 18,
    marginStart: 16
  },

  friendsText: {
    color: "black",
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
    fontSize: 16
  }
});
