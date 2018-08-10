import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import {
  at,
  event_type_array,
  event_details,
  event_in,
  event_open,
  event_out
} from "../../strings/strings";
import firebase, { Firebase } from "react-native-firebase";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { ButtonGroup } from "react-native-elements";
import PlayerListItem from "FieldsReact/app/components/PlayerListItem/PlayerListItem"; // we'll create this next

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};
 class DetailEventScreen extends Component {
  static navigationOptions = {
    header: null
  };

  loadPlayersList() {
    var { params } = this.props.navigation.state;

    const ref = firebase.firestore().collection("Teams");

    const players = [];

    const query = ref
      .doc(this.props.userData.userTeamID)
      .collection("Events").doc(params.id).collection("Users");
    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const { usernameMember } = doc.data();
          players.push({
            key: doc.id,
            doc,
            usernameMember
          });
        });
        this.setState({
          players
        });
      }.bind(this)
    );
  }

  constructor(props) {
    super(props);
    this.loadPlayersList()
    this.state = {
      selectedIndex: 0,
      players: []
    };
  }
  updateIndex = selectedIndex => {
    this.setState({ selectedIndex }, () => {
      if (selectedIndex === 1) {
      } else if (selectedIndex === 2) {
      } else if (selectedIndex === 0) {
      }
    });
  };
  render() {
    var { params } = this.props.navigation.state;

    const buttons = [[event_in], [event_open], [event_out]];
    const { selectedIndex } = this.state;

    if (this.state.selectedIndex === 0) {
      var buttonGroup = (
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={{ height: 40 }}
          selectedTextStyle={{ color: "#3bd774", fontWeight: "bold" }}
          textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
          innerBorderStyle={{ width: 0 }}
        />
      );
    } else if (this.state.selectedIndex === 1) {
      var buttonGroup = (
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={{ height: 40 }}
          selectedTextStyle={{ color: "grey", fontWeight: "bold" }}
          textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
          innerBorderStyle={{ width: 0 }}
        />
      );
    } else if (this.state.selectedIndex === 2) {
      var buttonGroup = (
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={{ height: 40 }}
          selectedTextStyle={{ color: "red", fontWeight: "bold" }}
          textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
          innerBorderStyle={{ width: 0 }}
        />
      );
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
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.teamName}>{event_details}</Text>
        </View>
        <View style={styles.eventInfoCont}>
          <View style={styles.greenTab} />
          <View style={styles.columnCont}>
            <Text style={styles.infoTextType}>
              {event_type_array[params.eventType]}
            </Text>
            <Text style={styles.infoText}>{params.eventFieldName}</Text>
            <Text style={styles.infoTextDate}>
              {params.date + "  " + params.startTime + "-" + params.endTime}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>{buttonGroup}</View>

        <FlatList
          data={this.state.players}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                this.props.navigation.navigate("DetailEventScreen", {
                  eventFieldName: item.eventFieldName,
                  eventType: item.eventType,
                  startTime: item.startTime,
                  endTime: item.endTime,
                  date: item.date
                })
              }
            >
              <PlayerListItem {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailEventScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  buttonGroup: {
    marginTop: 100
  },

  infoTextDate: {
    fontWeight: "600",
    fontSize: 24,

    marginStart: 12,
    margin: 10,
    marginBottom: 6,
    flexWrap: "wrap"
  },

  infoText: {
    fontWeight: "bold",
    fontSize: 24,

    marginStart: 12,
    margin: 10,
    marginTop: 6,
    marginBottom: 6,
    flexWrap: "wrap"
  },
  infoTextType: {
    fontWeight: "bold",
    fontSize: 30,

    marginStart: 12,
    margin: 8,
    marginTop: 2,
    flexWrap: "wrap"
  },
  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12,
    flex: 1,
    flexWrap: "wrap"
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
  eventInfoCont: {
    flexDirection: "row"
  },

  greenTab: {
    backgroundColor: "#3bd774",
    left: 0,
    width: 10
  },
  columnCont: {
    flexDirection: "column",
    height: "100%",
    flex: 1
  }
});
