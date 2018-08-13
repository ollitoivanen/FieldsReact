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

import { info, players, edit_team } from "../../strings/strings";
import firebase from "react-native-firebase";
import TeamPlayerListItem from "FieldsReact/app/components/TeamPlayerListItem/TeamPlayerListItem"; // we'll create this next

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

class TeamPlayerScreen extends Component {
  componentWillMount() {
    this.loadPlayersList();
  }

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      players: []
    };
  }

  loadPlayersList() {
    const ref = firebase.firestore().collection("Teams");

    const players = [];

    const query = ref
      .doc(this.props.userData.uTI)
      .collection("TU");
    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const { unM } = doc.data();
          players.push({
            key: doc.id,
            doc,
            unM
          });
        });
        this.setState({
          players
        });
      }.bind(this)
    );
  }

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
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.teamName}>{players}</Text>
        </View>
        <FlatList
          data={this.state.players}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <TeamPlayerListItem {...item} />
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
)(TeamPlayerScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
    width: "100%"
  }
});
