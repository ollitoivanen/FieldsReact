import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  AsyncStorage
} from "react-native";
import * as Animatable from "react-native-animatable";
var moment = require("moment");
import I18n from "FieldsReact/i18n";

export default class SpeedChallengeScreen extends Component {
  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.state = {
      time: 0,
      goalTime: 10,
      goalScore: 100,
      score: 0,
      score2: 0,
      opponentScore: 0,
      opponentScore2: 0,
      opponentSpeedPerk: params.opponentSpeedPerk,
      speedPerk: 1,
      start: false,
      countdown: 3,
      opponentTap: null,
      winner: null,
      levelNumber: params.levelNumber
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
          opponentScore:
            (this.state.opponentScore + this.state.opponentSpeedPerk) * 1.01
        },
        () => {
          this.setState({
            opponentScore2: this.state.opponentScore / this.state.goalScore
          });
        }
      );
    }, 100);

    this.setState({ opponentTap });
  };

  increaseSpeed = () => {
    this.setState(
      { score: (this.state.score + this.state.speedPerk) * 1.01 },
      () => {
        this.setState({ score2: this.state.score / this.state.goalScore });
      }
    );
  };
  storeData = async data => {
    try {
      await AsyncStorage.setItem("speedChallengeLevels", data).then(() => {
        this.retrieveData();
      });
    } catch (error) {
      // Error saving data
    }
  };
  retrieveData = async () => {
    var { params } = this.props.navigation.state;

    const value = await AsyncStorage.getItem("speedChallengeLevels");
    if (value !== null) {
      let speedChallengeLevels = JSON.parse(value);
      this.setState({ speedChallengeLevels });
    } else {
      this.setState({
        speedChallengeLevels: []
      });
    }
  };

  endGame = winner => {
    this.setState({ start: "finished", winner: winner });
    if (winner === "you") {
      this.retrieveData().then(() => {
        var speedChallengeLevels = this.state.speedChallengeLevels;
        var levelNumber = this.state.levelNumber;

        if (speedChallengeLevels[levelNumber - 1] === undefined) {
          speedChallengeLevels[levelNumber - 1] = { comp: true };
          this.storeData(JSON.stringify(speedChallengeLevels));
        }
      });
      this.refs.progressBar.transitionTo({ flex: 0 }, 100, "linear");
      this.refs.progressBar2.transitionTo({ flex: 1 }, 100, "linear");
      this.refs.progressBarOpponent.transitionTo({ flex: 1 }, 100, "linear");
      this.refs.progressBar2Opponent.transitionTo({ flex: 0 }, 100, "linear");
    } else {
      this.refs.progressBar.transitionTo({ flex: 1 }, 100, "linear");
      this.refs.progressBar2.transitionTo({ flex: 0 }, 100, "linear");
      this.refs.progressBarOpponent.transitionTo({ flex: 0 }, 100, "linear");
      this.refs.progressBar2Opponent.transitionTo({ flex: 1 }, 100, "linear");
    }
  };
  static navigationOptions = {
    header: null
  };
  render() {
    var progressBar2 = {
      flex: this.state.score2,

      width: 100,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      backgroundColor: "#D73b3b"
    };
    var progressBar = {
      backgroundColor: "#111111",
      width: 100,
      flex: 1 - this.state.score2
    };
    var progressBar2Opponent = {
      flex: this.state.opponentScore2,

      width: 100,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      backgroundColor: "#D73b3b"
    };
    var progressBarOpponent = {
      backgroundColor: "#111111",
      width: 100,
      flex: 1 - this.state.opponentScore2
    };
    if (this.state.start === "finished") {
      if (this.state.winner === "you") {
        var winnerText = (
          <Animatable.Text
            style={styles.winnerText}
            animation={"zoomIn"}
            iterationCount={1}
          >
            {this.state.winner} win
          </Animatable.Text>
        );
      } else {
        var winnerText = (
          <Animatable.Text
            style={styles.loserText}
            animation={"zoomIn"}
            iterationCount={1}
          >
            {this.state.winner} wins
          </Animatable.Text>
        );
      }
      return <View style={styles.endScreen}>{winnerText}</View>;
    }

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
            <Text style={styles.introText}>
              {I18n.t("level")} {this.state.levelNumber}
            </Text>
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
                style={progressBarOpponent}
                ref={"progressBarOpponent"}
                onLayout={event => {
                  var { x, y, width, height } = event.nativeEvent.layout;
                  if (height === 0) {
                    clearInterval(this.state.opponentTap);
                    this.endGame("opponent");
                  }
                }}
              />
              <Animatable.View
                ref={"progressBar2Opponent"}
                style={progressBar2Opponent}
              >
                <Text style={styles.timeText}>Rival</Text>
              </Animatable.View>
            </View>
            <View>
              <Animatable.View
                style={progressBar}
                ref={"progressBar"}
                onLayout={event => {
                  var { x, y, width, height } = event.nativeEvent.layout;
                  if (height === 0) {
                    clearInterval(this.state.opponentTap);
                    this.endGame("you");
                  }
                }}
              />
              <Animatable.View ref={"progressBar2"} style={progressBar2}>
                <Text style={styles.timeText}>You {Math.trunc(this.state.score2*100)}</Text>
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

  progressBarOpponent: {
    backgroundColor: "#111111",
    width: 100,
    flex: 1
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
  winnerText: {
    fontFamily: "Product Sans",
    color: "#3bd774",
    fontSize: 40,
    alignSelf: "center"
  },
  loserText: {
    fontFamily: "Product Sans",
    color: "#b73b3b",
    fontSize: 40,
    margin: 20,
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
  introText: {
    fontFamily: "Product Sans",
    color: "white",
    fontSize: 20,
    alignSelf: "center",
    margin: 8
  },

  endScreen: {
    backgroundColor: "#111111",
    flex: 1
  }
});
