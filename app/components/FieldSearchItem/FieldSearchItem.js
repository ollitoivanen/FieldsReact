import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import firebase from "react-native-firebase";

export default class FieldSearchitem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  constructor(props) {
    super(props);
    this.state = {
      fieldImagePath: null
    };
    if (this.props.fIm === true) {
      this.getImage();
    }
  }

  getImage = () => {
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    storageRef
      .child("fieldpics/" + this.props.id + "/" + this.props.id + ".jpg")
      .getDownloadURL()
      .then(downloadedFile => {
        var fieldImagePath = downloadedFile;
        this.setState({ fieldImagePath: { uri: fieldImagePath } });
      })
      .catch(err => {});
  };

  render() {
    var fieldImagePath;
    var fieldImage;
    if (this.state.fieldImagePath === null) {
      var fieldImagePath = (
        <Image
          style={styles.fieldImage}
          source={{ uri: "field_image_default" }}
          resizeMode="cover"
        />
      );
    } else {
      var fieldImagePath = (
        <FastImage
          style={styles.fieldImage}
          source={this.state.fieldImagePath}
          resizeMode="cover"
        />
      );
    }
    return (
      <View style={styles.item}>
        {fieldImagePath}
        <View>
          <Text style={styles.text}>{this.props.fN}</Text>
          <Text style={styles.distanceText}>{this.props.d}</Text>
        </View>
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
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    marginStart: 8,
    margin: 4,
    marginTop: 8,
    color: "black"
  },

  distanceText: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    marginStart: 8,
    marginBottom: 8
  },

  fieldImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginStart: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    margin: 5
  }
});
