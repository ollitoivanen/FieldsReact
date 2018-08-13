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

import {
  field_name,
  field_address,
  field_city,
  save,
  edit_field,
  please_fill_all_fields,
  add_new_field,
  field_type_array,
  field_access_type_array,
  field_access_type,
  field_field_type,
  field_goal_count,
  field_type
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
      goalCount: 1
    };
  }

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
      if (
        this.state.fieldName !== "" &&
        this.state.fieldAddress !== "" &&
        this.state.fieldArea !== ""
      ) {
        var fieldID = guid().substring(0, 7);
        firebase
          .firestore()
          .collection("Fields")
          .doc(fieldID)
          .set({
            fN: this.state.fieldName,
            fAR: this.state.fieldArea,
            fA: this.state.fieldAddress,
            fARL: this.state.fieldArea.toLowerCase(),
            fNL: this.state.fieldName.toLowerCase(),
            fT: this.state.chosenFieldType,
            fAT: this.state.chosenAccessType,
            pH: 0,
            gG: this.state.goalCount
            //Goal count
          })
          .then(() => {
            this.props.navigation.replace("DetailFieldScreen", {
              fieldName: this.state.fieldName,
              fieldArea: this.state.fieldArea,
              fieldAddress: this.state.fieldAddress,
              fieldAreaLowerCase: this.state.fieldArea.toLowerCase(),
              fieldNameLowerCase: this.state.fieldName.toLowerCase(),
              fieldID: fieldID,
              fieldType: this.state.chosenFieldType,
              fieldAccessType: this.state.chosenAccessType,
              peopleHere: 0,
              goalCount: this.state.goalCount,

              currentFieldID: this.props.userData.cFI,
              currentFieldName: this.props.userData.cFN,
              timestamp: this.props.userData.ts,
              trainingCount: this.props.userData.tC,
              reputation: this.props.userData.re
            });
          });
      } else {
        this.setState({ errorMessage: [please_fill_all_fields] });
      }
    };

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

        <Text style={styles.headerText}>{field_name}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_name}
          value={this.state.fieldName}
          onChangeText={fieldName => this.setState({ fieldName })}
        />
        <Text style={styles.headerText}>{field_city}</Text>

        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_city}
          value={this.state.fieldArea}
          onChangeText={fieldArea => this.setState({ fieldArea })}
        />
        <Text style={styles.headerText}>{field_address}</Text>

        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_address}
          value={this.state.fieldAddress}
          onChangeText={fieldAddress => this.setState({ fieldAddress })}
        />

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
    marginStart: 8
  },

  dialogText: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 8
  }
});
