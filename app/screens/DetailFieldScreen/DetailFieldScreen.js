import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList
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
  youre_training_elsewhere,
  edit_field,
  field_name,
  field_city,
  field_address,
  save
} from "../../strings/strings";
import firebase from "react-native-firebase";
var moment = require("moment");
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import EventListItem from "FieldsReact/app/components/FieldEventListItem/FieldEventListItem"; // we'll create this next

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

/*const getFieldImage = () => {
  firebase
    .storage()
    .ref("/files/1234")
    .downloadFile("/path/to/save/file")
    .then(downloadedFile => {
      this.setState({ fieldName: downloadedFile.toString() }); //success
    })
    .catch(err => {
      //Error
    });
};*/

class DetailFieldScreen extends Component {
  componentWillMount = () => {
    var { params } = this.props.navigation.state;
    this.setState({
      currentFieldID: this.props.userData.cFI,
      currentFieldName: this.props.userData.cFN
    });
  };
  static navigationOptions = {
    header: null
  };

  loadEvents = () => {
    var { params } = this.props.navigation.state;

    const events = [];
    var ref = firebase.firestore().collection("Events");
    const query = ref.where("eFI", "==", params.fieldID);
    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const { eT, eFI, eFN, eTY, tUN } = doc.data();
          const id = doc.id;
          const date = moment(id).format("ddd D MMM");
          const startTime = moment(id).format("HH:mm");
          events.push({
            date,
            startTime,
            tUN,
            key: doc.id,
            doc,
            eTY,
            eFI,
            eFN,
            //How to fetch name
            id,
            eT
          });
        });
        this.setState({
          events
        });
      }.bind(this)
    );
  };

  startTraining = () => {
    var { params } = this.props.navigation.state;
    const startTime = moment().format("x");
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        cFI: this.state.fieldID,
        cFN: this.state.fieldName,
        ts: startTime
      })

      .then(() => {
        firebase
          .firestore()
          .collection("Fields")
          .doc(params.fieldID)
          .get()
          .then(function(doc) {
            firebase
              .firestore()
              .collection("Fields")
              .doc(params.fieldID)
              .update({
                pH: doc.data().pH + 1
              });
          });
      })
      .then(this.props.getUserData())

      .then(() => {
        this.props.navigation.navigate("TrainingScreen", {
          startTime: startTime,
          peopleHere: this.state.peopleHere,
          fieldID: this.state.fieldID
        });
      });
  };

  existingTraining = () => {
    var { params } = this.props.navigation.state;

    this.props.navigation.navigate("TrainingScreen", {
      startTime: this.props.userData.ts,
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
    var { params } = this.props.navigation.state;
    this.loadEvents();

    const userRef = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
    var { params } = this.props.navigation.state;

    this.state = {
      events: [],
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
      editVisible: false,
      fieldNameEdit: params.fieldName,
      fieldAreaEdit: params.fieldArea,
      fieldAddressEdit: params.fieldAddress
    };
  }
  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  setEditVisible(visible) {
    this.setState({ infoVisible: false, editVisible: visible });
  }

  render() {
    let imageUrl;

    //Small problem: if data is changed back to the param values, it wont be updated 31.7.2018
    const saveFieldData = () => {
      var { params } = this.props.navigation.state;

      if (
        this.state.fieldNameEdit === params.fieldName &&
        this.state.fieldAddressEdit === params.fieldAddress &&
        this.state.fieldAreaEdit === params.fieldArea
      ) {
        this.setEditVisible(false);
        //Only saving the changed
      } else if (
        this.state.fieldNameEdit !== params.fieldName &&
        this.state.fieldAddressEdit === params.fieldAddress &&
        this.state.fieldAreaEdit === params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldName: this.state.fieldNameEdit,
            fieldNameLowerCase: this.state.fieldNameEdit.toLowerCase()
          })
          .then(() => {
            this.setState({ fieldName: this.state.fieldNameEdit });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit === params.fieldName &&
        this.state.fieldAddressEdit !== params.fieldAddress &&
        this.state.fieldAreaEdit === params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldAddress: this.state.fieldAddressEdit
          })
          .then(() => {
            this.setState({ fieldAddress: this.state.fieldAddressEdit });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit === params.fieldName &&
        this.state.fieldAddressEdit === params.fieldAddress &&
        this.state.fieldArea !== params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldArea: this.state.fieldAreaEdit,
            fieldAreaLowerCase: this.state.fieldAreaEdit.toLowerCase()
          })
          .then(() => {
            this.setState({ fieldArea: this.state.fieldAreaEdit });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit !== params.fieldName &&
        this.state.fieldAddressEdit !== params.fieldAddress &&
        this.state.fieldAreaEdit === params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldName: this.state.fieldNameEdit,
            fieldNameLowerCase: this.state.fieldNameEdit.toLowerCase(),

            fieldAddress: this.state.fieldAddressEdit
          })
          .then(() => {
            this.setState({
              fieldName: this.state.fieldNameEdit,
              address: this.state.fieldAddressEdit
            });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit === params.fieldName &&
        this.state.fieldAddressEdit !== params.fieldAddress &&
        this.state.fieldAreaEdit !== params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldAddress: this.state.fieldAddressEdit,
            fieldArea: this.state.fieldAreaEdit,
            fieldAreaLowerCase: this.state.fieldAreaEdit.toLowerCase()
          })
          .then(() => {
            this.setState({
              fieldAddress: this.state.fieldAddressEdit,
              fieldArea: this.state.fieldAreaEdit
            });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit !== params.fieldName &&
        this.state.fieldAddressEdit === params.fieldAddress &&
        this.state.fieldAreaEdit !== params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldName: this.state.fieldNameEdit,
            fieldArea: this.state.fieldAreaEdit,
            fieldAreaLowerCase: this.state.fieldAreaEdit.toLowerCase(),
            fieldNameLowerCase: this.state.fieldNameEdit.toLowerCase()
          })
          .then(() => {
            this.setState({
              fieldName: this.state.fieldNameEdit,
              fieldArea: this.state.fieldAreaEdit
            });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      } else if (
        this.state.fieldNameEdit !== params.fieldName &&
        this.state.fieldAddressEdit !== params.fieldAddress &&
        this.state.fieldAreaEdit !== params.fieldArea
      ) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update({
            fieldName: this.state.fieldNameEdit,
            fieldAddress: this.state.fieldAddressEdit,
            fieldArea: this.state.fieldAreaEdit,
            fieldNameLowerCase: this.state.fieldNameEdit.toLowerCase(),
            fieldAreaLowerCase: this.state.fieldAreaEdit.toLowerCase()
          })
          .then(() => {
            this.setState({
              fieldName: this.state.fieldNameEdit,
              fieldAddress: this.state.fieldAddressEdit,
              fieldArea: this.state.fieldAreaEdit
            });
          })

          .then(() => {
            this.setEditVisible(false);
          });
      }
    };

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

    const navigateToEditFieldScreen = () => {
      this.setModalVisible(!this.state.infoVisible);
      this.props.navigation.navigate("EditFieldScreen", {
        fieldName: this.state.fieldName,
        fieldArea: this.state.fieldArea,
        fieldAddress: this.state.fieldAddress,
        fieldID: this.state.fieldID
      });
    };

    let trainingButton;

    if (this.props.userData.cFI === this.state.fieldID) {
      trainingButton = trainingButtonTraining;
    } else if (this.props.userData.cFI !== "") {
      trainingButton = trainingButtonTrainingElsewhere;
    } else {
      trainingButton = trainingButtonNotTraining;
    }
    return (
      <View style={styles.container}>
        <Modal visible={this.state.editVisible} onRequestClose={() => {}}>
          <View style={styles.editContainer}>
            <View style={styles.greenRowContainer}>
              <TouchableOpacity
                style={styles.backButton}
                underlayColor="#bcbcbc"
                onPress={() => this.setEditVisible(false)}
              >
                <Image
                  style={styles.backButton}
                  source={require("FieldsReact/app/images/BackButton/back_button.png")}
                />
              </TouchableOpacity>
              <Text style={styles.fieldName}>{edit_field}</Text>
            </View>

            <Text style={styles.headerText}>{field_name}</Text>
            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={field_name}
              value={this.state.fieldNameEdit}
              onChangeText={fieldNameEdit => this.setState({ fieldNameEdit })}
            />
            <Text style={styles.headerText}>{field_city}</Text>

            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={field_city}
              value={this.state.fieldAreaEdit}
              onChangeText={fieldAreaEdit => this.setState({ fieldAreaEdit })}
            />
            <Text style={styles.headerText}>{field_address}</Text>

            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={field_address}
              value={this.state.fieldAddressEdit}
              onChangeText={fieldAddressEdit =>
                this.setState({ fieldAddressEdit })
              }
            />

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => saveFieldData()}
            >
              <Text style={styles.buttonText}>{save}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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

              <TouchableOpacity
                style={styles.editFieldButton}
                onPress={() => this.setEditVisible(true)}
              >
                <Text style={styles.buttonText}>{edit_field}</Text>
              </TouchableOpacity>
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
            <Text style={styles.fieldName}>{this.state.fieldName}</Text>
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
            onPress={() => this.setModalVisible(true)}
          >
            <Image
              style={styles.infoIcon}
              source={require("FieldsReact/app/images/Info/info.png")}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginBottom: 50 }}
          data={this.state.events}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <EventListItem {...item} />
            </TouchableOpacity>
          )}
        />

        <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("FeedScreen", {
                  homeCityAdded: this.state.home
                })
              }
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Home/home.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationItemBlue}>
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Field/field_icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItem}
              onPress={() =>
                this.props.navigation.navigate("ProfileScreen", {})
              }
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Profile/profile.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailFieldScreen);

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
  },

  editFieldButton: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  textInput: {
    height: 60,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 20
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
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

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  editContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1
  },
  navigationContainerIn: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4fff8",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemBlue: {
    flex: 1,
    height: 50,
    backgroundColor: "#3facff",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  }
});
