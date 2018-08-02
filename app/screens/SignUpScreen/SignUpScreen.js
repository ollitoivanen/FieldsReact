import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Modal,
  ActivityIndicator,
  Dimensions,
  
} from "react-native";
import {
  email,
  password,
  welcome,
  signup,
  please_enter_valid_email,
  please_enter_password,
  already_have_an_account,
  name,
  terms,
  by_signing_up_you,
  please_enter_username
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";
import validator from "validator";
import { username } from "../../strings/strings";
import Loader from "FieldsReact/app/components/Loader/Loader.js";

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("Users");
    this.unsubscribe = null;
    this.state = {
      email1: "",
      password1: "",
      username1: "",
      errorMessage: null,
      loading: false
    };
  }

  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ username1: newText });
  };

  handleSignUp = () => {
    if (this.state.username1.length == 0) {
      this.setState({ errorMessage: [please_enter_username] });
    } else if (!validator.isEmail(this.state.email1)) {
      this.setState({ errorMessage: [please_enter_valid_email] });
    } else if (this.state.password1.length == 0) {
      this.setState({ errorMessage: [please_enter_password] });
    } else if (this.state.password1.length < 7) {
      this.setState({ errorMessage: [please_enter_password] });
    } else {
      this.setState({ loading: true });
      firebase
        .auth()
        .createUserAndRetrieveDataWithEmailAndPassword(
          this.state.email1,
          this.state.password1
        )
        .then(() =>
          this.ref.doc(firebase.auth().currentUser.uid).set({
            username: this.state.username1.toLowerCase(),
            realName: "",
            userID: firebase.auth().currentUser.uid,
            currentFieldID: "",
            currentFieldName: "",
            homeCity: "",
            role: 0,
            position: -1,
            reputation: 0,
            userTeamID: null,
            trainingCount: 0,
            friendCount: 0,
            timestamp: null,
            token: null, //Needs to be changed when creating notifications
            fieldsPlus: false
          })
        )
        .then(() => this.props.navigation.navigate("FeedScreen"));
    }
  };
  render() {
    const { username1 } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          />
        </View>
        <Text style={styles.text2}>{welcome}</Text>
        <TextInput
          textContentType="username"
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={username}
          autoCapitalize="none"
          style={styles.textInput}
          returnKeyType="next"
          autoCapitalize="none"
          value={username1}
          onSubmitEditing={() => this.emailInput.focus()}
          onChangeText={this.usernameHandle}
        />
        <TextInput
          maxLength={100}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={email}
          returnKeyType="next"
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => this.passwordInput.focus()}
          ref={input => (this.emailInput = input)}
          style={styles.textInput}
          onChangeText={email1 => this.setState({ email1 })}
        />
        <TextInput
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          secureTextEntry
          returnKeyType="go"
          placeholder={password}
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password1 => this.setState({ password1 })}
          ref={input1 => (this.passwordInput = input1)}
        />
        <View style={styles.termsBox}>
          <Text style={styles.text}>{by_signing_up_you}</Text>
          <Text
            style={{ color: "#3bd774" }}
            onPress={() =>
              Linking.openURL("https://fields.one/privacy-policy/")
            }
          >
            {terms}
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.handleSignUp}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>{signup}</Text>
        </TouchableOpacity>
        {this.state.errorMessage && (
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        )}

        <View style={styles.indicatorContainer} />
        <Loader loading={this.state.loading} />
        <View style={styles.alreadyAccountCont}>
          <Text
            style={styles.text}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            {already_have_an_account}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    justifyContent: "flex-start",

    flex: 1
  },
  textInput: {
    height: 40,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold"
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

  logo: {
    width: 200,
    height: 200
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center"
  },

  text: {
    marginTop: 16,
    color: "#bcbcbc",
    textAlign: "center"
  },
  text2: {
    marginTop: 16,
    color: "#919191",
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center"
  },

  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold"
  },

  termsBox: {
    justifyContent: "center",
    alignItems: "center"
  },

  alreadyAccountCont: {
    flex: 1,
    justifyContent: "flex-end"
  },
  indicatorContainer: {
    alignItems: "center",
    justifyContent: "center"
  }
});
