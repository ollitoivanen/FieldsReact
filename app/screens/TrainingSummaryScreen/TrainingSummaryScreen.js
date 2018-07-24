import React, { Component } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Text,
  TouchableOpacity
} from "react-native";
import { you_earned, done, reputation } from "../../strings/strings";

export default class TrainingSummaryScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    var { params } = this.props.navigation.state;
    var trainingReputation = params.trainingReputation;
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{you_earned}</Text>
        <View style={styles.roundBackground}>
          <Text style={styles.headerText}>
            {trainingReputation} {reputation}
          </Text>
        </View>

        <TouchableOpacity style={styles.roundBackgroundEnd}>
          <Text
            style={styles.endText}
            onPress={() => this.props.navigation.goBack()}
          >
            {done}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3bd774",
    paddingTop: 80,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center"
  },

  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center"
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
