import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { ButtonGroup, SearchBar, Alert } from "react-native-elements";
import firebase from "react-native-firebase";

import { SharedElement } from "react-native-motion";
import {
  field_city,
  field_name,
  near_me,
  set,
  enter_home_city,
  add_home_city_placeholder,
  search_fields_by_city,
  search_fields_by_name,
  search_fields_near
} from "../../strings/strings";
import FieldSearchItem from "FieldsReact/app/components/FieldSearchItem/FieldSearchItem"; // we'll create this next

export default class FieldSearchScreen extends Component {
  componentDidMount = () => {
    this.initialFetch();
  };
  static navigationOptions = {
    header: null
  };

  initialFetch = () => {
    if (this.state.selectedIndex === 0) {
      const ref = firebase.firestore().collection("Fields");
      var { params } = this.props.navigation.state;
      const fields = [];
      const homeAreaConst = this.state.homeAreaConst;

      const query = ref
        .where("fieldAreaLowerCase", "==", this.state.homeAreaConst)
        .limit(50);

      query.get().then(
        function(doc) {
          doc.forEach(doc => {
            const { fieldName, fieldArea } = doc.data();
            fields.push({
              key: doc.id,
              doc,
              fieldName,
              fieldArea
            });
          });
          this.setState({
            fields,
            search_placeholder: search_fields_near
          });
        }.bind(this)
      );
    }
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    var { params } = this.props.navigation.state;

    this.state = {
      selectedIndex: 0,
      fieldSearchTerm: "",
      fields: [],
      homeCityText: "",
      homeAreaConst: params.homeArea,
    };
    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }

  addHomeCity = () => {
    const homeCityText = this.state.homeCityText;
    if (homeCityText.length !== 0) {
      this.ref
        .update({
          homeArea: homeCityText.toLowerCase().trim()
        })
        .then(this.getHomeAreaAfterSetting());
    }
  };

  getHomeAreaAfterSetting = () => {
    var { params } = this.props.navigation.state;


    this.setState({
      homeAreaConst: this.state.homeCityText.toLowerCase().trim(),
      selectedIndex: 0,
    });
    this.updateIndex(this.state.selectedIndex);
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex }, () => {
      if (selectedIndex === 1) {
        this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_by_name });
      } else if (selectedIndex === 2) {
        this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_by_city });
      } else if (selectedIndex === 0) {
        this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_near });
      }
    });
  };

  searchFields = typedText => {
    this.setState({ fieldSearchTerm: typedText }, () => {
      const fields = [];
      const ref = firebase.firestore().collection("Fields");
      if (this.state.selectedIndex === 1) {
        const query = ref.where(
          "fieldNameLowerCase", //tolowercase,
          "==",
          this.state.fieldSearchTerm.toLowerCase().trim()
        );

        query.get().then(
          function(doc) {
            doc.forEach(doc => {
              const { fieldName, fieldArea } = doc.data();
              fields.push({
                key: doc.id,
                doc,
                fieldName,
                fieldArea
              });
            });
            this.setState({
              fields
            });
          }.bind(this)
        );
      } else if (this.state.selectedIndex === 2) {
        const query = ref.where(
          "fieldAreaLowerCase",
          "==",
          this.state.fieldSearchTerm.toLowerCase().trim()
        );

        query.get().then(
          function(doc) {
            doc.forEach(doc => {
              const { fieldName, fieldArea } = doc.data();
              fields.push({
                key: doc.id,
                doc,
                fieldName,
                fieldArea
              });
            });
            this.setState({
              fields
            });
          }.bind(this)
        );
      } else if (this.state.selectedIndex === 0) {
        var { params } = this.props.navigation.state;
        if (this.state.fieldSearchTerm.trim().length === 0) {
          const query = ref
            .where("fieldAreaLowerCase", "==", this.state.homeAreaConst)
            .limit(50);

          query.get().then(
            function(doc) {
              doc.forEach(doc => {
                const { fieldName, fieldArea } = doc.data();
                fields.push({
                  key: doc.id,
                  doc,
                  fieldName,
                  fieldArea
                });
              });
              this.setState({
                fields
              });
            }.bind(this)
          );
        }

        const query = ref
          .where("fieldAreaLowerCase", "==", this.state.homeAreaConst)
          .where(
            "fieldNameLowerCase",
            "==",
            this.state.fieldSearchTerm.toLowerCase().trim()
          );

        query.get().then(
          function(doc) {
            doc.forEach(doc => {
              const { fieldName, fieldArea } = doc.data();
              fields.push({
                key: doc.id,
                doc,
                fieldName,
                fieldArea
              });
            });
            this.setState({
              fields
            });
          }.bind(this)
        );
      }
    });
  };

  render() {
    var { params } = this.props.navigation.state;

    const buttons = [[near_me], [field_name], [field_city]];
    const { selectedIndex } = this.state;

    if (this.state.homeAreaConst == "" && selectedIndex == 0) {
      return (
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder={this.state.search_placeholder}
              onChangeText={this.searchFields}
              underlineColorAndroid="rgba(0,0,0,0)"
              value={this.state.fieldSearchTerm}
            />
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              buttonStyle={{ height: 40 }}
              selectedTextStyle={{ color: "#3bd774", fontWeight: "bold" }}
              textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
              innerBorderStyle={{ width: 0 }}
            />
          </View>
          <View style={styles.homeAddContainer}>
            <Text style={styles.blackText}>{enter_home_city}</Text>
            <TextInput
              style={styles.searchBar}
              placeholder={add_home_city_placeholder}
              onChangeText={homeCityText => this.setState({ homeCityText })}
            />
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.addHomeCity()}
            >
              <Text style={styles.buttonText}>{set}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ marginBottom: 50 }}
            data={this.state.fields}
            renderItem={({ item }) => <FieldSearchItem {...item} />}
          />
          <View style={styles.navigationContainer}>
          <View style={styles.navigationContainerIn}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("FeedScreen", {
                    homeCityAdded: this.state.home
                  })
                }
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
                onPress={() => this.props.navigation.navigate("ProfileScreen")}
              >
                <Image
                  style={styles.navigationImage}
                  source={require("FieldsReact/app/images/Profile/profile.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder={this.state.search_placeholder}
              onChangeText={this.searchFields}
              underlineColorAndroid="rgba(0,0,0,0)"
              value={this.state.fieldSearchTerm}
            />
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              buttonStyle={{ height: 40 }}
              selectedTextStyle={{ color: "#3bd774", fontWeight: "bold" }}
              textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
              innerBorderStyle={{ width: 0 }}
            />
          </View>
          <FlatList
            style={{ marginBottom: 50 }}
            data={this.state.fields}
            renderItem={({ item }) => <FieldSearchItem {...item} />}
          />
          <View style={styles.navigationContainer}>
            <View style={styles.navigationContainerIn}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("FeedScreen", {
                    homeCityAdded: this.state.home
                  })
                }
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
                onPress={() => this.props.navigation.navigate("ProfileScreen")}
              >
                <Image
                  style={styles.navigationImage}
                  source={require("FieldsReact/app/images/Profile/profile.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}
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
  }
});
