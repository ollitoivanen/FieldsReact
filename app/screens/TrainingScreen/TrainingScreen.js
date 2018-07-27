import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
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
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    
    this.ref = firebase.firestore().collection("Users");

    var { params } = this.props.navigation.state;
    this.state = {
      trainingTime: "",
      currentFieldID: "",
      startTime: params.startTime, //ONly thing via params
      currentTime: moment().format("x"),
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

  endTraining = () => {
    var { params } = this.props.navigation.state;
    const startTime = params.startTime;
    const currentTime = moment().format("x");
    const trainingTime = currentTime - startTime;
    if (trainingTime < 900000) {
      this.ref
        .doc(firebase.auth().currentUser.uid)
        .update({
          currentFieldID: "",
          currentFieldName: "",
          timestamp: null
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
                peopleHere: doc.data().peopleHere -1
              });
            })
            
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
          currentFieldID: "",
          currentFieldName: "",
          timestamp: null
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
      var currentReputation = this.props.userData.reputation;
      var trainingReputation = Math.trunc(trainingTime / 60000);
      var newReputation = trainingReputation + currentReputation;
      this.ref
        .doc(firebase.auth().currentUser.uid)
        .update({
          reputation: newReputation,
          trainingCount: this.props.userData.trainingCount + 1,
          currentFieldID: "",
          currentFieldName: "",
          timestamp: null
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
                source={require("FieldsReact/app/images/BackButton/back_button.png")}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerText}>{currently_training_at}</Text>
          <View style={styles.roundBackground}>
            <Text style={styles.fieldText}>
              {this.props.userData.currentFieldName}
            </Text>
          </View>
          <Text style={styles.headerText}>{training_time}</Text>

          <View style={styles.roundBackground}>
            <Text style={styles.trainingTimeText}>
              {this.state.trainingTime}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.roundBackgroundEnd}
            onPress={() => this.endTraining()}
          >
            <Text style={styles.endText}>{end_training}</Text>
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
    marginStart: 8
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
    bottom: 16
  },

  endText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  }
});
