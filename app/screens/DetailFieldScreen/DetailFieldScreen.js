import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

export default class DetailFieldsScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;
    this.state = {
      fieldName: params.fieldName
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.greenBackground}>
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
          <Text style={styles.fieldName}>{this.state.fieldName} </Text>

        </View>
         
          <View style={styles.greenRowContainer}>
            <Image
              style={styles.fieldImage}
              source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
              borderRadius={35}
              resizeMode="cover"
            />

             <View >
            <TouchableOpacity style={styles.peopleHereButton}>
              <Text style={styles.boxTextBlack}>0 people here</Text>
            </TouchableOpacity>
           
          </View>
          </View>

           <TouchableOpacity style={styles.startTrainingButton}>
              <Text style={styles.boxTextBlue}>Start Training Here</Text>
            </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.infoIcon}
              source={require("FieldsReact/app/images/Info/info.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10
  },

  fieldImage: {
    width: 70,
    height: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 5,
    padding: 5,
    borderColor: "white",
    marginTop: 10
  },

  fieldName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: 'center',
    marginStart: 12
  },

  greenRowContainer: {
    flexDirection: "row",
    alignItems: 'center'
  },

  backButton: {
    height: 48,
    width: 48,
    alignSelf: 'center'
  },

  startTrainingButton: {
   
    alignSelf: "flex-start",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,

    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 20,
    marginStart: 8
  },

  peopleHereButton: {
    alignSelf: "center",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 6,
    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginStart: 18
  },

  boxTextBlack: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2b2b2b"
  },

  boxTextBlue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#3facff"
  },

  infoContainer: {
    position: 'absolute',
    bottom: 18,
    end: 12,
    height: 36,
    width: 36
  },

  infoIcon: {
    height: 36,
    width: 36
  }
});
