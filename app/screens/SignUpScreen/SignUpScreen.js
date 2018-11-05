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
  ScrollView,
  AsyncStorage,
  Platform
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
  please_enter_username,
  welcome_to_fields,
  lets_see,
  football_fields,
  see_where,
  manage_your_team,
  set_team_events,
  earn_reputation,
  earn_reputation_by_training,
  sounds_awesome_right,
  lets_go,
  see_whos_coming_to_events
} from "../../strings/strings";
import firebase from "react-native-firebase";
import validator from "validator";
import { username } from "../../strings/strings";
import Loader from "FieldsReact/app/components/Loader/Loader.js";
import Swiper from "react-native-swiper";
import I18n from "FieldsReact/i18n";

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("SignUpScreen", "SignUpScreen");

    this.ref = firebase.firestore().collection("Users");
    this.getLaunch();
    this.state = {
      email1: "",
      password1: "",
      username1: "",
      errorMessage: null,
      loading: false,
      firstLaunch: null
    };
  }

  getLaunch = () => {
    AsyncStorage.getItem("firstLaunch", (err, result) => {
      if (err) {
      } else {
        if (result === null) {
          this.setState({ firstLaunch: true });
        } else {
          this.setState({ firstLaunch: false });
        }
      }
    });
    AsyncStorage.setItem(
      "firstLaunch",
      JSON.stringify({ firstLaunch: true }),
      (err, result) => {}
    );
  };

  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ username1: newText });
  };

  handleSignUp = () => {
    if (this.state.username1.length == 0) {
      this.setState({ errorMessage: [I18n.t("please_enter_username")] });
    } else if (!validator.isEmail(this.state.email1)) {
      this.setState({ errorMessage: [I18n.t("please_enter_valid_email")] });
    } else if (this.state.password1.length == 0) {
      this.setState({ errorMessage: [I18n.t("please_enter_password")] });
    } else if (this.state.password1.length < 7) {
      this.setState({ errorMessage: [I18n.t("please_enter_password")] });
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
            un: this.state.username1.toLowerCase()
          })
        )
        .then(() => {
          this.setState({ loading: false }),
            firebase.analytics().logEvent("sign_up_complete");
        })
        .then(() => this.props.navigation.navigate("LoadingScreen"))
        .catch(err => {
          this.setState({ errorMessage: err });
        });
    }
  };

  render() {
    const { username1 } = this.state;
    if (this.state.firstLaunch === null) {
      return null;
    } else {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={{ uri: "f_logo_white_bg" }} />
          </View>
          <View style={styles.paddingContainer}>
            <Text style={styles.text2}>{I18n.t("welcome")}</Text>
            <TextInput
              textContentType="username"
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={I18n.t("username")}
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
              placeholder={I18n.t("email")}
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
              placeholder={I18n.t("password")}
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={password1 => this.setState({ password1 })}
              ref={input1 => (this.passwordInput = input1)}
            />

            <View style={styles.termsBox}>
              <Text style={styles.text}>{I18n.t("by_signing_up_you")}</Text>
              <Text
                style={{ color: "#3bd774" }}
                onPress={() => {
                  Linking.openURL("https://fields.one/privacy-policy/"),
                    firebase.analytics().logEvent("terms_clicked");
                }}
              >
                {I18n.t("terms")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.handleSignUp}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>{I18n.t("signup")}</Text>
            </TouchableOpacity>
          </View>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}

          <View style={styles.indicatorContainer} />
          <Loader loading={this.state.loading} />
          <View style={styles.alreadyAccountCont}>
            <Text
              style={styles.text}
              onPress={() => {
                this.props.navigation.navigate("LoginScreen"),
                  firebase.analytics().logEvent("signup_to_login");
              }}
            >
              {I18n.t("already_have_an_account")}
            </Text>
          </View>

          <Modal visible={this.state.firstLaunch} onRequestClose={() => {}}>
            <Swiper
              showsButtons={false}
              loop={false}
              showsPagination={true}
              activeDotColor={"#646665"}
              dotColor={"#f4f4f4"}
            >
              <View style={styles.slide1}>
                <Text style={styles.headerTextBigGray}>
                  {I18n.t("this_is_awesome")}
                </Text>

                <Image
                  style={styles.logo}
                  source={{ uri: "welcome_slide_1" }}
                  resizeMode={"contain"}
                />
                <Text style={styles.headerTextGray}>{I18n.t("play_football")}</Text>
                <TouchableOpacity
                  style={styles.letsgoSmall}
                  onPress={() => {
                    this.setState({ firstLaunch: false }),
                      firebase.analytics().logEvent("introduction_complete");
                  }}
                >
                  <Text style={styles.headerTextWhite}>{I18n.t("lets_go")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.slide1}>
                <Text style={styles.headerTextBigBlue}>
                  {I18n.t("find_best_time")}
                </Text>

                <Image
                  style={styles.logo}
                  source={{ uri: "welcome_slide_3" }}
                  resizeMode={"contain"}
                />
                <Text style={styles.headerTextBlue}>
                  {I18n.t("find_best_time_2")}
                </Text>
                <TouchableOpacity
                  style={styles.letsgoSmall}
                  onPress={() => {
                    this.setState({ firstLaunch: false }),
                      firebase.analytics().logEvent("introduction_complete");
                  }}
                >
                  <Text style={styles.headerTextWhite}>{I18n.t("lets_go")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.slide1}>
                <Text style={styles.headerTextBigBlue}>
                  {I18n.t("manage_team")}
                </Text>

                <Image
                  style={styles.logo}
                  source={{ uri: "welcome_slide_2" }}
                  resizeMode={"contain"}
                />

                <Text style={styles.headerTextBlue}>{I18n.t("manage_team_2")}</Text>
                <TouchableOpacity
                  style={styles.letsgoSmall}
                  onPress={() => {
                    this.setState({ firstLaunch: false }),
                      firebase.analytics().logEvent("introduction_complete");
                  }}
                >
                  <Text style={styles.headerTextWhite}>{I18n.t("lets_go")}</Text>
                </TouchableOpacity>
              </View>
              
              
              <View style={styles.slide1}>
                <Text style={styles.headerTextBigGray}>
                  {I18n.t("sounds_awesome_right")}
                </Text>

                <Image
                  style={styles.logo}
                  source={{ uri: "f_logo_white_bg" }}
                />
                <TouchableOpacity
                  style={styles.letsgo}
                  onPress={() => {
                    this.setState({ firstLaunch: false }),
                      firebase.analytics().logEvent("introduction_complete");
                  }}
                >
                  <Text style={styles.headerTextBigWhite}>{I18n.t("lets_go")}</Text>
                </TouchableOpacity>
              </View>
            </Swiper>
          </Modal>
        </ScrollView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  paddingContainer: {
    padding: 20,
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
  letsgo: {
    ...Platform.select({
      ios: {
        backgroundColor: "#3bd774",
        padding: 2,
        marginTop: 20,
        borderRadius: 100,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10
      },
      android: {
        backgroundColor: "#3bd774",
        padding: 2,
        marginTop: 20,
        borderRadius: 100,
        elevation: 2
      }
    })
  },
  letsgoSmall: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        end: 16,
        bottom: 16,
        backgroundColor: "#3bd774",
        padding: 2,
        marginTop: 20,
        borderRadius: 100,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10
      },
      android: {
        position: 'absolute',
        end: 16,
        bottom: 16,
        backgroundColor: "#3bd774",
        padding: 2,
        marginTop: 20,
        borderRadius: 100,
        elevation: 2
      }
    })
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
    marginTop: 10,
    width: 300,
    height: 300 
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
    justifyContent: "flex-end",
    marginBottom: 20
  },
  indicatorContainer: {
    alignItems: "center",
    justifyContent: "center"
  },

  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3bd774"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3facff"
  },
  headerTextBigWhite: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    color: "white",
    margin: 20
  },
  headerTextWhite: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    color: "white",
    margin: 5
  },

  headerTextBigGray: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    color: "black",
    margin: 20
  },

  headerTextGray: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "black",
    margin: 20
  },

  

  headerTextBigBlue: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    color: "black",
    margin: 20
  },

  headerTextBlue: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "black",
    margin: 20
  }
});
