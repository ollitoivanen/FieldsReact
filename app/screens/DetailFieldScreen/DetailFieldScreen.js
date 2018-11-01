import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  Geolocation,
  Platform,
  AsyncStorage,
  AppState
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
  save,
  field_field_type,
  field_access_type,
  field_goal_count,
  please_fill_all_fields,
  change_field_location,
  current_training,
  currently_training_at,
  report
} from "../../strings/strings";
import firebase from "react-native-firebase";
var moment = require("moment");
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";
var PushNotification = require("react-native-push-notification");
import PushService from "FieldsReact/PushService";
import Permissions from "react-native-permissions";
import I18n from "FieldsReact/i18n";
import * as RNIap from "react-native-iap";

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

class DetailFieldScreen extends Component {
  sendNotification = () => {
    if (Platform.OS === "android") {
      this.notif.localNotif(
        this.state.fieldName,
        moment().format("x"),
        this.state.fieldID
      );
    } else {
      PushNotification.requestPermissions();
    }
  };

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

  getFieldImage = () => {
    var { params } = this.props.navigation.state;

    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child("fieldpics/" + params.fieldID + "/" + params.fieldID + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({ fieldImage: { uri: downloadedFile.toString() } });
      })
      .catch(err => {});
  };

  loadEvents = () => {
    var { params } = this.props.navigation.state;


    firebase.firestore().collection("Fields").doc(params.fieldID).get().then(doc=>{
      this.setState({peopleHere: doc.data().pH})
    })

    const events = [];
    var ref = firebase.firestore().collection("Events");
    const query = ref.where("eFI", "==", params.fieldID);
    query.get().then(
      function(doc) {
        firebase.analytics().logEvent("fetchFieldEvents");

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
    firebase.analytics().logEvent("startTraining");

    /*if(Platform.OS === 'ios'){
    Permissions.check('notifications').then(response=>{
      if(response==='denied'){
        Permissions.request('notification')
      }
    })
  }
*/
    var { params } = this.props.navigation.state;
    this.sendNotification();
    const startTime = moment().format("x");
    var promise = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        cFI: this.state.fieldID,
        cFN: this.state.fieldName,
        ts: startTime
      })
      .then(this.props.getUserData())

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
      });
    Promise.all([promise]).then(() => {
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

  toggleFavorite = boolean => {
    promise1 = RNIap.initConnection();
    Promise.all([promise1]).then(() => {
      RNIap.getAvailablePurchases()
        .then(purchases => {
          var productId = purchases[0].productId;

          if (productId == "fields_plus") {
            var { params } = this.props.navigation.state;

            if (boolean === true) {
              if (this.props.userData.fP === true) {
                firebase
                  .firestore()
                  .collection("Users")
                  .doc(firebase.auth().currentUser.uid)
                  .collection("FF")
                  .doc(this.state.fieldID)
                  .set({
                    3: 0
                  });
                var favoriteFields = this.state.favoriteFields;
                favoriteFields.push({
                  key: this.state.fieldID,
                  id: this.state.fieldID,
                  fN: this.state.fieldName,
                  //d: params.d,
                  // fI: ,

                  fIm: params.fIm
                });
                favoriteFields.sort(
                  (a, b) => parseFloat(a.d) - parseFloat(b.d)
                );

                const alreadyVisited = [];
                serializedData = JSON.stringify(favoriteFields, function(
                  key,
                  value
                ) {
                  if (typeof value == "object") {
                    if (alreadyVisited.indexOf(value.key) >= 0) {
                      // do something other that putting the reference, like
                      // putting some name that you can use to build the
                      // reference again later, for eg.
                      return value.key;
                    }
                    alreadyVisited.push(value.name);
                  }
                  return value;
                });
                this.storeData(serializedData);
              }
            } else {
              firebase
                .firestore()
                .collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .collection("FF")
                .doc(this.state.fieldID)
                .delete();

              let favoriteArray = this.state.favoriteFields;

              let foundFavorite = favoriteArray.find(
                favoriteArray => favoriteArray.id === this.state.fieldID
              );

              favoriteArray.pop(foundFavorite);
              const alreadyVisited = [];
              serializedData = JSON.stringify(favoriteArray, function(
                key,
                value
              ) {
                if (typeof value == "object") {
                  if (alreadyVisited.indexOf(value.key) >= 0) {
                    // do something other that putting the reference, like
                    // putting some name that you can use to build the
                    // reference again later, for eg.
                    return value.key;
                  }
                  alreadyVisited.push(value.name);
                }
                return value;
              });
              this.storeData(serializedData);
            }
          } else {
            if (this.props.userData.fP === true) {
              promise1 = firebase
                .firestore()
                .collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                  fP: false
                });
              promise2 = AsyncStorage.removeItem("fP");
              promise3 = this.props.getUserData();

              Promise.all([promise1, promise2, promise3]).then(() => {
                RNIap.endConnection();
                firebase.analytics().logEvent("toFieldsPlusScreen");

                this.props.navigation.navigate("FieldsPlusScreen");
              });
            } else {
              RNIap.endConnection();
              firebase.analytics().logEvent("toFieldsPlusScreen");

              this.props.navigation.navigate("FieldsPlusScreen");
            }
          }
        })
        .catch(() => {
          RNIap.endConnection();
          firebase.analytics().logEvent("toFieldsPlusScreen");

          this.props.navigation.navigate("FieldsPlusScreen");
        });
    });
  };

  loadFavoriteFields() {
    const ref = firebase.firestore().collection("Users");
    var { params } = this.props.navigation.state;
    const favoriteFields = [];

    var serializedData;

    const query = ref.doc(firebase.auth().currentUser.uid).collection("FF");

    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const id = doc.id;
            const { fN, fI, fT, gC, fAT, pH, fIm, co } = doc.data();

            if (fIm === true) {
              favoriteFields.push({
                key: doc.id,

                id,
                fN,

                fIm
              });
            } else {
              favoriteFields.push({
                key: doc.id,

                id,
                fN,

                fIm
              });
            }

            //Sorting the results! cool 2018
            favoriteFields.sort((a, b) => parseFloat(a.d) - parseFloat(b.d));
          });
        }.bind(this)
      )
      .then(() => {
        const alreadyVisited = [];
        serializedData = JSON.stringify(favoriteFields, function(key, value) {
          if (typeof value == "object") {
            if (alreadyVisited.indexOf(value.key) >= 0) {
              // do something other that putting the reference, like
              // putting some name that you can use to build the
              // reference again later, for eg.
              return value.key;
            }
            alreadyVisited.push(value.name);
          }
          return value;
        });
      })

      .then(() => {
        this.storeData(serializedData);
      });
  }

  storeData = async data => {
    try {
      await AsyncStorage.setItem("favoriteFields", data).then(
        this.retrieveData()
      );
    } catch (error) {
      // Error saving data
    }
  };

  retrieveData = async () => {
    if (this.props.userData.fP === true) {
      const value = await AsyncStorage.getItem("favoriteFields");
      if (value !== null) {
        this.setState({ favoriteFields: JSON.parse(value) });
        let favoriteArray = JSON.parse(value);

        let foundFavorite = favoriteArray.find(
          favoriteArray => favoriteArray.id === this.state.fieldID
        );
        if (foundFavorite === undefined) {
          this.setState({ favorite: false });
        } else {
          this.setState({ favorite: true });
        }
      } else {
        this.loadFavoriteFields();
      }
    }
  };

  constructor(props) {
    super(props);
    firebase
      .analytics()
      .setCurrentScreen("DetailFieldScreen", "DetailFieldScreen");

    var { params } = this.props.navigation.state;
    this.notif = new PushService();

    this.loadEvents();
    this.retrieveData();

    const userRef = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
    var { params } = this.props.navigation.state;

    if (params.fIm === true) {
      this.getFieldImage();
    }
    if (params.d === undefined) {
      this.state = {
        events: [],
        fieldName: params.fieldName,
        fieldID: params.fieldID,
        favorite: false,

        fieldType: params.fieldType,
        accessType: params.accessType,
        goalCount: params.goalCount,
        peopleHere: params.peopleHere,
        infoVisible: false,
        d: "",

        expandeImageVisible: false,
        fieldImage: require("FieldsReact/app/images/FieldImageDefault/field_image_default.png"),
        avatarSource: require("FieldsReact/app/images/FieldImageDefault/field_image_default.png")
      };
    } else {
      this.state = {
        events: [],
        fieldName: params.fieldName,
        fieldID: params.fieldID,
        favorite: false,

        fieldType: params.fieldType,
        accessType: params.accessType,
        goalCount: params.goalCount,
        peopleHere: params.peopleHere,
        infoVisible: false,
        d: params.d,

        expandeImageVisible: false,
        fieldImage: require("FieldsReact/app/images/FieldImageDefault/field_image_default.png"),
        avatarSource: require("FieldsReact/app/images/FieldImageDefault/field_image_default.png")
      };
    }
  }

  setModalVisible(visible) {
    this.setState({ infoVisible: visible });
  }

  setEditVisible(visible) {
    var { params } = this.props.navigation.state;

    this.setState({
      infoVisible: false
    }),
      this.props.navigation.navigate("EditFieldScreen", {
        fieldType: this.state.fieldType,
        accessType: this.state.accessType,
        goalCount: this.state.goalCount,
        fieldImage: this.state.fieldImage,
        fieldName: this.state.fieldName,
        fieldID: this.state.fieldID,
        fIm: params.fIm,
        lt: params.lt,
        ln: params.ln,
        ogLt: params.lt
      });
  }

  setExpandedImageVisible(visible) {
    this.setState({ expandeImageVisible: visible });
  }

  render() {
    var { params } = this.props.navigation.state;

    let imageUrl;
    const changeFieldType = index => {
      this.setState({ chosenFieldType: index });
      this.setFieldTypeModal(false);
    };
    const changeFieldAccessType = index => {
      this.setState({ chosenAccessType: index });
      this.setFieldAccessTypeModal(false);
    };

    const changeGoalCount = index => {
      this.setState({ goalCount: index });
      this.setGoalCountModal(false);
    };
    //Small problem: if data is changed back to the param values, it wont be updated 31.7.2018

    if (this.state.favorite === true) {
      var favoriteIcon = (
        <TouchableOpacity
          style={styles.favoriteContainer}
          onPress={() => this.toggleFavorite(false)}
        >
          <Image style={styles.favoriteIcon} source={{ uri: "favorite" }} />
        </TouchableOpacity>
      );
    } else {
      var favoriteIcon = (
        <TouchableOpacity
          style={styles.favoriteContainer}
          onPress={() => this.toggleFavorite(true)}
        >
          <Image
            style={styles.favoriteIcon}
            source={{ uri: "favorite_bordered" }}
          />
        </TouchableOpacity>
      );
    }
    const trainingButtonTraining = (
      <TouchableOpacity
        style={styles.startTrainingButton}
        onPress={() => this.existingTraining()}
      >
        <Text style={styles.boxTextBlue}>{I18n.t("youre_training_here")}</Text>
      </TouchableOpacity>
    );

    const trainingButtonNotTraining = (
      <TouchableOpacity
        style={styles.startTrainingButton}
        onPress={() => this.startTraining()}
      >
        <Text style={styles.boxTextBlue}>{I18n.t("start_training_here")}</Text>
      </TouchableOpacity>
    );

    const trainingButtonTrainingElsewhere = (
      <TouchableOpacity style={styles.startTrainingButton}>
        <Text style={styles.boxTextBlue}>
          {I18n.t("youre_training_elsewhere")}
        </Text>
      </TouchableOpacity>
    );

    let trainingButton;

    if (this.props.userData.cFI === this.state.fieldID) {
      trainingButton = trainingButtonTraining;
    } else if (this.props.userData.cFI !== "") {
      trainingButton = trainingButtonTrainingElsewhere;
    } else {
      trainingButton = trainingButtonNotTraining;
    }

    var fieldIm = (
      <TouchableOpacity
        style={{}}
        onPress={() => this.setExpandedImageVisible()}
      >
        <FastImage
          style={styles.profileImage}
          source={this.state.fieldImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );

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
                {I18n.t("info")}
              </Text>
              <Text style={styles.infoText}>
                {I18n.t("goals")} {this.state.goalCount}
              </Text>
              <Text style={styles.infoText}>
                {I18n.t("field_type")}{" "}
                {I18n.t(["field_type_array", this.state.fieldType])}
              </Text>

              <Text style={styles.infoText}>
                {I18n.t("access_type")}{" "}
                {I18n.t(["field_access_type_array", this.state.accessType])}
              </Text>

              <TouchableOpacity
                style={styles.editFieldButton}
                onPress={() => this.setEditVisible(true)}
              >
                <Text style={styles.buttonText}>{I18n.t("edit_field")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => {
                  this.props.navigation.navigate("SupportScreen"),
                    this.setModalVisible(false);
                }}
              >
                <Text style={styles.reportText}>{I18n.t("report")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.expandeImageVisible}
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
            onPress={() => this.setExpandedImageVisible(false)}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20
              }}
              onPress={() => this.setExpandedImageVisible(false)}
            >
              <FastImage
                source={this.state.fieldImage}
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
              />
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
                source={{ uri: "back_button" }}
              />
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
              <Text style={styles.fieldName}>
                {params.fieldName + " " + this.state.d}
              </Text>
              {favoriteIcon}
            </View>
          </View>
          <View style={styles.greenRowContainer}>
            {fieldIm}

            <View>
              <TouchableOpacity style={styles.peopleHereButton}>
                <Text style={styles.boxTextBlack}>
                  {this.state.peopleHere} {I18n.t("people_here")}
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
            <Image style={styles.infoIcon} source={{ uri: "info" }} />
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
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("FeedScreen", {})}
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image style={styles.navigationImage} source={{ uri: "home" }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationItemBlue}>
            <Image
              style={styles.navigationImage}
              source={{ uri: "field_icon" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => this.props.navigation.navigate("ProfileScreen", {})}
          >
            <Image style={styles.navigationImage} source={{ uri: "profile" }} />
          </TouchableOpacity>
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
  playersButton: {
    padding: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    marginTop: 8
  },
  reportText: {
    fontWeight: "bold",
    margin: 4,
    textAlign: "center"
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3
  },

  fieldImage: {
    width: 70,
    height: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "white",
    marginTop: 10,
    borderRadius: 35
  },

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12,
    marginEnd: 40,
    flexWrap: "wrap"
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

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "white",
    marginTop: 16,
    borderRadius: 40
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
    marginStart: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2
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

  favoriteContainer: {
    height: 28,
    width: 28,
    marginEnd: 8,
    position: "absolute",
    right: 0
  },

  favoriteIcon: {
    height: 28,
    width: 28
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

  greenRowContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  editContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  navigationContainer: {
    ...Platform.select({
      ios: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        elevation: 3,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "flex-end",
        elevation: 10
      }
    })
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
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
