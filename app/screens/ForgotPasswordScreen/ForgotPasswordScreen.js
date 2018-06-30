import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import {
  forgot_password_enter_email,
  email,
  send
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";

export default class ForgotPasswordScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = { email1: "" };
  
  sendMessage = () => {
    const { email1 } = this.state;
    firebase.auth().sendPasswordResetEmail(email1);
  };

  render() {
    
    const {goBack} = this.props.navigation.goBack;

    return (
      <View style={styles.container}>
        <Image style={styles.logo}
          source={require("FieldsReact/app/images/back_icon.png")}
          onPress={()=> this.props.navigation.goBack()}

        />
        <Text style={styles.text}>{forgot_password_enter_email}</Text>
        
        <TextInput
          value={this.state.email1}
          style={styles.textInput}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={email}
          autoCapitalize="none"
          returnKeyType="go"
          keyboardType="email-address"
          onChangeText={email1 => this.setState({ email1 })}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.sendMessage}
        >
          <Text style={styles.buttonText}>{send}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    flex: 0
  },

  text: {
    marginTop: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#919191"
  },
  textInput: {
    height: 40,
    marginTop: 24,
    backgroundColor: "#efeded",
    paddingHorizontal: 8,
    borderRadius: 10,
    fontWeight: "bold"
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 32,
    borderRadius: 10
  },

  logo: {
      height: 48,
      width: 48
  }
});
