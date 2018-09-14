import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Modal,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import firebase from "react-native-firebase";
import I18n from "FieldsReact/i18n";
import Loader from "FieldsReact/app/components/Loader/Loader.js";

import {
  settings,
  log_out,
  edit_profile,
  support
} from "../../strings/strings";

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
class SettingsScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      infoVisible: false,
      deleteVisible: false,
      errorMessage: "",
      email1: "",
      password1: "",
      loading: false
    };
  }

  deleteAccount = () => {
    if (this.state.email1 === "" || this.state.password1 === "") {
      this.setState({ errorMessage: I18n.t("please_fill_all_fields") });
    } else {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.state.email1,
        this.state.password1
      );
      firebase
        .auth()
        .currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          this.setState({ deleteVisible: false, loading: true });
          if (this.props.userData.uTI !== undefined) {
            var promise1 = firebase
              .firestore()
              .collection("Teams")
              .doc(this.props.userData.uTI)
              .collection("TU")
              .doc(firebase.auth().currentUser.uid)
              .delete();
          }
          var promise2 = firebase
            .firestore()
            .collection("Friends")
            .where("aI", "==", firebase.auth().currentUser.uid)
            .get()
            .then(function(doc) {
              doc.forEach(doc => {
                doc.delete();
              });
            });

          var promise3 = firebase
            .firestore()
            .collection("Friends")
            .where("fI", "==", firebase.auth().currentUser.uid)
            .get()
            .then(function(doc) {
              doc.forEach(doc => {
                doc.delete();
              });
            });
          var promise4 = AsyncStorage.getItem("trainings").then(response => {
            if (response !== null) {
              AsyncStorage.removeItem("trainings");
              firebase
                .firestore()
                .collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .collection("TR")
                .get()
                .then(function(doc) {
                  doc.forEach(doc => {
                    doc.delete();
                  });
                });
            }
          });
          var promise5 = AsyncStorage.getItem("favoriteFields").then(
            response => {
              if (response !== null) {
                AsyncStorage.removeItem("favoriteFields");
                firebase
                  .firestore()
                  .collection("Users")
                  .doc(firebase.auth().currentUser.uid)
                  .collection("FF")
                  .get()
                  .then(function(doc) {
                    doc.forEach(doc => {
                      doc.delete();
                    });
                  });
              }
            }
          );

          var promise6 = AsyncStorage.getItem("teamPlayers").then(response => {
            if (response !== null) {
              AsyncStorage.removeItem("teamPlayers");
            }
          });
          var promise7 = AsyncStorage.getItem("friends").then(response => {
            if (response !== null) {
              AsyncStorage.removeItem("friends");
            }
          });

          var promise8 = AsyncStorage.getItem("nearTeams").then(response => {
            if (response !== null) {
              AsyncStorage.removeItem("nearTeams");
            }
          });
          var promise9 = AsyncStorage.getItem("nearFields").then(response => {
            if (response !== null) {
              AsyncStorage.removeItem("nearFields");
            }
          });

          var promise10 = firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .delete()
            .then(() => {
              firebase
                .auth()
                .currentUser.delete()
                .then(() => {});
            });
          Promise.all([
            promise1,
            promise2,
            promise3,
            promise4,
            promise5,
            promise6,
            promise7,
            promise8,
            promise9,
            promise10
          ]).then(() => {
            this.props.navigation.replace("LoadingScreen");
          });
        })
        .catch(error => {
          this.setState({
            errorMessage: I18n.t("email_and_password_dont_match_any_users")
          });
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{I18n.t("settings")}</Text>
        </View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate("EditProfileScreen")}
        >
          <Text style={styles.itemText}>{I18n.t("edit_profile")}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate("SupportScreen")}
        >
          <Text style={styles.itemText}>{I18n.t("support")}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.setState({ infoVisible: true })}
        >
          <Text style={styles.itemText}>{I18n.t("delete_account")}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {AsyncStorage.multiRemove(["friends", "trainings", "nearFields", "nearTeams", "teamPlayers"]), firebase.auth().signOut()}}
        >
          <Text style={styles.itemText}>{I18n.t("log_out")}</Text>

          <View style={styles.div} />
        </TouchableOpacity>
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
              this.setState({ infoVisible: true });
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.setState({ infoVisible: true });
              }}
            >
              <Text style={styles.text2}>
                {I18n.t("are_you_sure_to_delete_all_account_data")}
              </Text>
              <TouchableOpacity
                style={styles.buttonContainerRed}
                onPress={() =>
                  this.setState({ infoVisible: false, deleteVisible: true })
                }
              >
                <Text style={styles.deleteText}>{I18n.t("yes")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonContainerGreen}
                onPress={() => this.setState({ infoVisible: false })}
              >
                <Text style={styles.deleteText}>{I18n.t("nope")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal
          transparent={true}
          visible={this.state.deleteVisible}
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
            onPress={() => this.setState({ deleteVisible: false })}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 20
              }}
              onPress={() => {
                this.setState({ deleteVisible: false });
              }}
            >
              <Text style={styles.text2}>
                {I18n.t("enter_account_information_to_delete")}
              </Text>
              <TextInput
                underlineColorAndroid="rgba(0,0,0,0)"
                style={styles.textInput}
                autoCapitalize="none"
                placeholder={I18n.t("email")}
                returnKeyType="next"
                keyboardType="email-address"
                onChangeText={email1 => this.setState({ email1 })}
                value={this.state.email1}
                onSubmitEditing={() => this.passwordInput.focus()}
              />
              <TextInput
                underlineColorAndroid="rgba(0,0,0,0)"
                secureTextEntry
                style={styles.textInput}
                autoCapitalize="none"
                returnKeyType="go"
                placeholder={I18n.t("password")}
                onChangeText={password1 => this.setState({ password1 })}
                value={this.state.password1}
                ref={input1 => (this.passwordInput = input1)}
              />
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this.deleteAccount()}
              >
                <Text style={styles.buttonText}>
                  {I18n.t("delete_account")}
                </Text>
              </TouchableOpacity>
              <Text style={styles.error}>{this.state.errorMessage}</Text>

              <View style={styles.indicatorContainer} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Loader loading={this.state.loading} />
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  buttonContainer: {
    backgroundColor: "red",
    padding: 15,
    marginTop: 16,
    borderRadius: 10,
    alignItems: "center"
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

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  item: {
    width: "100%",
    backgroundColor: "white"
  },

  div: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  itemText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24
  },

  buttonContainerRed: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonContainerGreen: {
    backgroundColor: "#3bd774",
    marginTop: 16,
    padding: 25,
    borderRadius: 10,
    alignItems: "center"
  }
});
