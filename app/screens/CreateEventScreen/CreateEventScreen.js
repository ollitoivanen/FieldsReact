import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal
} from "react-native";
import {
  create_new_event,
  start_time,
  end_time,
  event_date,
  event_ends_before_it_starts,
  event_date_has_already_passed,
  save,
  event_type_array,
  event_type,
  choose_field,
  event_field
} from "../../strings/strings";
var moment = require("moment");
import firebase, { Firebase } from "react-native-firebase";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import DateTimePicker from "react-native-modal-datetime-picker";

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

class CreateEventScreen extends Component {
  static navigationOptions = {
    header: null
  };
  showDatePicker = () => {
    this.setState({ datePickerVisible: true });
  };

  showStartTimePicker = () => {
    this.setState({ startTimePickerVisible: true });
  };

  showEndTimePicker = () => {
    this.setState({ endTimePickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ datePickerVisible: false });
  };

  hideStartTimePicker = () => {
    this.setState({ startTimePickerVisible: false });
  };

  hideEndTimePicker = () => {
    this.setState({ endTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState(
      {
        ogDate: moment(this.state.ogDate)
          .date(moment(date).format("DD"))
          .month(moment(date).format("MM") - 1)
          .year(moment(date).format("YYYY"))
          .format(),
        date: moment(date).format("ddd DD MMM")
      },
      () => {
        var diff = moment().format("x") - moment(date).format("x");
        if (diff > 86400000) {
          this.setState({ errorMessage: event_date_has_already_passed });
          this.hideDatePicker();
        } else {
          this.setState({ errorMessage: null });

          this.hideDatePicker();
        }
      }
    );
  };

  handleStartTimePicked = date => {
    this.setState(
      {
        ogDate: moment(this.state.ogDate)
          .hours(moment(date).format("HH"))
          .minutes(moment(date).format("mm")) //Seconds?
          .format(),
        startTime: moment(date).format("HH:mm")
        //How to wait setstate on iOS
      },
      () => {
        if (this.state.startTime > this.state.endTime) {
          this.setState({ errorMessage: event_ends_before_it_starts });
          this.hideStartTimePicker();
        } else {
          this.setState({ errorMessage: null });

          this.hideStartTimePicker();
        }
      }
    );
  };

  handleEndTimePicked = date => {
    this.setState(
      {
        endTime: moment(date).format("HH:mm")
      },
      () => {
        if (this.state.startTime > this.state.endTime) {
          this.setState({ errorMessage: event_ends_before_it_starts });
          this.hideEndTimePicker();
        } else {
          this.setState({ errorMessage: null });

          this.hideEndTimePicker();
        }
      }
    );
  };

  setEventTypeModal(visible) {
    this.setState({ eventTypeModalVisible: visible });
  }

  constructor(props) {
    super(props);

    this.state = {
      datePickerVisible: false,
      startTimePickerVisible: false,
      endTimePickerVisible: false,
      eventTypeModalVisible: false,

      ogDate: moment().format(),
      errorMessage: null,
      chosenEventType: 0,
      date: moment().format("ddd D MMM"),
      startTime: moment().format("HH:mm"),
      endTime: moment().format("HH:mm")
    };
  }
  render() {
    var { params } = this.props.navigation.state;

    const changeEventType = index => {
      this.setState({ chosenEventType: index });
      this.setEventTypeModal(false);
    };

    const openFieldSearch = () => {
      this.props.navigation.navigate("FieldSearchScreen", { fromEvent: true });
    };
    if (params.fieldID === null) {
      var chosenField = (
        <TouchableOpacity onPress={() => openFieldSearch()}>
          <Text style={styles.chooseFieldText}>{choose_field}</Text>
        </TouchableOpacity>
      );
    } else {
      var chosenField = (
        <TouchableOpacity onPress={() => openFieldSearch()}>
          <Text style={styles.chooseFieldText}>{params.fieldName}</Text>
        </TouchableOpacity>
      );
    }

    const saveEvent = () => {

      if (this.state.errorMessage === null) {
        if (params.fieldID === null) {
          firebase
            .firestore()
            
            .collection("Events")
            .doc(moment(this.state.ogDate).format())
            .set({
              eventType: this.state.chosenEventType,
              endTime: this.state.endTime,
              team: this.props.userData.userTeamID,
              teamName: this.props.usersTeamData.teamUsername
            })
            .then(() => {
              var ref = firebase.firestore().collection("Teams");
              var query = ref
                .doc(this.props.userData.userTeamID)
                .collection("TeamUsers");
              query.get().then(
                function(doc) {
                  doc.forEach(doc => {
                    firebase
                      .firestore()
                      .collection("Events")
                      .doc(moment(this.state.ogDate).format())
                      .collection("Users")
                      .doc(doc.id)
                      .set({
                        state: 1,
                        usernameMember: doc.data().usernameMember
                      });
                  });
                }.bind(this)
              );
            })
            .then(() => {
              this.props.navigation.navigate("TeamScreen");
            });
        } else {
          firebase
            .firestore()
           
            .collection("Events")
            .doc(moment(this.state.ogDate).format())
            .set({
              eventType: this.state.chosenEventType,
              endTime: this.state.endTime,
              eventFieldID: params.fieldID,
              eventFieldName: params.fieldName,
              team: this.props.userData.userTeamID,
              teamName: this.props.usersTeamData.teamUsername


            }).then(() => {
              var ref = firebase.firestore().collection("Teams");
              var query = ref
                .doc(this.props.userData.userTeamID)
                .collection("TeamUsers");
              query.get().then(
                function(doc) {
                  doc.forEach(doc => {
                    firebase
                      .firestore()
                     
                      .collection("Events")
                      .doc(moment(this.state.ogDate).format())
                      .collection("Users")
                      .doc(doc.id)
                      .set({
                        state: 1,
                        usernameMember: doc.data().usernameMember
                      });
                  });
                }.bind(this)
              );
            })
            .then(() => {
              this.props.navigation.navigate("TeamScreen");
            });
        }
      }
    };

    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.eventTypeModalVisible}
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
              this.setEventTypeModal(false);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20
              }}
              onPress={() => {
                this.setEventTypeModal(false);
              }}
            >
              <TouchableOpacity onPress={() => changeEventType(0)}>
                <Text style={styles.dialogText}>{event_type_array[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeEventType(1)}>
                <Text style={styles.dialogText}>{event_type_array[1]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeEventType(2)}>
                <Text style={styles.dialogText}>{event_type_array[2]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeEventType(3)}>
                <Text style={styles.dialogText}>{event_type_array[3]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeEventType(4)}>
                <Text style={styles.dialogText}>{event_type_array[4]}</Text>
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
            <Image
              style={styles.backButton}
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.topHeader}>{create_new_event}</Text>
        </View>
        <Text style={styles.header}>{event_field}</Text>
        {chosenField}
        <Text style={styles.header}>{event_type}</Text>

        <TouchableOpacity onPress={() => this.setEventTypeModal(true)}>
          <Text style={styles.timeText}>
            {event_type_array[this.state.chosenEventType]}
          </Text>
        </TouchableOpacity>

        <Text style={styles.header}>{event_date}</Text>
        <TouchableOpacity onPress={() => this.showDatePicker()}>
          <Text style={styles.timeText}>{this.state.date}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{start_time}</Text>
        <TouchableOpacity onPress={() => this.showStartTimePicker()}>
          <Text style={styles.timeText}>{this.state.startTime}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{end_time}</Text>
        <TouchableOpacity onPress={() => this.showEndTimePicker()}>
          <Text style={styles.timeText}>{this.state.endTime}</Text>
        </TouchableOpacity>

        {/*Date picker */}

        <DateTimePicker
          isVisible={this.state.datePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDatePicker}
          mode={"date"}
        />

        {/*Start time picker */}
        <DateTimePicker
          isVisible={this.state.startTimePickerVisible}
          onConfirm={this.handleStartTimePicked}
          onCancel={this.hideStartTimePicker}
          mode={"time"}
        />
        {/*End time picker */}

        <DateTimePicker
          isVisible={this.state.endTimePickerVisible}
          onConfirm={this.handleEndTimePicked}
          onCancel={this.hideEndTimePicker}
          mode={"time"}
        />

        <Text style={styles.error}>{this.state.errorMessage}</Text>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => saveEvent()}
        >
          <Text style={styles.buttonText}>{save}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEventScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 10
  },
  dialogText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 8
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  header: {
    fontWeight: "bold",
    fontSize: 20,
    marginStart: 12,
    marginBottom: 8,
    color: "#a5a5a5"
  },

  topHeader: {
    fontWeight: "bold",
    fontSize: 20,
    marginStart: 12
  },

  chooseFieldText: {
    color: "#3bd774",
    fontWeight: "bold",
    fontSize: 30,
    marginStart: 30,
    marginBottom: 12
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

  timeText: {
    fontWeight: "bold",
    fontSize: 30,
    marginStart: 30,
    marginBottom: 12,
    color: "black"
  },

  error: {
    color: "red",
    fontWeight: "bold",
    margin: 8
  }
});
