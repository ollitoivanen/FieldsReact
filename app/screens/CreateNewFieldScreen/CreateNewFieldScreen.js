import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Modal,
  ScrollView
} from "react-native";
import firebase from "react-native-firebase";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";

import {
  field_name,
  save,
  edit_field,
  please_fill_all_fields,
  add_new_field,
  field_type_array,
  field_access_type_array,
  field_access_type,
  field_field_type,
  field_goal_count,
  field_type,
  get_field_location,
  field_location_set
} from "../../strings/strings";

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

class CreateNewFieldScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      fieldName: "",
      fieldArea: "",
      fieldAddress: "",
      errorMessage: null,
      fieldTypeModalVisible: false,
      fieldAccessTypeModalVisible: false,
      fieldGoalCountModalVisible: false,
      chosenFieldType: 0,
      chosenAccessType: 2,
      goalCount: 1,
      fieldImage: require("FieldsReact/app/images/FieldImageDefault/field_image_default.png"),
      fieldImageInitial: null
    };
  }
  showPicker = () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.warn("User cancelled image picker");
      } else if (response.error) {
        console.warn("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.warn("User tapped custom button: ", response.customButton);
      } else {
        let source = response.uri;
        let clearPath = response.uri;

        this.setState({
          fieldImage: { uri: source },
          fieldImageInitial: source
        });
      }
    });
  };

  setFieldTypeModal(visible) {
    this.setState({ fieldTypeModalVisible: visible });
  }

  setFieldAccessTypeModal(visible) {
    this.setState({ fieldAccessTypeModalVisible: visible });
  }
  setGoalCountModal(visible) {
    this.setState({ fieldGoalCountModalVisible: visible });
  }

  render() {
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
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
      );
    }
    var { params } = this.props.navigation.state;
    const saveFieldData = () => {
      var { params } = this.props.navigation.state;

      firebase.storage;
      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();

      let imagePath = this.state.fieldImage;
      let clearPath = this.state.fieldImageInitial;
      var fieldID = guid().substring(0, 7);

      if (this.state.fieldName !== "" && params.ltLn !== null) {
       
        if (clearPath !== null) {
          ImageResizer.createResizedImage(
            clearPath,
            200,
            200,
            "JPEG",
            100
          ).then(({ uri }) => {
            var { params } = this.props.navigation.state;
            const co = new firebase.firestore.GeoPoint(
              Math.round(params.lt * 10000000) / 10000000,
              Math.round(params.ln * 10000000) / 10000000,
           );

            storageRef
              .child("fieldpics/" + fieldID + "/" + fieldID + ".jpg")
              .putFile(uri);
          });
          firebase
            .firestore()
            .doc(fieldID)
            .set({
              fN: this.state.fieldName,
              fT: this.state.chosenFieldType,
              fAT: this.state.chosenAccessType,
             

            
              pH: 0,
              gC: this.state.goalCount,
              fIm: true
              //Goal count
            })
            .then(() => {
              this.props.navigation.replace("DetailFieldScreen", {
                fieldName: this.state.fieldName,

                fieldID: fieldID,
                fieldType: this.state.chosenFieldType,
                fieldAccessType: this.state.chosenAccessType,
                peopleHere: 0,
                goalCount: this.state.goalCount,

                currentFieldID: this.props.userData.cFI,
                currentFieldName: this.props.userData.cFN,
                timestamp: this.props.userData.ts,
                trainingCount: this.props.userData.tC,
                reputation: this.props.userData.re,
                fIm: true,
                d: ""
              });
            });
        } else {
          const co = new firebase.firestore.GeoPoint(
            Math.round(params.lt * 10000000) / 10000000,
            Math.round(params.ln * 10000000) / 10000000,
          );

          firebase
            .firestore()
            .collection("Fields")
            .doc(fieldID)
            .set({
              fN: this.state.fieldName,
              fT: this.state.chosenFieldType,
              fAT: this.state.chosenAccessType,
              pH: 0,
              gC: this.state.goalCount,
              fIm: false,
              co,

              
            })
            .then(() => {
              this.props.navigation.replace("DetailFieldScreen", {
                fieldName: this.state.fieldName,

                fieldID: fieldID,
                fieldType: this.state.chosenFieldType,
                fieldAccessType: this.state.chosenAccessType,
                peopleHere: 0,
                goalCount: this.state.goalCount,
                d: "",

                currentFieldID: this.props.userData.cFI,
                currentFieldName: this.props.userData.cFN,
                timestamp: this.props.userData.ts,
                trainingCount: this.props.userData.tC,
                reputation: this.props.userData.re,
                fIm: false
              });
            });
        }
      } else {
        this.setState({ errorMessage: [please_fill_all_fields] });
      }
    };
    var { params } = this.props.navigation.state;

    if (params.lt === null) {
      var getFieldLocationBox = (
        <TouchableOpacity
          style={styles.getLocationBox}
          onPress={() =>
            this.props.navigation.navigate("MapScreen", {
              markerSet: false,
              lt: 0,
              ln: 0,
              latitudeDelta: 10000,
              longitudeDelta: 10000,
              fromCreate: true
            })
          }
        >
          <Text style={styles.getLocationText}>{get_field_location}</Text>
        </TouchableOpacity>
      );
    } else {
      var getFieldLocationBox = (
        <TouchableOpacity
          style={styles.getLocationBox}
          onPress={() =>
            this.props.navigation.navigate("MapScreen", {
              markerSet: true,
              lt: params.lt,
              ln: params.ln,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              fromCreate: true
            })
          }
        >
          <Text style={styles.getLocationText}>{field_location_set}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <ScrollView style={styles.container}>
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
          <Text style={styles.fieldName}>{add_new_field}</Text>
        </View>

        <TouchableOpacity onPress={() => this.showPicker()}>
          <FastImage
            style={styles.profileImageEdit}
            source={this.state.fieldImage}
            borderRadius={35}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>{field_name}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_name}
          value={this.state.fieldName}
          onChangeText={fieldName => this.setState({ fieldName })}
        />

        {getFieldLocationBox}

        <Text style={styles.headerText}>{field_field_type}</Text>

        <TouchableOpacity onPress={() => this.setFieldTypeModal(true)}>
          <Text style={styles.pickerText}>
            {field_type_array[this.state.chosenFieldType]}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{field_access_type}</Text>

        <TouchableOpacity onPress={() => this.setFieldAccessTypeModal(true)}>
          <Text style={styles.pickerText}>
            {field_access_type_array[this.state.chosenAccessType]}
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>{field_goal_count}</Text>

        <TouchableOpacity onPress={() => this.setGoalCountModal(true)}>
          <Text style={styles.pickerText}>{this.state.goalCount}</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={this.state.fieldTypeModalVisible}
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
              this.setFieldTypeModal(!this.state.fieldTypeModalVisible);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20
              }}
              onPress={() => {
                this.setFieldTypeModal(!this.state.fieldTypeModalVisible);
              }}
            >
              <TouchableOpacity onPress={() => changeFieldType(0)}>
                <Text style={styles.dialogText}>{field_type_array[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldType(1)}>
                <Text style={styles.dialogText}>{field_type_array[1]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldType(2)}>
                <Text style={styles.dialogText}>{field_type_array[2]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldType(3)}>
                <Text style={styles.dialogText}>{field_type_array[3]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldType(4)}>
                <Text style={styles.dialogText}>{field_type_array[4]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldType(5)}>
                <Text style={styles.dialogText}>{field_type_array[5]}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.fieldAccessTypeModalVisible}
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
              this.setFieldAccessTypeModal(
                !this.state.fieldAccessTypeModalVisible
              );
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20
              }}
              onPress={() => {
                this.setFieldAccessTypeModal(
                  !this.state.fieldAccessTypeModalVisible
                );
              }}
            >
              <TouchableOpacity onPress={() => changeFieldAccessType(0)}>
                <Text style={styles.dialogText}>
                  {field_access_type_array[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldAccessType(1)}>
                <Text style={styles.dialogText}>
                  {field_access_type_array[1]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldAccessType(2)}>
                <Text style={styles.dialogText}>
                  {field_access_type_array[2]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeFieldAccessType(3)}>
                <Text style={styles.dialogText}>
                  {field_access_type_array[3]}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.fieldGoalCountModalVisible}
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
              this.setGoalCountModal(!this.state.fieldGoalCountModalVisible);
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20
              }}
              onPress={() => {
                this.setGoalCountModal(!this.state.fieldGoalCountModalVisible);
              }}
            >
              <TouchableOpacity onPress={() => changeGoalCount(1)}>
                <Text style={styles.dialogText}>{1}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(2)}>
                <Text style={styles.dialogText}>{2}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(3)}>
                <Text style={styles.dialogText}>{3}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(4)}>
                <Text style={styles.dialogText}>{4}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(5)}>
                <Text style={styles.dialogText}>{5}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(6)}>
                <Text style={styles.dialogText}>{6}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(7)}>
                <Text style={styles.dialogText}>{7}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(8)}>
                <Text style={styles.dialogText}>{8}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeGoalCount(9)}>
                <Text style={styles.dialogText}>{9}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => saveFieldData()}
        >
          <Text style={styles.buttonText}>{save}</Text>
        </TouchableOpacity>
        {this.state.errorMessage && (
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        )}
      </ScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewFieldScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
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
    marginTop: 20,
    marginBottom: 30,
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
  profileImageEdit: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderColor: "#e0e0e0",
    marginTop: 16,
    borderRadius: 40
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

  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    marginStart: 8
  },

  pickerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
    marginBottom: 10,
    marginStart: 8
  },

  dialogText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 8
  },

  getLocationBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#e0e0e0"
  },

  getLocationText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3bd774"
  }
});
