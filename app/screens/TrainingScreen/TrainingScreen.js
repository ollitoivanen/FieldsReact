import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import {
  under_minute,
  min,
  h,
  currently_training_at,
  training_time,
  end_training
} from "../../strings/strings";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
var PushNotification = require("react-native-push-notification");
import PushService from "FieldsReact/PushService";
import I18n from "FieldsReact/i18n";

import {
  StackNavigator,
  StackActions,
  NavigationActions
} from "react-navigation";
import TrainingSummaryScreen from "../TrainingSummaryScreen/TrainingSummaryScreen";
var moment = require("moment");
const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};
class TrainingScreen extends Component {
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
            console.warn(trainingTimeRaw);
            var seconds = trainingTimeRaw / 1000;
            var minutes = Math.trunc(seconds / 60);
            var hours = Math.trunc(minutes / 60);
            console.warn(seconds + "ffff");

            if (hours < 1) {
              var trainingTime = minutes + [min];
            } else {
              var minSub = minutes - hours * 60;
              var trainingTime = hours + [h] + " " + minSub + [min];
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
        //if (JSON.parse(value).length === this.props.userData.tC) {
        this.setState({ trainings: JSON.parse(value) });
        // } else {
        //firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).update({
        //tC: JSON.parse(value).length+1
        //})
        // }
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
    this.retrieveData();
    this.notif = new PushService();

    this.ref = firebase.firestore().collection("Users");

    var { params } = this.props.navigation.state;
    this.state = {
      trainings: [],
      trainingTime: "",
      currentFieldID: "",
      startTime: params.startTime, //ONly thing via params
      currentTime: moment().format("x")
    };
  }

  componentWillMount = () => {
    this.getTrainingTime();
  };

  getTrainingTime = () => {
    var { params } = this.props.navigation.state;
    const startTime = params.startTime;
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

  endTraining = () => {
    // PushNotification.cancelLocalNotifications({ id: "10" });
    this.notif.cancelAll();

    var { params } = this.props.navigation.state;
    const startTime = params.startTime;
    const currentTime = moment().format("x");
    const trainingTime = currentTime - startTime;
    if (trainingTime < 900000) {
      this.ref
        .doc(firebase.auth().currentUser.uid)
        .update({
          cFI: firebase.firestore.FieldValue.delete(),
          cFN: firebase.firestore.FieldValue.delete(),
          ts: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Fields")
            .doc(params.fieldID)
            .get()
            .then(function(doc) {
              firebase
                .firestore()
                .collection("Fields")
                .doc(params.fieldID)
                .update({
                  pH: doc.data().pH - 1
                });
            });
        })

        .then(() => {
          this.props.getUserData();
        })

        .then(() =>
          this.props.navigation.replace("TrainingSummaryScreen", {
            trainingReputation: 0
          })
        );
    } else if (trainingTime > 18000000) {
      this.ref
        .doc(firebase.auth().currentUser.uid)
        .update({
          cFI: firebase.firestore.FieldValue.delete(),
          cFN: firebase.firestore.FieldValue.delete(),
          ts: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Fields")
            .doc(params.fieldID)
            .get()
            .then(function(doc) {
              firebase
                .firestore()
                .collection("Fields")
                .doc(params.fieldID)
                .update({
                  pH: doc.data().pH - 1
                });
            });
        })
        .then(() => {
          this.props.getUserData();
        })

        .then(() =>
          this.props.navigation.replace("TrainingSummaryScreen", {
            trainingReputation: 0
          })
        );
    } else {
      var currentReputation = this.props.userData.re;
      var trainingReputation = Math.trunc(trainingTime / 60000);
      var newReputation = trainingReputation + currentReputation;
      var trainings = this.state.trainings;

      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("TR")
        .doc(moment(parseInt(startTime)).format("x"))
        .set({
          re: trainingReputation,
          eT: moment(parseInt(currentTime)).format("x"),
          fN: this.props.userData.cFN
        });

      this.ref
        .doc(firebase.auth().currentUser.uid)
        .update({
          re: newReputation,
          tC: this.props.userData.tC + 1,
          cFI: firebase.firestore.FieldValue.delete(),
          cFN: firebase.firestore.FieldValue.delete(),
          ts: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Fields")
            .doc(params.fieldID)
            .get()
            .then(function(doc) {
              firebase
                .firestore()
                .collection("Fields")
                .doc(params.fieldID)
                .update({
                  pH: doc.data().pH - 1
                });
            });
        })
        .then(() => {
          console.warn("retrieving async");
        })
        .then(() => {
          var { params } = this.props.navigation.state;

          var trainings = this.state.trainings;
          var date = moment(parseInt(params.startTime)).format("ddd D MMM");
          var startTime = moment(parseInt(params.startTime)).format("HH:mm");
          var endTime = moment(parseInt(currentTime)).format("x");
          var endTimeHH = moment(parseInt(currentTime)).format("HH:mm");

          var trainingTimeRaw = parseInt(endTime) - parseInt(params.startTime);
          console.warn(trainingTimeRaw);
          var seconds = trainingTimeRaw / 1000;
          var minutes = Math.trunc(seconds / 60);
          var hours = Math.trunc(minutes / 60);
          console.warn(seconds + "ffff");

          if (hours < 1) {
            var trainingTime = minutes + [min];
          } else {
            var minSub = minutes - hours * 60;
            var trainingTime = hours + [h] + " " + minSub + [min];
          }

          console.warn("pushing to traiings", this.state.trainings);
          trainings.push({
            key: moment().format("x"),
            date,
            startTime,
            endTime: endTimeHH,
            trainingTime,
            re: trainingReputation,
            fN: this.props.userData.cFN
          });
        })
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
        })
        .then(() => {
          this.props.getUserData();
        })

        .then(() =>
          this.props.navigation.replace("TrainingSummaryScreen", {
            trainingReputation: trainingReputation
          })
        );

      //Add training to db
    }
  };

  render() {
    var { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <View style={styles.greenBackground}>
          <View style={styles.greenRowContainer}>
            <TouchableOpacity
              style={styles.backButton}
              underlayColor="#bcbcbc"
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.backButton}
                source={{ uri: "back_button" }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerText}>
            {I18n.t("currently_training_at")}
          </Text>
          <View style={styles.roundBackground}>
            <Text style={styles.fieldText}>{this.props.userData.cFN}</Text>
          </View>
          <Text style={styles.headerText}>{I18n.t("training_time")}</Text>

          <View style={styles.roundBackground}>
            <Text style={styles.trainingTimeText}>
              {this.state.trainingTime}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.roundBackgroundEnd}
            onPress={() => this.endTraining()}
          >
            <Text style={styles.endText}>{I18n.t("end_training")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainingScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  trainingTimeText: {
    fontSize: 40,
    fontWeight: "bold"
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center"
  },

  greenRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%"
  },
  backButton: {
    height: 48,
    width: 48
  },

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  roundBackground: {
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,

    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 20,
    marginStart: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },

  fieldText: {
    fontSize: 25,
    fontWeight: "bold"
  },

  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 36
  },

  roundBackgroundEnd: {
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,

    width: "100%",
    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginStart: 8,
    position: "absolute",
    bottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },

  endText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  }
});
