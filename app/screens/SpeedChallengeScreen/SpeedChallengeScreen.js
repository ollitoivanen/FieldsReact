import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal
} from "react-native";
import * as Animatable from "react-native-animatable";
var moment = require("moment");

export default class SpeedChallengeScreen extends Component {
  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.state = {
      time: 0,
      goalTime: 10,
      goalScore: 10,
      score: 0,
      opponentScore: 0,
      opponentSpeedPerk: params.opponentSpeedPerk,
      speedPerk: 1,
      start: false,
      countdown: 3,
      opponentTap: null
    };
  }

  startIntro = () => {
    

    var introTimer = setInterval(() => {
      if (this.state.countdown !== 1) {
        this.setState({ countdown: this.state.countdown - 1 });
      } else {
        this.setState({ start: true }, () => {
          this.startGame();
        });
        clearInterval(introTimer);
      }
    }, 1000);
  };

  componentDidMount = () => {
    this.startIntro();
  };
  componentWillUnmount() {
    clearInterval(this.state.opponentTap);
  }
  startGame = () => {
    var opponentTap = setInterval(() => {
      this.setState(
        {
          opponentScore: this.state.opponentScore + this.state.opponentSpeedPerk
        },
        () => {
          this.refs.progressBarOpponent.transitionTo(
            { flex: 1 - this.state.opponentScore / this.state.goalScore },
            20000,
            "linear"
          );
          this.refs.progressBar2Opponent.transitionTo(
            { flex: this.state.opponentScore / this.state.goalScore },
            20000,
            "linear"
          );
        }
      );
    }, 100);

    this.setState({ opponentTap });
  };

  increaseSpeed = () => {
    this.setState({ score: this.state.score + this.state.speedPerk }, () => {
      this.refs.progressBar.transitionTo(
        { flex: 1 - this.state.score / this.state.goalScore },
        20000,
        "linear"
      );
      this.refs.progressBar2.transitionTo(
        { flex: this.state.score / this.state.goalScore },
        20000,
        "linear"
      );
    });
  };
  static navigationOptions = {
    header: null
  };
  render() {
    if (this.state.start === false) {
      return (
        <View style={styles.introContainer}>
          <View style={styles.countdownContainer}>
            <Animatable.Text
              animation={"zoomIn"}
              duration={1000}
              iterationCount={3}
              style={styles.countdownText}
            >
              {this.state.countdown}
            </Animatable.Text>
          </View>
          <View style={styles.introContainer}>
<Text style={styles.introText}>Tap as fast as possible</Text>
            <Animatable.View
              duration={1000}
              animation={"fadeOut"}
              iterationCount={"infinite"}
              ref={"introTapBox2"}
              style={styles.introTapBox}
            />
          
          </View>
        </View>
      );
    } else {
      return (
        <Animatable.View style={styles.container} ref={"background"}>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => this.increaseSpeed()}
            style={styles.container}
          >
            <View>
              <Animatable.View
                style={styles.progressBar}
                ref={"progressBarOpponent"}
              />
              <Animatable.View
                ref={"progressBar2Opponent"}
                style={styles.progressBar2}
              >
                <Text style={styles.timeText}>Rival</Text>
              </Animatable.View>
            </View>
            <View>
              <Animatable.View style={styles.progressBar} ref={"progressBar"} onLayout={event => {
                  var { x, y, width, height } = event.nativeEvent.layout;
                  if (height === 0) {
                    console.warn("won");
                  }
                }} />
              <Animatable.View
                
                ref={"progressBar2"}
                style={styles.progressBar2}
              >
                <Text style={styles.timeText}>You</Text>
              </Animatable.View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  countdownContainer: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center"
  },
  introContainer: {
    flex: 1,
    backgroundColor: "#111111"
  },
  progressBar: {
    backgroundColor: "#111111",
    width: 100,
    flex: 1
  },
  progressBarOpponent: {
    backgroundColor: "#111111",
    width: 100,
    flex: 1
  },
  progressBar2: {
    flex: 0.05,
    width: 100,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,

    backgroundColor: "#D73b3b"
  },

  timeText: {
    fontFamily: "Product Sans",
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 6
  },
  countdownText: {
    fontFamily: "Product Sans",
    color: "white",
    fontSize: 30,
    alignSelf: "center"
  },
  introTapContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  introTapBox: {
    backgroundColor: "#202020",
    flex: 1,
    margin: 20
  },
  introText:{
    fontFamily: "Product Sans",
    color: "white",
    fontSize: 20,
    alignSelf: "center",
    margin: 8
  }
});
