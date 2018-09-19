import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import {
  edit_profile,
  username,
  full_name,
  save,
  please_fill_all_fields
} from "../../strings/strings";
import firebase from "react-native-firebase";
import FastImage from "react-native-fast-image";
var ImagePicker = require("react-native-image-picker");
import ImageResizer from "react-native-image-resizer";
import I18n from "FieldsReact/i18n";

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

class EditProfileScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("EditProfileScreen", "EditProfileScreen");

    if (this.props.userData.uIm === true) {
      this.getProfileImage();
    }
    this.state = {
      username: this.props.userData.un,
      profileImage: null,
      profileImageInitial: null,
      errorMessage: ""
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
          profileImage: source,
          profileImageInitial: source
        });
      }
    });
  };
  getProfileImage = () => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child(
        "profilepics/" +
          firebase.auth().currentUser.uid +
          "/" +
          firebase.auth().currentUser.uid +
          ".jpg"
      )
      .getDownloadURL()
      .then(downloadedFile => {
        this.setState({ profileImage: downloadedFile.toString() });
      })
      .catch(err => {});
  };

  usernameHandle = value => {
    const newText = value.replace(/\s/g, "");
    this.setState({ username: newText });
  };

  saveProfile = () => {
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    let imagePath = this.state.profileImage;
    let clearPath = this.state.profileImageInitial;

    if (this.state.username !== "") {
      if (clearPath !== null) {
        ImageResizer.createResizedImage(imagePath, 200, 200, "JPEG", 100).then(
          ({ uri }) => {
            var { params } = this.props.navigation.state;

            storageRef
              .child(
                "profilepics/" +
                  firebase.auth().currentUser.uid +
                  "/" +
                  firebase.auth().currentUser.uid +
                  ".jpg"
              )
              .putFile(uri);
          }
        );
      }
      if (this.state.username === this.props.userData.un) {
        if (clearPath !== null && this.props.userData.uIm === false) {
          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              uIm: true
            })
            .then(() => {
              this.props.getUserData();
            })
            .then(() => {
              this.props.navigation.goBack();
            });
        } else {
          this.props.navigation.goBack();
        }
      } else if (
        this.state.username !== this.props.userData.un &&
        clearPath !== null &&
        this.props.userData.uIm === false
      ) {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            un: this.state.username.toLowerCase().trim(),
            uIm: true
          })
          .then(() => {
            this.props.getUserData();
          })
          .then(() => {
            this.props.navigation.goBack();
          });
      } else if (
        this.state.username !== this.props.userData.un &&
        clearPath === null
      ) {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            un: this.state.username.toLowerCase().trim()
          })
          .then(() => {
            this.props.getUserData();
          })
          .then(() => {
            this.props.navigation.goBack();
          });
      }
    } else {
      this.setState({ errorMessage: I18n.t('please_fill_all_fields') });
    }
  };
  render() {
    if (this.state.profileImage === null) {
      var profileImage = (
        <FastImage
          style={styles.profileImage}
          source={require("FieldsReact/app/images/ProfileImageDefault/profile_image_default.png")}
          resizeMode="cover"
        />
      );
    } else {
      var profileImage = (
        <FastImage
          style={styles.profileImage}
          source={{ uri: this.state.profileImage }}
          resizeMode="cover"
        />
      );
    }

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
          <Text style={styles.teamName}>{I18n.t("edit_profile")}</Text>
        </View>
        <TouchableOpacity
          style={styles.imageTabContainer}
          onPress={() => this.showPicker()}
        >
          {profileImage}
        </TouchableOpacity>

        <Text style={styles.headerText}>{I18n.t("username")}</Text>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={I18n.t('username')}
          value={this.state.username}
          onChangeText={this.usernameHandle}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.saveProfile()}
        >
          <Text style={styles.buttonText}>{I18n.t("save")}</Text>
        </TouchableOpacity>
        <Text style={styles.error}>{this.state.errorMessage}</Text>
      </View>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 10
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
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
  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: 5,
    borderRadius: 40,
    borderColor: "#e0e0e0",
    marginTop: 16
  },

  imageTabContainer: {
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    marginStart: 8
  }
});
