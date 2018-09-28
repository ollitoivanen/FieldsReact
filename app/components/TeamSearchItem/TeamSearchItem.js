import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import firebase from "react-native-firebase";
export default class TeamSearchitem extends React.PureComponent {
  // toggle a todo as completed or not via update()
  constructor(props) {
    super(props);

    this.state = {
      profileImagePath: require("FieldsReact/app/images/TeamImageDefault/team_image_default.png")
    };
    this.getTeamImage();
  }

  getTeamImage = () => {
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child("teampics/" + this.props.id + "/" + this.props.id + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        //Room for improvement
        var fieldImagePath = downloadedFile;
        this.setState({ profileImagePath: { uri: fieldImagePath } });
      })
      .catch(err => {});
  };

  render() {
    return (
      <View style={styles.item}>
        <FastImage
          style={styles.fieldImage}
          source={this.state.profileImagePath}
          resizeMode="cover"
        />
        <Text style={styles.text} >
          {this.props.username}
        </Text>
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
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  text: {
    fontWeight: "bold",
    marginStart: 8,
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap"
  },

  fieldImage: {
    width: 50,
    height: 50,

    marginStart: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    margin: 5,
    borderRadius: 25
  }
});
