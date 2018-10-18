import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  FlatList,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import {
  getUserData,
  getUserAndTeamData
} from "FieldsReact/app/redux/app-redux.js";

import firebase from "react-native-firebase";
import TeamPlayerListItem from "FieldsReact/app/components/TeamPlayerListItem/TeamPlayerListItem"; // we'll create this next
import I18n from "FieldsReact/i18n";

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

class TeamPlayersScreen extends Component {
  loadPlayersList() {
   
    const ref = firebase.firestore().collection("Teams");
    var serializedData;

    const players = [];

    const query = ref.doc(this.props.userData.uTI).collection("TU");
    query
      .get()
      .then(
        function(doc) {
          firebase
          .analytics()
          .logEvent("fetchTeamPlayersFromDB", doc.length)
          doc.forEach(doc => {
            const { unM } = doc.data();
            players.push({
              key: doc.id,
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
        firebase
        .firestore()
        .collection("Teams")
        .doc(this.props.userData.uTI)
        .get().then(doc=>{
          if (players.length !== doc.data().pC) {
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
    try {
      const value = await AsyncStorage.getItem("teamPlayers");
      if (value !== null) {
        firebase
                  .analytics()
                  .logEvent("fetchTeamPlayersFromAsync")
        //Usre team data redux is pretty uselsess
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.uTI)
          .get()
          .then(doc => {
            if (JSON.parse(value).length === doc.data().pC) {
              console.warn("toimii");
              this.setState({ players: JSON.parse(value) });
            } else {
              this.loadPlayersList();
            }
          });
      } else {
        this.loadPlayersList();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("TeamPlayersScreen", "TeamPlayersScreen");

    var { params } = this.props.navigation.state;

    this.retrieveData();

    this.state = {
      players: [],
      myKey: null,
      gg: "mmm"
    };
  }

  render() {
    var { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>
            {this.state.players.length + " " + [I18n.t("players")]}
          </Text>
        </View>

        <FlatList
          data={this.state.players}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TeamPlayerListItem {...item} />
            </View>
          )}
        />
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPlayersScreen);

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

  item: {
    width: "100%"
  }
});
