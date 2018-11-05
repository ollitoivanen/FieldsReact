import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";
import firebase from "react-native-firebase";

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
  change_field_location
} from "../../strings/strings";
import I18n from "FieldsReact/i18n";

export default class EditFieldScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("EditFieldScreen", "EditFieldScreen");

    var { params } = this.props.navigation.state;

    this.state = {
      fieldTypeModalVisible: false,
      fieldAccessTypeModalVisible: false,
      fieldGoalCountModalVisible: false,
      chosenFieldType: params.fieldType,
      chosenAccessType: params.accessType,
      goalCount: params.goalCount,
      accessType: params.accessType,
      fieldImage: params.fieldImage,
      clearPath: null,
      fieldName: params.fieldName,
      lt: params.lt,
      ln: params.ln
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
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = response.uri;
        let clearPath = response.uri;

        this.setState({
          fieldImage: { uri: source },
          clearPath: clearPath
        });
      }
    });
  };
  setFieldTypeModal(visible) {
    this.setState({ fieldTypeModalVisible: visible });
  }

  setFieldAccessTypeModal(visible) {
    this.setState({
      fieldAccessTypeModalVisible: visible
    });
  }
  setGoalCountModal(visible) {
    this.setState({
      fieldGoalCountModalVisible: visible
    });
  }

  render() {
    var { params } = this.props.navigation.state;

    const saveFieldData = () => {
      var { params } = this.props.navigation.state;

      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();

      let imagePath = this.state.avatarSource;
      let clearPath = this.state.clearPath;

      if (params.ogLt !== params.lt) {
        const co = new firebase.firestore.GeoPoint(
          Math.round(params.lt * 10000000) / 10000000,
          Math.round(params.ln * 10000000) / 10000000
        );
        firebase
          .firestore()
          .collection("Fields")
          .doc(params.fieldID)
          .update({
            co
          });
      }

      if (this.state.chosenAccessType !== params.accessType) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(params.fieldID)
          .update({
            fAT: this.state.access_type
          });
      }
      if (this.state.chosenFieldType !== params.fieldType) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(params.fieldID)
          .update({
            fT: this.state.chosenFieldType
          });
      }
      if (this.state.goalCount !== params.goalCount) {
        firebase
          .firestore()
          .collection("Fields")
          .doc(params.fieldID)
          .update({
            gC: this.state.goalCount
          });
      }

      if (this.state.fieldName !== "") {
        if (this.state.fieldName === params.fieldName) {
          if (clearPath !== null) {
            ImageResizer.createResizedImage(
              clearPath,
              150,
              150,
              "JPEG",
              80
            ).then(({ uri }) => {
              var { params } = this.props.navigation.state;

              storageRef
                .child(
                  "fieldpics/" + params.fieldID + "/" + params.fieldID + ".jpg"
                )
                .putFile(uri)
                .then(() => {
                  if (params.fIm === false) {
                    firebase
                      .firestore()
                      .collection("Fields")
                      .doc(params.fieldID)
                      .update({
                        fIm: true
                      });
                  }
                })
                .then(() => {
                  this.props.navigation.goBack();
                });
            });
          } else {
            this.props.navigation.goBack();
          }

          //Only saving the changed
        } else if (this.state.fieldName !== params.fieldName) {
          if (clearPath !== null) {
            ImageResizer.createResizedImage(
              clearPath,
              150,
              150,
              "JPEG",
              80
            ).then(({ uri }) => {
              var { params } = this.props.navigation.state;

              storageRef
                .child(
                  "fieldpics/" + params.fieldID + "/" + params.fieldID + ".jpg"
                )
                .putFile(uri)
                .then(() => {
                  if (params.fIm === false) {
                    firebase
                      .firestore()
                      .collection("Fields")
                      .doc(params.fieldID)
                      .update({
                        fIm: true,
                        fN: this.state.fieldName
                      })

                      .then(() => {
                        this.props.navigation.navigate("DetailFieldScreen", {
                          fieldName: this.state.fieldName
                        });
                      });
                  }
                });
            });
          } else {
            firebase
              .firestore()
              .collection("Fields")
              .doc(params.fieldID)
              .update({
                fN: this.state.fieldName
              })

              .then(() => {
                this.props.navigation.navigate("DetailFieldScreen", {
                  fieldName: this.state.fieldName
                });
              });
          }
        }
      } else {
        this.setState({ errorMessage: [I18n.t("please_fill_all_fields")] });
      }
    };
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
    if (this.state.fieldImage === null) {
      var fieldImage = (
        <Image
          style={styles.profileImageEdit}
          source={{ uri: "field_image_default" }}
          borderRadius={35}
          resizeMode="cover"
        />
      );
    } else {
      var fieldImage = (
        <FastImage
          style={styles.profileImageEdit}
          source={this.state.fieldImage}
          borderRadius={35}
          resizeMode="cover"
        />
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.paddingContainer}>
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
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.fieldName}>{I18n.t("edit_field")}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => this.showPicker()}>
            {fieldImage}
          </TouchableOpacity>
          <Text style={styles.headerText}>{I18n.t("field_name")}</Text>
          <TextInput
            style={styles.textInput}
            maxLength={30}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder={I18n.t("field_name")}
            value={this.state.fieldName}
            onChangeText={fieldName => this.setState({ fieldName })}
          />
          <TouchableOpacity
            style={styles.getLocationBox}
            onPress={() =>
              this.props.navigation.navigate("MapScreen", {
                markerSet: true,
                lt: params.lt,
                ln: params.ln,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                from: "editField"
              })
            }
          >
            <Text style={styles.getLocationText}>
              {I18n.t("change_field_location")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{I18n.t("field_field_type")}</Text>

          <TouchableOpacity onPress={() => this.setFieldTypeModal(true)}>
            <Text style={styles.pickerText}>
              {I18n.t(["field_type_array", this.state.chosenFieldType])}
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{I18n.t("field_access_type")}</Text>

          <TouchableOpacity onPress={() => this.setFieldAccessTypeModal(true)}>
            <Text style={styles.pickerText}>
              {I18n.t(["field_access_type_array", this.state.chosenAccessType])}
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerText}>{I18n.t("field_goal_count")}</Text>

          <TouchableOpacity onPress={() => this.setGoalCountModal(true)}>
            <Text style={styles.pickerText}>{this.state.goalCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => saveFieldData()}
          >
            <Text style={styles.buttonText}>{I18n.t("save")}</Text>
          </TouchableOpacity>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
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
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 0])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldType(1)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 1])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldType(2)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 2])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldType(3)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 3])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldType(4)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 4])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldType(5)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_type_array", 5])}
                  </Text>
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
                    {I18n.t(["field_access_type_array", 0])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldAccessType(1)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_access_type_array", 1])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldAccessType(2)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_access_type_array", 2])}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeFieldAccessType(3)}>
                  <Text style={styles.dialogText}>
                    {I18n.t(["field_access_type_array", 3])}
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
                  this.setGoalCountModal(
                    !this.state.fieldGoalCountModalVisible
                  );
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
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  paddingContainer: {
    paddingBottom: 26
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
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
  textInput: {
    height: 60,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 20
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
  },
  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
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
  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    marginStart: 8
  }
});
