import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  info,
  players,
  edit_team,
  pending_players,
  accept,
  decline
} from "../../strings/strings";
import firebase from "react-native-firebase";
import TeamPendingPlayerListItem from "FieldsReact/app/components/TeamPendingPlayerListItem/TeamPendingPlayerListItem"; // we'll create this next
import I18n from "FieldsReact/i18n";

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

class TeamPendingPlayersScreen extends Component {
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.ref = firebase
      .firestore()
      .collection("Teams")
      .doc(this.props.userData.uTI)
      .collection("PTU");
    this.unsubscribe = null;

    this.state = {
      players: []
    };
  }

  onCollectionUpdate = querySnapshot => {
    const players = [];

    querySnapshot.forEach(doc => {
      const { pUN } = doc.data();
      const id = doc.id;
      players.push({
        key: doc.id,
        id,
        doc,
        pUN
      });
    });
    this.setState({
      players
    });
  };

  accept = item => {
    firebase
      .firestore()
      .collection("Teams")
      .doc(this.props.userData.uTI)
      .collection("PTU")
      .doc(item.id)
      .delete()

      .then(() => {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.uTI)
          .collection("TU")
          .doc(item.id)
          .set({
            unM: item.pUN
          });
      })
      .then(() => {
        firebase
          .firestore()
          .collection("Teams")
          .doc(this.props.userData.uTI)
          .get()
          .then(doc => {
            firebase
              .firestore()
              .collection("Teams")
              .doc(this.props.userData.uTI)
              .update({
                pC: doc.data().pC + 1
              });
          })
          .then(() => {
            firebase
              .firestore()
              .collection("Users")
              .doc(item.id)
              .update({
                pT: firebase.firestore.FieldValue.delete(),
                uTI: this.props.userData.uTI,
                uTN: this.props.userData.uTN
              });
          });
      });
  };

  decline = item => {
    firebase
      .firestore()
      .collection("Teams")
      .doc(this.props.userData.uTI)
      .collection("PTU")
      .doc(item.id)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("Users")
          .doc(item.id)
          .update({
            pT: firebase.firestore.FieldValue.delete()
          });
      });
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
          <Text style={styles.teamName}>{I18n.t("pending_players")}</Text>
        </View>
        <FlatList
          data={this.state.players}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TeamPendingPlayerListItem {...item} />
              <TouchableOpacity onPress={() => this.accept(item)}>
                <Text style={styles.textGreen}>{I18n.t("accept")}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.decline(item)}>
                <Text style={styles.textRed}>{I18n.t("decline")}</Text>
              </TouchableOpacity>
              <View style={styles.div} />
            </View>
          )}
        />
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPendingPlayersScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  div: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  textRed: {
    color: "red",
    fontWeight: "bold",
    marginHorizontal: 10,
    marginEnd: 20,
    marginBottom: 4
  },

  textGreen: {
    color: "#3bd774",
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 4
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
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

  item: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  }
});
