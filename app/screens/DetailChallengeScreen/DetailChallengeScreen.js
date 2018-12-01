import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  AsyncStorage
} from "react-native";
import I18n from "FieldsReact/i18n";
import * as Animatable from "react-native-animatable";

export default class DetailChallengeScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = { levelData: {}, loading: true };
    this.retrieveData().then(() => {
      this.setState({ loading: false });
    });
  }

  retrieveData = async () => {
    var { params } = this.props.navigation.state;
    var levelData = params.challenge + "ChallengeLevels";
    const value = await AsyncStorage.getItem(levelData);
    if (value !== null) {
      let levelData = JSON.parse(value);
      this.setState({ levelData });
    } else {
      this.setState({
        speedChallengeLevels: {}
      });
    }
  };

  openLevel = (category, levelNumber, perk) => {
    if (category === "speed") {
      this.props.navigation.navigate("SpeedChallengeScreen", {
        levelNumber,
        opponentSpeedPerk: perk
      });
    } else if (category === "strength") {
      this.props.navigation.navigate("StrengthChallengeScreen", {
        levelNumber
      });
    } else if (category === "agility") {
      this.props.navigation.navigate("AgilityChallengeScreen", { levelNumber });
    } else if (category === "stamina") {
      this.props.navigation.navigate("StaminaChallengeScreen", { levelNumber });
    } else if (category === "motivation") {
      this.props.navigation.navigate("MotivationChallengeScreen", {
        levelNumber
      });
    }
  };

  render() {
    const speedChallengeLevels = [
      { id: "speedLevel1", value: "1", type: "speed", perk: 0.5 },
      { id: "speedLevel2", value: "2", type: "speed", perk: 0.6 },
      { id: "speedLevel3", value: "3", type: "speed", perk: 0.7 },
      { id: "speedLevel4", value: "4", type: "speed", perk: 0.8 },
      { id: "speedLevel5", value: "5", type: "speed", perk: 0.9 },
      { id: "speedLevel6", value: "6", type: "speed", perk: 1.0 },
      { id: "speedLevel7", value: "7", type: "speed", perk: 1.1 },
      { id: "speedLevel8", value: "8", type: "speed", perk: 1.2 },
      { id: "speedLevel9", value: "9", type: "speed", perk: 1.3 },
      { id: "speedLevel10", value: "10", type: "speed", perk: 1.4 },
      { id: "speedLevel111", value: "11", type: "speed", perk: 1.5 },
      { id: "speedLevel12", value: "12", type: "speed", perk: 1.6 },
      { id: "speedLevel13", value: "13", type: "speed", perk: 1.7 },
      { id: "speedLevel14", value: "14", type: "speed", perk: 1.8 },
      { id: "speedLevel15", value: "15", type: "speed", perk: 1.9 },
      { id: "speedLevel16", value: "16", type: "speed", perk: 2.0 },
      { id: "speedLevel17", value: "17", type: "speed", perk: 2.1 },
      { id: "speedLevel18", value: "18", type: "speed", perk: 2.2 },
      { id: "speedLevel19", value: "19", type: "speed", perk: 2.3 },
      { id: "speedLevel20", value: "20", type: "speed", perk: 2.4 },
      { id: "speedLevel21", value: "21", type: "speed", perk: 2.5 },
      { id: "speedLevel22", value: "22", type: "speed", perk: 2.6 },
      { id: "speedLevel23", value: "23", type: "speed", perk: 2.7 },
      { id: "speedLevel24", value: "24", type: "speed", perk: 2.8 },
      { id: "speedLevel25", value: "25", type: "speed", perk: 2.9 },
      { id: "speedLeve26", value: "26", type: "speed", perk: 3.0 },
      { id: "speedLeve27", value: "27", type: "speed", perk: 3.1 },
      { id: "speedLeve28", value: "28", type: "speed", perk: 3.2 },
      { id: "speedLevel29", value: "29", type: "speed", perk: 3.3 },
      { id: "speedLevel30", value: "30", type: "speed", perk: 3.4 },
      { id: "speedLevel31", value: "31", type: "speed", perk: 3.5 },
      { id: "speedLevel32", value: "32", type: "speed", perk: 3.6 },
      { id: "speedLevel33", value: "33", type: "speed", perk: 3.7 },
      { id: "speedLevel34", value: "34", type: "speed", perk: 3.8 },
      { id: "speedLevel35", value: "35", type: "speed", perk: 3.9 },
      { id: "speedLevel36", value: "36", type: "speed", perk: 4.0 },
      { id: "speedLevel37", value: "37", type: "speed", perk: 4.1 },
      { id: "speedLevel38", value: "38", type: "speed", perk: 4.2 },
      { id: "speedLevel39", value: "39", type: "speed", perk: 4.3 },
      { id: "speedLevel40", value: "40", type: "speed", perk: 4.4 },
      { id: "speedLevel41", value: "41", type: "speed", perk: 4.5 },
      { id: "speedLevel42", value: "42", type: "speed", perk: 4.6 },
      { id: "speedLevel43", value: "43", type: "speed", perk: 4.7 },
      { id: "speedLevel44", value: "44", type: "speed", perk: 4.8 },
      { id: "speedLevel45", value: "45", type: "speed", perk: 4.9 },
      { id: "speedLevel46", value: "46", type: "speed", perk: 5.0 },
      { id: "speedLevel47", value: "47", type: "speed", perk: 5.1 },
      { id: "speedLevel48", value: "48", type: "speed", perk: 5.2 },
      { id: "speedLevel49", value: "49", type: "speed", perk: 5.3 },
      { id: "speedLevel50", value: "50", type: "speed", perk: 5.4 }
    ];
    const strengthChallengeLevels = [
      { id: "strengthLevel1", value: "1", type: "strength" },
      { id: "strengthLevel2", value: "2", type: "strength" }
    ];
    const numColumns = 3;
    const size = Dimensions.get("window").width / numColumns;
    var itemContainer = {
      width: size,
      height: size
    };
    var locked = {
      backgroundColor: "#202020"
    };
    var unlocked = {
      backgroundColor: "#d73b3b"
    };
    var active = {
      backgroundColor: "#383737"
    };
    var { params } = this.props.navigation.state;
    var challengeCategory = params.challenge;
    var header = I18n.t(challengeCategory);
    if (challengeCategory === "speed") {
      var levels = speedChallengeLevels;
    } else if (challengeCategory === "strength") {
      var levels = strengthChallengeLevels;
    }
    var unlockedLevels = Object.keys(this.state.levelData).length;
    for (let index = 0; index < levels.length; index++) {
      if (index === 0 && unlockedLevels === 0) {
        levels[index].comp = "active";
      } else if (index < unlockedLevels) {
        levels[index].comp = "unlocked";
      } else if (index == unlockedLevels) {
        levels[index].comp = "active";
      } else {
        levels[index].comp = "locked";
      }
    }

    if (this.state.loading === false) {
      return (
        <View style={styles.container}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              underlayColor="#bcbcbc"
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.backButton}
                source={{ uri: "back_button_white" }}
              />
            </TouchableOpacity>
            <Text style={styles.backText}>{header}</Text>
          </View>
          <Animatable.View
            animation={"slideInUp"}
            duration={300}
            useNativeDriver={true}
            style={styles.container}
          >
            <FlatList
              data={levels}
              renderItem={({ item }) => (
                <View style={itemContainer}>
                  <TouchableOpacity
                    style={[
                      item.comp == "unlocked" ? unlocked : styles.levelButton,
                      item.comp == "active" ? active : styles.levelButton,
                      item.comp == "locked" ? locked : styles.levelButton,

                      styles.levelButton
                    ]}
                    onPress={() => {
                      if (item.comp !== "locked") {
                        this.openLevel(item.type, item.value, item.perk);
                      }
                    }}
                  >
                    <Text style={styles.levelText}>{item.value}</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={numColumns}
            />
          </Animatable.View>
        </View>
      );
    } else {
      return (
        <View style={{ backgroundColor: "#111111", flex: 1 }}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              underlayColor="#bcbcbc"
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.backButton}
                source={{ uri: "back_button_white" }}
              />
            </TouchableOpacity>
            <Text style={styles.backText}>{header}</Text>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111"
  },
  backButtonContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48
  },

  backText: {
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12,
    marginEnd: 12,
    color: "white",
    fontFamily: "Product Sans"
  },
  levelText: {
    fontSize: 20,
    alignSelf: "center",
    color: "white",
    fontFamily: "Product Sans"
  },
  image: {
    height: 100,
    width: 100
  },
  levelButton: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center"
  }
});
