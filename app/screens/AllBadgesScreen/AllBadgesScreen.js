import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import I18n from "FieldsReact/i18n";
import { connect } from "react-redux";
import firebase from "react-native-firebase";

import BadgeItem from "FieldsReact/app/components/BadgeItem/BadgeItem"; // we'll create this next
const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};

class AllBadgesScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("AllBadgesScreen", "AllBadgesScreen");

    this.state = {
      badges: [
        { key: "1", rep: "0", uri: "badge_1" },
        { key: "2", rep: "200", uri: "badge_2" },
        { key: "3", rep: "500", uri: "badge_3" },
        { key: "4", rep: "900", uri: "badge_4" },
        { key: "5", rep: "1500", uri: "badge_5" },
        { key: "6", rep: "2300", uri: "badge_6" },
        { key: "7", rep: "3500", uri: "badge_7" },
        { key: "8", rep: "5000", uri: "badge_8" },
        { key: "9", rep: "7000", uri: "badge_9" },
        { key: "10", rep: "10000", uri: "badge_10" },
        { key: "11", rep: "15000", uri: "badge_11" },
        { key: "12", rep: "23000", uri: "badge_12" },
        { key: "13", rep: "35000", uri: "badge_13" },
        { key: "14", rep: "50000", uri: "badge_14" },
        { key: "15", rep: "70000", uri: "badge_15" },
        { key: "16", rep: "100000", uri: "badge_16" }
      ]
    };
  }
  componentDidMount = () => {
    this.getBadges();
  };

  getBadges = () => {
    var re = this.props.userData.re;
    var checkedBadges = [];

    this.state.badges.forEach(item => {
      if (re >= parseInt(item.rep)) {
        checkedBadges.push({
          key: item.key,
          rep: item.rep,
          uri: item.uri,
          unlocked: true
        });
      } else {
        checkedBadges.push({
          key: item.key,
          rep: item.rep,
          uri: item.uri,
          unlocked: false
        });
      }
    });

    this.setState({ badges: checkedBadges });
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
        <FlatList
          data={this.state.badges}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                this.props.navigation.navigate("ReputationPurchaseScreen");
              }}
            >
              <BadgeItem {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps)(AllBadgesScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
