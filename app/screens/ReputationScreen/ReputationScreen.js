import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { reputation, to_next_badge } from "../../strings/strings";
import I18n from "FieldsReact/i18n";
import firebase from "react-native-firebase";

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
  constructor(props) {
    super(props);
    firebase
      .analytics()
      .setCurrentScreen("ReputationScreen", "ReputationScreen");
  }
  static navigationOptions = {
    header: null
  };
  render() {
    let nextBadge;
    let tillNextBadge;

    let badge;
    if (this.props.userData.re < 200) {
      nextBadge = 200;
      badge = <Image style={styles.teamIcon} source={{ uri: "badge_1" }} />;
    } else if (this.props.userData.re < 500) {
      nextBadge = 500;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_2" }} />;
    } else if (this.props.userData.re < 900) {
      nextBadge = 900;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_3" }} />;
    } else if (this.props.userData.re < 1500) {
      nextBadge = 1500;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_4" }} />;
    } else if (this.props.userData.re < 2300) {
      nextBadge = 2300;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_5" }} />;
    } else if (this.props.userData.re < 3500) {
      nextBadge = 3500;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_6" }} />;
    } else if (this.props.userData.re < 5000) {
      nextBadge = 5000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_7" }} />;
    } else if (this.props.userData.re < 7000) {
      nextBadge = 7000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_8" }} />;
    } else if (this.props.userData.re < 10000) {
      nextBadge = 10000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_9" }} />;
    } else if (this.props.userData.re < 15000) {
      nextBadge = 15000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_10" }} />;
    } else if (this.props.userData.re < 23000) {
      nextBadge = 23000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_11" }} />;
    } else if (this.props.userData.re < 35000) {
      nextBadge = 35000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_12" }} />;
    } else if (this.props.userData.re < 50000) {
      nextBadge = 50000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_13" }} />;
    } else if (this.props.userData.re < 70000) {
      nextBadge = 70000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_14" }} />;
    } else if (this.props.userData.re < 100000) {
      nextBadge = 100000;

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_15" }} />;
    } else if (this.props.userData.re >= 100000) {
      nextBadge = "gg";

      badge = <Image style={styles.teamIcon} source={{ uri: "badge_16" }} />;
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
              flex: 1,
              flexWrap: "wrap"
            }}
          >
            <Text style={styles.teamName}>{I18n.t("reputation")}</Text>
            <TouchableOpacity
              style={styles.storeContainer}
              onPress={() =>
                this.props.navigation.navigate("ReputationPurchaseScreen")
              }
            >
              <Image style={styles.storeIcon} source={{ uri: "store" }} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.badgeContainer}
          onPress={() => this.props.navigation.navigate("AllBadgesScreen")}
        >
          {badge}
        </TouchableOpacity>
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
  },
  storeContainer: {
    height: 28,
    width: 28,
    marginEnd: 8,
    position: "absolute",
    right: 0
  },

  storeIcon: {
    height: 28,
    width: 28
  }
});
