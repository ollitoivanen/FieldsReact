import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import {
  field_name,
  field_address,
  field_city,
  save,
  edit_field
} from "../../strings/strings";
import firebase from "react-native-firebase";

export default class EditFieldScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;
    this.state = {
      fieldName: params.fieldName,
      fieldArea: params.fieldArea,
      fieldAddress: params.fieldAddress,
      fieldID: params.fieldID
    };
  }

    

  render() {

    const saveFieldData = () => {
        var { params } = this.props.navigation.state;
    
        if (
          this.state.fieldName === params.fieldName &&
          this.state.fieldAddress === params.fieldAddress &&
          this.state.fieldArea === params.fieldArea
        ) {
          this.props.navigation.goBack();
        }
        firebase
          .firestore()
          .collection("Fields")
          .doc(this.state.fieldID)
          .update();
      };
    return (
      <View style={styles.container}>
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
          <Text style={styles.fieldName}>{edit_field}</Text>
        </View>

        <Text style={styles.headerText}>{field_name}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_name}
          value={this.state.fieldName}
        />
        <Text style={styles.headerText}>{field_city}</Text>

        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_city}
          value={this.state.fieldArea}
        />
        <Text style={styles.headerText}>{field_address}</Text>

        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={field_address}
          value={this.state.fieldAddress}
        />

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
  }
});
