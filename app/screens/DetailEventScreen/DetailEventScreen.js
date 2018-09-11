import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal
} from "react-native";
import {
  at,
  event_type_array,
  event_details,
  event_in,
  event_open,
  event_out,
  field_not_set,
  delete_event,
  show_players
} from "../../strings/strings";
import firebase, { Firebase } from "react-native-firebase";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import PlayerListItem from "FieldsReact/app/components/PlayerListItem/PlayerListItem"; // we'll create this next
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
class DetailEventScreen extends Component {
  static navigationOptions = {
    header: null
  };

  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  getUserSelection = () => {
    var { params } = this.props.navigation.state;

    firebase
      .firestore()
      .collection("Events")
      .doc(params.id)
      .collection("EU")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(
        function(doc) {
          this.setState({ selectedIndex: doc.data().st, loading: false });
        }.bind(this)
      );
  };

  onCollectionUpdate = querySnapshot => {
    const players = [];
    querySnapshot.forEach(doc => {
      const { unE, st } = doc.data();

      if (doc.id === firebase.auth().currentUser.uid) {
        this.setState({
          selectedIndex: doc.data().st
        });
      }

      players.push({
        key: doc.id,
        doc, // DocumentSnapshot
        unE,
        st
      });
    });
    this.setState({
      players
    });
  };

  componentWillUnmount() {
    if (this.state.subscribed === true) {
      this.unsubscribe();
    }
  }

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.getUserSelection();

    this.ref = firebase
      .firestore()

      .collection("Events")
      .doc(params.id)
      .collection("EU");

    this.unsubscribe = null;

    this.state = {
      selectedIndex: 1,
      players: [],
      infoVisible: false,
      playerListVisible: false,
      subscribed: false,
      loading: true
    };
  }
  updateIndex = selectedIndex => {
    var { params } = this.props.navigation.state;

    this.setState({ selectedIndex }, () => {
      if (selectedIndex === 0) {
        firebase
          .firestore()

          .collection("Events")
          .doc(params.id)
          .collection("EU")
          .doc(firebase.auth().currentUser.uid)
          .update({
            st: 0
          });
      } else if (selectedIndex === 1) {
        firebase
          .firestore()

          .collection("Events")
          .doc(params.id)
          .collection("EU")
          .doc(firebase.auth().currentUser.uid)
          .update({
            st: 1
          });
      } else if (selectedIndex === 2) {
        firebase
          .firestore()

          .collection("Events")
          .doc(params.id)
          .collection("EU")
          .doc(firebase.auth().currentUser.uid)
          .update({
            st: 2
          });
      }
    });
  };

  setPlayerListVisible = () => {
    this.setState({ playerListVisible: true, subscribed: true });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  };
  render() {
    var { params } = this.props.navigation.state;

    const buttons = [[event_in], [event_open], [event_out]];
    const { selectedIndex } = this.state;

    if (this.state.selectedIndex === 0) {
      var filterBox = (
        <View style={styles.filterBox}>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterTextGreen}>{I18n.t("event_in")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(1)}
          >
            <Text style={styles.filterText}>{I18n.t("event_open")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(2)}
          >
            <Text style={styles.filterText}>{I18n.t("event_out")}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.selectedIndex === 1) {
      var filterBox = (
        <View style={styles.filterBox}>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(0)}
          >
            <Text style={styles.filterText}>{I18n.t("event_in")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterTextGray}>{I18n.t("event_open")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(2)}
          >
            <Text style={styles.filterText}>{I18n.t("event_out")}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.selectedIndex === 2) {
      var filterBox = (
        <View style={styles.filterBox}>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(0)}
          >
            <Text style={styles.filterText}>{I18n.t("event_in")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => this.updateIndex(1)}
          >
            <Text style={styles.filterText}>{I18n.t("event_open")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterTextRed}>{I18n.t("event_out")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (this.state.playerListVisible === false) {
      var playerListTab = (
        <TouchableOpacity onPress={() => this.setPlayerListVisible()}>
          <Text style={styles.blueText}>{I18n.t("show_players")}</Text>
        </TouchableOpacity>
      );
    } else {
      var playerListTab = (
        <View>
          <FlatList
            data={this.state.players}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <PlayerListItem {...item} />
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }

    if (this.state.loading === false) {
      var tab = <View style={{ marginTop: 12 }}>{filterBox}</View>;
    } else {
      var tab = null;
    }

    if (params.eventFieldName === undefined) {
      var eventField = (
        <Text style={styles.infoText}>{I18n.t("field_not_set")}</Text>
      );
    } else {
      var eventField = (
        <Text style={styles.infoText}>{params.eventFieldName}</Text>
      );
    }

    const deleteEvent = () => {
      firebase
        .firestore()
        .collection("Events")
        .doc(params.id)
        .collection("EU")
        .get()
        .then(
          function(doc) {
            doc.forEach(doc => {
              firebase
                .firestore()
                .collection("Events")
                .doc(params.id)
                .collection("EU")
                .doc(doc.id)
                .delete();
            });
          }.bind(this)
        )
        //Arrow function waits till the whole collection is deleted!
        .then(() => {
          firebase
            .firestore()
            .collection("Events")
            .doc(params.id)
            .delete();
        })
        .then(() => {
          this.props.navigation.goBack();
        });
    };

    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.infoVisible}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#00000080",
              alignItems: "center"
            }}
            onPress={() => {
              this.setModalVisible(!this.state.infoVisible);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.setModalVisible(!this.state.infoVisible);
              }}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => deleteEvent()}
              >
                <Text style={styles.deleteText}>{I18n.t("delete_event")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{I18n.t("event_details")}</Text>
          <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() => this.setModalVisible(true)}
          >
            <Image style={styles.infoIcon} source={{ uri: "info_black" }} />
          </TouchableOpacity>
        </View>
        <View style={styles.eventInfoCont}>
          <View style={styles.greenTab} />
          <View style={styles.columnCont}>
            <Text style={styles.infoTextType}>
              {I18n.t(["event_type_array", params.eventType])}
            </Text>
            {eventField}
            <Text style={styles.infoTextDate}>
              {params.date + "  " + params.startTime + "-" + params.endTime}
            </Text>
          </View>
        </View>
        {tab}
        {playerListTab}
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

  filterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  filterItem: {
    flexGrow: 1,
    alignItems: "center",
    textAlign: "center",
    flex: 1,
    padding: 10
  },

  filterText: {
    fontWeight: "bold",
    color: "#e0e0e0"
  },

  filterTextGreen: {
    fontWeight: "bold",
    color: "#3bd774"
  },
  filterTextRed: {
    fontWeight: "bold",
    color: "red"
  },
  filterTextGray: {
    fontWeight: "bold",
    color: "gray"
  },

  buttonGroup: {
    marginTop: 100
  },
  infoContainer: {},

  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24
  },

  infoIcon: {
    height: 36,
    width: 36,
    margin: 4
  },
  buttonContainer: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10
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
  },

  blueText: {
    color: "#3facff",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center"
  }
});
