import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import I18n from "FieldsReact/i18n";
import * as Animatable from "react-native-animatable";

export default class StartGameScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
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
          <Text style={styles.backText}>{I18n.t("challenges")}</Text>
        </View>
        <Animatable.View
          animation={"zoomIn"}
          duration={300}
          useNativeDriver={true}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              this.props.navigation.navigate("DetailChallengeScreen", {
                challenge: "speed"
              });
            }}
          >
            <Image
              style={styles.backButton}
              source={{ uri: "speed_icon_red" }}
            />
            <Text style={styles.cardText}>{I18n.t("speed")}</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View
          animation={"zoomIn"}
          duration={300}
          useNativeDriver={true}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              this.props.navigation.navigate("DetailChallengeScreen", {
                challenge: "strength"
              });
            }}
          >
            <Image
              style={styles.backButton}
              source={{ uri: "strength_icon_red" }}
            />
            <Text style={styles.cardText}>{I18n.t("strength")}</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          animation={"zoomIn"}
          duration={300}
          useNativeDriver={true}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              this.props.navigation.navigate("DetailChallengeScreen", {
                challenge: "agility"
              });
            }}
          >
            <Image
              style={styles.backButton}
              source={{ uri: "agility_icon_red" }}
            />
            <Text style={styles.cardText}>{I18n.t("agility")}</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          animation={"zoomIn"}
          duration={300}
          useNativeDriver={true}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              this.props.navigation.navigate("DetailChallengeScreen", {
                challenge: "stamina"
              });
            }}
          >
            <Image
              style={styles.backButton}
              source={{ uri: "stamina_icon_red" }}
            />
            <Text style={styles.cardText}>{I18n.t("stamina")}</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          animation={"zoomIn"}
          duration={300}
          useNativeDriver={true}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              this.props.navigation.navigate("DetailChallengeScreen", {
                challenge: "motivation"
              });
            }}
          >
            <Image
              style={styles.backButton}
              source={{ uri: "motivation_icon_red" }}
            />
            <Text style={styles.cardText}>{I18n.t("motivation")}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111111",
    flex: 1
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
    color: "white",
    fontFamily: "Product Sans"
  },
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#202020",
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,

    alignItems: "center"
  },
  cardText: {
    flex: 1,
    flexWrap: "wrap",
    color: "white",
    fontSize: 18,
    marginStart: 16,
    fontFamily: "Product Sans"
  }
});
