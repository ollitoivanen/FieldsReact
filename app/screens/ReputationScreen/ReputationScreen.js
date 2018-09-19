import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { reputation, to_next_badge } from "../../strings/strings";
import I18n from "FieldsReact/i18n";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getuserData: () => dispatch(getuserData())
  };
};

class ReputationScreen extends Component {
  constructor(props){
    super(props);
    firebase.analytics().setCurrentScreen("ReputationScreen", "ReputationScreen");

  }
  static navigationOptions = {
    header: null
  };
  render() {
    let nextBadge;
    let tillNextBadge;

    let badge;
    if (this.props.userData.re < 500) {
      nextBadge = 500;
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_1" }} />;
    } else if (this.props.userData.re < 1500) {
      nextBadge = 1500;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_2" }} />;
    } else if (this.props.userData.re < 3000) {
      nextBadge = 3000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_3" }} />;
    } else if (this.props.userData.re < 6000) {
      nextBadge = 6000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_4" }} />;
    } else if (this.props.userData.re < 10000) {
      nextBadge = 10000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_5" }} />;
    } else if (this.props.userData.re < 15000) {
      nextBadge = 15000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_6" }} />;
    } else if (this.props.userData.re < 21000) {
      nextBadge = 21000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_7" }} />;
    } else if (this.props.userData.re < 28000) {
      nextBadge = 28000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_8" }} />;
    } else if (this.props.userData.re < 38000) {
      nextBadge = 38000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_9" }} />;
    } else if (this.props.userData.re < 48000) {
      nextBadge = 48000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_10" }} />;
    } else if (this.props.userData.re < 58000) {
      nextBadge = 58000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_11" }} />;
    } else if (this.props.userData.re < 70000) {
      nextBadge = 70000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_12" }} />;
    } else if (this.props.userData.re < 85000) {
      nextBadge = 85000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_13" }} />;
    } else if (this.props.userData.re >= 85000) {
      nextBadge = "gg";

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_14" }} />;
    }

    if (this.props.userData.re > 85000) {
      tillNextBadge;
    } else {
      tillNextBadge =
        nextBadge -
        this.props.userData.re +
        " " +
        [I18n.t("reputation")] +
        " " +
        [I18n.t("to_next_badge")];
    }
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
          <Text style={styles.teamName}>{I18n.t("reputation")}</Text>
        </View>
        <View style={styles.badgeContainer}>{badge}</View>
        <View style={styles.badgeContainer}>
          <Text style={styles.reputationText}>
            {this.props.userData.re + " " + [I18n.t("reputation")]}
          </Text>
        </View>
        <Text style={styles.tillText}>{tillNextBadge}</Text>
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReputationScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  teamIcon: {
    width: 120,
    height: 120
  },

  badgeContainer: {
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#ededed",
    marginTop: 30,
    padding: 20,
    alignSelf: "center"
  },

  backButtonContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  reputationText: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center"
  },

  tillText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 20
  }
});
