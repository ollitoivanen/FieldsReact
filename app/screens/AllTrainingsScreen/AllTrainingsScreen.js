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
var moment = require("moment");

import { info, trainings, edit_team, min, h } from "../../strings/strings";
import firebase from "react-native-firebase";
import TrainingListItem from "FieldsReact/app/components/TrainingListItem/TrainingListItem"; // we'll create this nextimport I18n from "FieldsReact/i18n";
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

class AllTrainingsScreen extends Component {
  loadTrainingList() {
    const ref = firebase.firestore().collection("Users");
    var serializedData;

    const trainings = [];

    const query = ref.doc(firebase.auth().currentUser.uid).collection("TR");
    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const { eT, re, fN } = doc.data();
            const startDate = doc.id;
            var date = moment(parseInt(startDate)).format("ddd D MMM");
            var startTime = moment(parseInt(startDate)).format("HH:mm");
            var endTime = moment(parseInt(eT)).format("HH:mm");

            var trainingTimeRaw = parseInt(eT) - parseInt(startDate);
            var seconds = trainingTimeRaw / 1000;
            var minutes = Math.trunc(seconds / 60);
            var hours = Math.trunc(minutes / 60);

            if (hours < 1) {
              var trainingTime = minutes + [I18n.t("min")];
            } else {
              var minSub = minutes - hours * 60;
              var trainingTime =
                hours + [I18n.t("h")] + " " + minSub + [I18n.t("min")];
            }

            trainings.push({
              key: doc.id,
              date,
              startTime,
              endTime,
              trainingTime,
              re,
              fN
            });
          });
        }.bind(this)
      )
      .then(() => {
        const alreadyVisited = [];
        serializedData = JSON.stringify(trainings, function(key, value) {
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
        this.storeData(serializedData);
      });
  }

  storeData = async data => {
    try {
      await AsyncStorage.setItem("trainings", data).then(this.retrieveData());
    } catch (error) {
      // Error saving data
    }
  };

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("trainings");
      if (value !== null) {
        //Usre team data redux is pretty uselsess
        if (JSON.parse(value).length === this.props.userData.tC) {
          var trainings = JSON.parse(value).sort(
            (a, b) => parseInt(b.key) - parseInt(a.key)
          );

          this.setState({ trainings: trainings });
        } else {
          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              tC: JSON.parse(value).length
            })
            .then(this.setState({ trainings: JSON.parse(value) }));
        }
      } else {
        this.loadTrainingList();
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
    var { params } = this.props.navigation.state;
    firebase
      .analytics()
      .setCurrentScreen("AllTrainingsScreen", "AllTrainingsScreen");

    this.retrieveData();

    this.state = {
      trainings: []
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
            {this.state.trainings.length + " " + [I18n.t("trainings")]}
          </Text>
        </View>

        <FlatList
          data={this.state.trainings}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TrainingListItem {...item} />
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
)(AllTrainingsScreen);

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
