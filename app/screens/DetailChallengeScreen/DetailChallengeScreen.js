import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions
} from "react-native";
import I18n from "FieldsReact/i18n";

export default class DetailChallengeScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  openLevel = (category, levelNumber) => {
    if (category === "speed") {
      this.props.navigation.navigate("SpeedChallengeScreen", { levelNumber });
    } else if (category === "strength") {
      this.props.navigation.navigate("StrengthChallengeScreen", { levelNumber});
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
      { id: "speedLevel1", value: "1", type: "speed" }
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
    var itemm = {
      flex: 1,
      margin: 10,
      backgroundColor: "#202020",
      alignItems: "center",
      borderRadius: 10,
      justifyContent: "center"
    };
    var { params } = this.props.navigation.state;
    var challengeCategory = params.challenge;
    var header = I18n.t(challengeCategory);
    if (challengeCategory === "speed") {
      var levels = speedChallengeLevels;
    } else if (challengeCategory === "strength") {
      var levels = strengthChallengeLevels;
    }

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
        <FlatList
          data={levels}
          renderItem={({ item }) => (
            <View style={itemContainer}>
              <TouchableOpacity
                style={itemm}
                onPress={() => this.openLevel(item.type, item.value)}
              >
                <Text style={styles.levelText}>{item.value}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={numColumns}
        />
      </View>
    );
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
  }
});
