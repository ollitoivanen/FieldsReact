import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Animatable from "react-native-animatable";
var moment = require("moment");

export default class SpeedChallengeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      goalTime: 10,
      goalScore: 1,
      score: 0
    };
  }

  startTimer = () => {
    this.refs.progressBar.transitionTo(
      {
        flex:0
      },
      10000,
      'linear'
      
    )
    var speed = 1000;
    var easing = "linear";
    setInterval(() => {
      this.setState({ time: this.state.time - 1 }, () => {

       
      });
    }, 1000);
  };

  componentDidMount = () => {
    this.startTimer()
  };
  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }
  startGame = () => {
    //
  };

  increaseSpeed = () => {
    console.warn("nbesj");
    score = this.state.score + 1;
  };
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Animatable.View style={styles.container} ref={"background"}>
        <View style={styles.progressBar}>
          <Animatable.View ref={"progressBar"} style={styles.progressBar2}>
          </Animatable.View>
        </View>

        <TouchableOpacity
          activeOpacity={1.0}
          style={{ flex: 1 }}
          onPress={() => this.increaseSpeed()}
        />
                <Text style={styles.timeText}>{this.state.time}</Text>

      </Animatable.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    flexDirection: "row"
  },
  progressBar: {

    backgroundColor: "#111111",
    width: 50
  },
  progressBar2: {
    flex: 1,

    backgroundColor: "blue"
  },

  timeText: {
    fontFamily: "Product Sans",
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 6
  }
});
