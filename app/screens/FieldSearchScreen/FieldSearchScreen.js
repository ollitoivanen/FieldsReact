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
  search_fields_by_city,
  search_fields_by_name,
  search_fields_near,
  add_new_field
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
  componentWillMount = () => {
    this.unsubscribe = this.initialFetch();
  };

  componentWillUnmount() {
    this.unsubscribe();
    //Some problems with this
  }
  static navigationOptions = {
    header: null
  };

  initialFetch = () => {
    const ref = firebase.firestore().collection("Fields");
    var { params } = this.props.navigation.state;
    const fields = [];
    const homeAreaConst = this.state.homeAreaConst;
    var fieldImage

    const query = ref.where("fARL", "==", this.state.homeAreaConst).limit(50);

    query.get().then(
      function(doc) {
        doc.forEach(doc => {
          const id = doc.id;
          const {
            fN,
            fAR,
            fI,
            fNL,
            fARL,
            fT,
            gG,
            fAT,
            fA,
            pH,
            fIm
          } = doc.data();
          if (fIm === true) {
            fieldImage = true
                fields.push({
                  key: doc.id,
                  doc,
                  id,
                  fN,
                  fAR,
                  fI,
                  fNL,
                  fARL,
                  fT,
                  gG,
                  fAT,
                  fA,
                  pH,
                  fIm,
                  fieldImage
                });
                
          } else {
             fieldImage = false;
             fields.push({
              key: doc.id,
              doc,
              id,
              fN,
              fAR,
              fI,
              fNL,
              fARL,
              fT,
              gG,
              fAT,
              fA,
              pH,
              fIm,
              fieldImage
            });
          }
          this.setState({
            fields,
            search_placeholder: search_fields_near
          })
          
        });
       
      }.bind(this)
    );
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
      search_placeholder: search_fields_near,

      homeAreaConst: this.props.userData.hA
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
          hA: homeCityText.toLowerCase().trim()
        })
        .then(this.getHomeAreaAfterSetting());
    }
  };

  getHomeAreaAfterSetting = () => {
    this.props.getUserData();

    var { params } = this.props.navigation.state;

    this.setState({
      homeAreaConst: this.state.homeCityText.toLowerCase().trim(),
      selectedIndex: 0
    });
    this.updateIndex(this.state.selectedIndex);
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex }, () => {
      if (selectedIndex === 1) {
        this.unsubscribe = this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_by_name });
      } else if (selectedIndex === 2) {
        this.unsubscribe = this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_by_city });
      } else if (selectedIndex === 0) {
        this.unsubscribe = this.searchFields(this.state.fieldSearchTerm);
        this.setState({ search_placeholder: search_fields_near });
      }
    });
  };

  searchAfterSetState = () => {
    const fields = [];
    const ref = firebase.firestore().collection("Fields");
    if (this.state.selectedIndex === 1) {
      const query = ref.where(
        "fNL",
        "==",
        this.state.fieldSearchTerm.toLowerCase().trim()
      );
    } else if (this.state.selectedIndex === 2) {
      const query = ref.where(
        "fARL",
        "==",
        this.state.fieldSearchTerm.toLowerCase().trim()
      );
    } else if (this.state.selectedIndex === 0) {
      var { params } = this.props.navigation.state;
      if (this.state.fieldSearchTerm.trim().length === 0) {
        const query = ref
          .where("fARL", "==", this.state.homeAreaConst)
          .limit(50);
      } else {
        const query = ref
          .where("fARL", "==", this.state.homeAreaConst)

          .where("fNL", "==", this.state.fieldSearchTerm.toLowerCase().trim());
      }
    }
  };

  searchFields = typedText => {
    this.setState({ fieldSearchTerm: typedText }, this.searchAfterSetState);
  };

  render() {
    var { params } = this.props.navigation.state;

    homeCityAddInput = (
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
    );

    const buttons = [[near_me], [field_name_cap], [field_city_cap]];
    const { selectedIndex } = this.state;
    let input;

    if (this.state.homeAreaConst == "" && selectedIndex == 0) {
      input = homeCityAddInput;
    } else {
      input = null;
    }

    const openFieldDetail = item => {
      var { params } = this.props.navigation.state;

      if (params.fromEvent === false) {
        this.props.navigation.navigate("DetailFieldScreen", {
          fieldName: item.fN,
          fieldAreaLowerCase: item.fARL,
          fieldNameLowerCase: item.fNL,
          fieldArea: item.fAR,
          fieldID: item.id,
          fieldType: item.fT,
          goalCount: item.gG,
          accessType: item.fAT,
          fieldAddress: item.fA,
          peopleHere: item.pH,
          currentFieldID: this.props.userData.cFI,
          currentFieldName: this.props.userData.cFN,
          timestamp: this.props.userData.ts,
          trainingCount: this.props.userData.tC,
          reputation: this.props.userData.re
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
          <TextInput
            style={styles.searchBar}
            placeholder={this.state.search_placeholder}
            onChangeText={(this.unsubscribe = this.searchFields)}
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

          <TouchableOpacity
            style={styles.addNewFieldBox}
            onPress={() =>
              this.props.navigation.navigate("CreateNewFieldScreen")
            }
          >
            <Text style={styles.addNewFieldText}>{add_new_field}</Text>
          </TouchableOpacity>
        </View>
        {input}

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
    marginTop: 8,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  addNewFieldText: {
    color: "#3facff",
    fontWeight: "bold",
    textAlign: "center"
  }
});
