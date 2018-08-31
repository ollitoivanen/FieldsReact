import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Geolocation
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { get_field_location, done } from "../../strings/strings";

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      coordinates: { latitude: 17.78825, longitude: -122.4324 },
      markerSet: false,
      latitudeDelta: 10000,
      longitudeDelta: 10000
    };
  }
  componentDidMount() {
    /*if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!granted) {
        return;
      }
    }*/
    
    navigator.geolocation.getCurrentPosition(
      
      position => {
        this.setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          error: null,
          markerSet: true
        });
      },
      error => this.setState({ error: error.message }), 
    );
  }

goBack = () =>{
  var { params } = this.props.navigation.state;

  if(params.fromEdit === true){
    this.props.navigation.navigate("DetailFieldScreen", {editVisible: true})
  }else{
    this.props.navigation.goBack()
  }
}

  setMarker = coordinates => {
    this.setState({
      coordinates: coordinates,
      markerSet: true,
      latitudeDelta: 0.0922,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      longitudeDelta: 0.0421
    });
  };

  render() {
    if (this.state.markerSet === true) {
      var doneButton = (
        <TouchableOpacity
          style={styles.doneBox}
          onPress={() =>
            this.props.navigation.navigate("CreateNewFieldScreen", {
              lt: this.state.latitude,
              ln: this.state.longitude
            })
          }
        >
          <Text style={styles.doneText}>{done}</Text>
        </TouchableOpacity>
      );
    } else {
      var doneButton = (
        <TouchableOpacity style={styles.notDoneBox}>
          <Text style={styles.notDoneText}>{done}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.goBack()}
          >
            <Image
              style={styles.backButton}
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.teamName}>{get_field_location}</Text>
        </View>
        <View style={styles.mapBox}>
          <MapView
            style={styles.map}
            onPress={event => this.setMarker(event.nativeEvent.coordinate)}
            showsPointsOfInterest={false}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta
            }}
          >
            <Marker coordinate={this.state.coordinates} />
          </MapView>
        </View>
        {doneButton}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  mapBox: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#e0e0e0"
  },

  map: {
    flex: 1
  },

  backButtonContainer: {
    flexDirection: "row",
    paddingTop: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },
  doneBox: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#e0e0e0"
  },
  notDoneBox: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#e0e0e0"
  },

  doneText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3bd774"
  },

  notDoneText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "red"
  }
});
