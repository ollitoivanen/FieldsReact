import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Geolocation
} from "react-native";
import firebase from "react-native-firebase";
import { ButtonGroup } from "react-native-elements";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  field_city_cap,
  field_name_cap,
  near_me,
  set,
  enter_home_city,
  add_home_city_placeholder,
  search_fields_near,
  add_new_field,
  start_training
} from "../../strings/strings";
import FieldSearchItem from "FieldsReact/app/components/FieldSearchItem/FieldSearchItem"; // we'll create this next

const mapStateToProps = state => {
  return {
    userData: state.userData,
    userHomeArea: state.userHomeArea
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class FieldSearchScreen extends Component {
  componentWillMount = () => {};

  componentWillUnmount() {
    //Some problems with this
  }
  static navigationOptions = {
    header: null
  };

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,

          error: null
        }),
          //, this.getDistanceFromLatLonInKm()
          this.initialFetch();
      },
      error => this.setState({ error: error.message })
    );
  };

  getDistanceFromLatLonInKm = (lat, lng) => {
    deg2rad = deg => {
      return deg * (Math.PI / 180);
    };

    var { params } = this.props.navigation.state;

    var lat1 = lat;
    var lon1 = lng;

    var lat2 = this.state.userLatitude;
    var lon2 = this.state.userLongitude;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = Math.round(R * c * 10) / 10 + " km"; // Distance in km
    return d;

    //console.warn(d)
  };

  initialFetch = () => {
    const ref = firebase.firestore().collection("Fields");
    var { params } = this.props.navigation.state;
    const fields = [];
    const homeAreaConst = this.state.homeAreaConst;
    var fieldImage;

    const southWest = new firebase.firestore.GeoPoint(
      Math.round(this.state.userLatitude) - 1,
      Math.round(this.state.userLongitude) - 1
    );
    const northEast = new firebase.firestore.GeoPoint(
      Math.round(this.state.userLatitude) + 1,
      Math.round(this.state.userLatitude) + 1
    );

    //Having a query distance of 50km
    const query = ref
      .where("co", ">=", southWest)
      .where("co", "<=", northEast)
      .limit(10);

    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const id = doc.id;
          const {
            fN,
            fI,
            fT,
            gC,
            fAT,
            pH,
            fIm,
            lt,
            ln
          } = doc.data();
          var d = this.getDistanceFromLatLonInKm(lt, ln);
          if (fIm === true) {
            fields.push({
              key: doc.id,
              doc,
              id,
              fN,
              fI,
           
              fT,
              gC,
              fAT,
              pH,
              fIm,
              lt,
              ln,
              d
            });
          } else {
            fields.push({
              key: doc.id,
              doc,
              id,
              fN,
              fI,
           
              fT,
              gC,
              fAT,
              pH,
              fIm,
              lt,
              ln,
              d
            });
          }
          //Sorting the results! cool 2018
          fields.sort((a, b) => parseFloat(a.d) - parseFloat(b.d));
          this.setState({
            fields,
            search_placeholder: search_fields_near
          });
        });
      }.bind(this)
    );
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.state = {
      fields: [],
      userLatitude: 0,
      userLongitude: 0
    };

    this.getLocation();
    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }

 

 

  render() {
    var { params } = this.props.navigation.state;

    const openFieldDetail = item => {
      var { params } = this.props.navigation.state;

      if (params.fromEvent === false) {
        this.props.navigation.navigate("DetailFieldScreen", {
          fieldName: item.fN,
          fieldID: item.id,
          fieldType: item.fT,
          goalCount: item.gC,
          accessType: item.fAT,
          peopleHere: item.pH,
          currentFieldID: this.props.userData.cFI,
          currentFieldName: this.props.userData.cFN,
          timestamp: this.props.userData.ts,
          trainingCount: this.props.userData.tC,
          reputation: this.props.userData.re,
          fIm: item.fIm,
          lt: item.lt,
          ln: item.ln,
          d: item.d,
        });
      } else {
        this.props.navigation.navigate("CreateEventScreen", {
          fieldName: item.fN,
          fieldID: item.id
        });

        //Add field data here next. things are going great!
      }
    };

    if (params.fromEvent !== true) {
      var navigation = (
        <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FeedScreen", {})}
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Home/home.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationItemBlue}>
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Field/field_icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItem}
              onPress={() =>
                this.props.navigation.navigate("ProfileScreen", {})
              }
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Profile/profile.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      var navigation = null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
         <Text style={styles.bigText}>{start_training}</Text>
          <TouchableOpacity
            style={styles.addNewFieldBox}
            onPress={() =>
              this.props.navigation.navigate("CreateNewFieldScreen", {
                lt: null,
                ln: null
              })
            }
          >
            <Text style={styles.addNewFieldText}>{add_new_field}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginBottom: 50 }}
          data={this.state.fields}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => openFieldDetail(item)}
            >
              <FieldSearchItem {...item} />
            </TouchableOpacity>
          )}
        />
        {navigation}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldSearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1
  },

  searchBar: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0",
    margin: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
    marginStart: 10,
    marginEnd: 10,
    fontWeight: "bold",
    height: 60,
    fontSize: 20
  },

  searchContainer: {
    backgroundColor: "#3bd774",
    paddingVertical: 10
  },

  filter: {
    fontWeight: "bold",
    backgroundColor: "red"
  },

  addHomeCityCard: {
    bottom: 100,
    position: "absolute",
    width: "100%",
    flex: 1
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10,
    marginHorizontal: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },

  blackText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#8e8e8e",
    marginTop: 24
  },
  homeAddContainer: {
    padding: 20
  },

  navigationContainerIn: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-end"
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4fff8",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemBlue: {
    flex: 1,
    height: 50,
    backgroundColor: "#3facff",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  },

  item: {
    width: "100%"
  },

  addNewFieldBox: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 0,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  addNewFieldText: {
    color: "#3facff",
    fontWeight: "bold",
    textAlign: "center"
  },
  bigText:{
    color:'black',
    margin: 24,
    fontSize: 22,
    fontWeight: 'bold'
  }
});
