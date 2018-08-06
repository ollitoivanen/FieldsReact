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
  event_type
} from "../../strings/strings";
var moment = require("moment");
import DateTimePicker from "react-native-modal-datetime-picker";

export default class CreateEventScreen extends Component {
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
    this.setState({
      date: moment(date).format("ddd D MMM")
    });

    if (date < moment()) {
      this.setState({ errorMessage: event_date_has_already_passed });
      this.hideDatePicker();
    } else {
      this.setState({ errorMessage: null });

      this.hideDatePicker();
    }
  };

  handleStartTimePicked = date => {
    this.setState({
      startTime: moment(date).format("HH:mm")
    });

    if (this.state.startTime > this.state.endTime) {
      this.setState({ errorMessage: event_ends_before_it_starts });
      this.hideStartTimePicker();
    } else {
      this.setState({ errorMessage: null });

      this.hideStartTimePicker();
    }
  };
  handleEndTimePicked = date => {
    this.setState({
      endTime: moment(date).format("HH:mm")
    });

    if (this.state.startTime > this.state.endTime) {
      this.setState({ errorMessage: event_ends_before_it_starts });
      this.hideEndTimePicker();
    } else {
      this.setState({ errorMessage: null });

      this.hideEndTimePicker();
    }
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

      errorMessage: null,
      chosenEventType: 0,
      date: moment().format("ddd D MMM"),
      startTime: moment().format("HH:mm"),
      endTime: moment().format("HH:mm")
    };
  }
  render() {
    const changeEventType = index => {
      this.setState({ chosenEventType: index });
      this.setEventTypeModal(false);
    };
    return (
      <View style={styles.container}>
        <Modal transparent={true} visible={this.state.eventTypeModalVisible}  onRequestClose={()=>{}}>
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
          <Text style={styles.header}>{create_new_event}</Text>
        </View>
        <Text style={styles.header}>{event_type}</Text>

        <TouchableOpacity onPress={()=>this.setEventTypeModal(true)}>
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
          onPress={() => saveFieldData()}
        >
          <Text style={styles.buttonText}>{save}</Text>
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
