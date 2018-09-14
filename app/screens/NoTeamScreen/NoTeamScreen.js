import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import {
  join_team_to_get_best_out_of_fields,
  add_team_events,
  see_whos_coming_to_events,
  message_your_squad,
  join_team,
  create_team
} from "../../strings/strings";
import I18n from "FieldsReact/i18n";

export default class NoTeamScreen extends Component {
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
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>
          {I18n.t("join_team_to_get_best_out_of_fields")}
        </Text>
        <View style={styles.roundCont}>
          <Text style={styles.subText}>{I18n.t("add_team_events")}</Text>
          <Text style={styles.subText}>
            {I18n.t("see_whos_coming_to_events")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createTeamButton}
          onPress={() =>
            this.props.navigation.navigate("CreateTeamScreen", {
              lt: null,
              ln: null
            })
          }
        >
          <Text style={styles.blackText}>{I18n.t("create_team")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinTeamButton}
          onPress={() =>
            this.props.navigation.navigate("FieldSearchScreen", { selectedIndex: 1 })
          }
        >
          <Text style={styles.whiteText}>{I18n.t("join_team")}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  joinTeamButton: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10
  },

  createTeamButton: {
    padding: 15,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    margin: 20,
    marginBottom: 5
  },

  headerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 26,
    margin: 30,
    textAlign: "center"
  },

  subText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
    margin: 10,
    textAlign: "center"
  },
  roundCont: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    margin: 20,
    padding: 10
  },

  whiteText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  blackText: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold"
  }
});
