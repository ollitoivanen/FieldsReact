import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal
} from "react-native";
import {
  goals,
  address,
  access_type,
  info,
  field_type,
  field_type_array,
  field_access_type_array,
  people_here,
  start_training_here,
  youre_training_here,
  youre_training_elsewhere
} from "../../strings/strings";
import firebase from "react-native-firebase";
var moment = require("moment");
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class DetailFieldsScreen extends Component {
  componentWillMount = () => {
    var { params } = this.props.navigation.state;

    this.setState({
      currentFieldID: this.props.userData.currentFieldID,
      currentFieldName: this.props.userData.currentFieldName
    });
  };
  static navigationOptions = {
    header: null
  };

  startTraining = () => {
    var { params } = this.props.navigation.state;

    const startTime = moment().format("x");
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        currentFieldID: this.state.fieldID,
        currentFieldName: this.state.fieldName,
        timestamp: startTime
      })
      .then(this.props.getUserData())
      .then(()=>{
        firebase.firestore()
        .collection("Fields")
        .doc(this.state.fieldID)
        .update({
        peopleHere: this.state.peopleHere + 1
        })
      })
      .then(

        this.props.navigation.navigate("TrainingScreen", {
          startTime: startTime, 
          peopleHere: this.state.peopleHere + 1,
          fieldID: this.state.fieldID

        })
      );
  };

  existingTraining = () => {
    var { params } = this.props.navigation.state;

    this.props.navigation.navigate("TrainingScreen", {
      startTime: this.props.userData.timestamp,
      peopleHere: this.state.peopleHere,
      fieldID: this.state.fieldID

      /*  fieldName: this.state.fieldName,
      reputation: params.reputation,
      trainingCount: params.trainingCount,
      refresh: this.setStateAfterTrainingEnd*/
    });
  };
  constructor(props) {
    super(props);
    const userRef = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);

    var { params } = this.props.navigation.state;
    this.state = {
      fieldName: params.fieldName,
      fieldArea: params.fieldArea,
      fieldID: params.fieldID,
      fieldNameLowerCase: params.fieldNameLowerCase,
      fieldAreaLowerCase: params.fieldAreaLowerCase,
      fieldType: params.fieldType,
      goalCount: params.goalCount,
      accessType: params.accessType,
      fieldAddress: params.fieldAddress,
      peopleHere: params.peopleHere,
      infoVisible: false,

      comingFromNewTraining: false
    };
  }
  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  render() {
    const trainingButtonTraining = (
      <TouchableOpacity style={styles.startTrainingButton}>
        <Text
          style={styles.boxTextBlue}
          onPress={() => this.existingTraining()}
        >
          {youre_training_here}
        </Text>
      </TouchableOpacity>
    );

    const trainingButtonNotTraining = (
      <TouchableOpacity
        style={styles.startTrainingButton}
        onPress={() => this.startTraining()}
      >
        <Text style={styles.boxTextBlue}>{start_training_here}</Text>
      </TouchableOpacity>
    );

    const trainingButtonTrainingElsewhere = (
      <TouchableOpacity style={styles.startTrainingButton}>
        <Text style={styles.boxTextBlue}>{youre_training_elsewhere}</Text>
      </TouchableOpacity>
    );

    let trainingButton;

    if (this.props.userData.currentFieldID === this.state.fieldID) {
      trainingButton = trainingButtonTraining;
    } else if (this.props.userData.currentFieldID !== "") {
      trainingButton = trainingButtonTrainingElsewhere;
    } else {
      trainingButton = trainingButtonNotTraining;
    }
    return (
      <View style={styles.container}>
        <Modal transparent={true} visible={this.state.infoVisible}>
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
                padding: 20
              }}
              onPress={() => {
                this.setModalVisible(!this.state.infoVisible);
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 8,
                  marginStart: 4
                }}
              >
                {info}
              </Text>
              <Text style={styles.infoText}>
                {goals} {this.state.goalCount}
              </Text>
              <Text style={styles.infoText}>
                {field_type} {field_type_array[[this.state.fieldType]]}
              </Text>

              <Text style={styles.infoText}>
                {access_type} {field_access_type_array[[this.state.accessType]]}
              </Text>
              <Text style={styles.infoText}>
                {address} {this.state.fieldAddress}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <View style={styles.greenBackground}>
          <View style={styles.greenRowContainer}>
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
            <Text style={styles.fieldName}>{this.state.fieldName} </Text>
          </View>
          <View style={styles.greenRowContainer}>
            <Image
              style={styles.fieldImage}
              source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
              borderRadius={35}
              resizeMode="cover"
            />

            <View>
              <TouchableOpacity style={styles.peopleHereButton}>
                <Text style={styles.boxTextBlack}>
                  {this.state.peopleHere} {people_here}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {trainingButton}

          <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Image
              style={styles.infoIcon}
              source={require("FieldsReact/app/images/Info/info.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailFieldsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10
  },

  fieldImage: {
    width: 70,
    height: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 5,
    padding: 5,
    borderColor: "white",
    marginTop: 10
  },

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  greenRowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  startTrainingButton: {
    alignSelf: "flex-start",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,

    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 20,
    marginStart: 8
  },

  peopleHereButton: {
    alignSelf: "center",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 6,
    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginStart: 18
  },

  boxTextBlack: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2b2b2b"
  },

  boxTextBlue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#3facff"
  },

  infoContainer: {
    position: "absolute",
    bottom: 18,
    end: 12,
    height: 36,
    width: 36
  },

  infoIcon: {
    height: 36,
    width: 36
  },
  infoBox: {},

  infoText: {
    fontWeight: "bold",
    margin: 4
  }
});
