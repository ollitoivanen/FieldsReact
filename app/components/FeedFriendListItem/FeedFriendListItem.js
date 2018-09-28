import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import firebase from "react-native-firebase";

export default class FeedFriendListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      profileImagePath: require("FieldsReact/app/images/ProfileImageDefault/profile_image_default.png")
    };
    if (this.props.uIm === true) {
      this.getImage();
    }
  }
  getImage = () => {
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child("profilepics/" + this.props.id + "/" + this.props.id + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        var fieldImagePath = downloadedFile;
        this.setState({ profileImagePath: { uri: fieldImagePath } });
      })
      .catch(err => {});
  };

  render() {
    if (this.props.trainingTime !== undefined) {
      var trainingTime = (
        <Text style={styles.fieldText}>
          {this.props.cFN + ", " + this.props.trainingTime}
        </Text>
      );
    } else {
      var trainingTime = <Text style={styles.fieldText}>{this.props.cFN}</Text>;
    }
    return (
      <View>
        <View style={styles.item}>
          <FastImage
            style={styles.fieldImage}
            source={this.state.profileImagePath}
            resizeMode="cover"
          />
          <Text style={styles.text} >
            {this.props.fN}
          </Text>
        </View>
        {trainingTime}
        <View style={styles.div} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center"
  },

  div: {
    height: 3,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    marginStart: 12,
    flexWrap: "wrap",
    color: "black"
  },

  fieldImage: {
    width: 50,
    height: 50,
    marginTop: 22,
    marginStart: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    margin: 5,
    borderRadius: 25
  },

  fieldText: {
    marginStart: 16,
    marginTop: 3,
    marginBottom: 22,
    fontSize: 18,
    fontWeight: "500"
  }
});
