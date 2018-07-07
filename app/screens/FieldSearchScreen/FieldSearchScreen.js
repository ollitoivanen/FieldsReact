import React, { Component } from "react";
import { StyleSheet, View, TextInput, FlatList } from "react-native";
import { ButtonGroup } from "react-native-elements";
import firebase from "react-native-firebase";

import BottomBarTraining from "FieldsReact/app/components/BottomBar/BottomBarTraining.js";

import { SharedElement } from "react-native-motion";
import {
  search_field,
  field_city,
  field_name,
  near_me
} from "../../strings/strings";
import FieldSearchItem from "FieldsReact/app/components/FieldSearchItem/FieldSearchItem"; // we'll create this next

export default class FieldSearchScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection("Fields");
    this.unsubscribe = null;
    this.state = {
      selectedIndex: 0,
      textInput: "",
      fields: []
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    const fields = [];

    querySnapshot.forEach(doc => {
      const { fieldName, fieldArea } = doc.data();
      fields.push({
        key: doc.id,
        doc, // DocumentSnapshot
        fieldName,
        fieldArea
      });
    });
    this.setState({
      fields
    });
  };

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }
  render() {
    const buttons = [[near_me], [field_name], [field_city]];
    const { selectedIndex } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder={search_field}
            underlineColorAndroid="rgba(0,0,0,0)"
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
        style={{marginBottom: 50}}
          data={this.state.fields}
          renderItem={({ item }) => <FieldSearchItem {...item} />}
        />
        <View style={styles.navigationContainer}>
          <SharedElement sourceId="source">
            <BottomBarTraining navigation={this.props.navigation} />
          </SharedElement>
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
  }
});
