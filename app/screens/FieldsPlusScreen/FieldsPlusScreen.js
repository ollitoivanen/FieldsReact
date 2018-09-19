import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  ScrollView,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";

import * as RNIap from "react-native-iap";
import I18n from "FieldsReact/i18n";
import firebase from "react-native-firebase";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class FieldsPlusScreen extends Component {
  constructor(props){
    super(props);
    firebase.analytics().setCurrentScreen("FieldsPlusScreen", "FieldsPlusScreen");

  }
  static navigationOptions = {
    header: null
  };
  async componentWillMount() {
    const itemSkus = Platform.select({
      ios: [],
      android: ["fields_plus"]
    });
    try {
      const result = await RNIap.initConnection();
      const products = await RNIap.getSubscriptions(itemSkus);
      this.setState({ products });
    } catch (err) {}
  }
  componentWillUnmount() {
    RNIap.endConnection();
  }

  buy = () => {
    firebase.analytics().logEvent("buying_init")
    var currentRep = this.props.userData.re;
    var newRep = currentRep + 2000;
    RNIap.buySubscription("fields_plus")
      .then(purchase => {
        firebase
                  .analytics()
                  .logEvent("bying_success")
        promise1 = firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            fP: true,
            re: newRep
          });



        promise2 = AsyncStorage.setItem("fP", "true");

        promise3 = this.props.getUserData()

        Promise.all([promise1, promise2, promise3]).then(() => {
          this.props.navigation.replace("PurchaseSuccessfulScreen");
        });

        RNIap.getAvailablePurchases;
      })
      .catch(err => {
        firebase.analytics().logEvent("buying_declined")        // resetting UI
      });
  };
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#333333" }}>
        <View style={styles.container}>
          <Image
            source={{ uri: "f_plus_logo" }}
            style={{ height: 200, width: 200, margin: 32 }}
            resizeMode={"contain"}
          />
          <Text style={styles.textBig}>{I18n.t("unlock_full_potential")}</Text>

          <View
            style={{
              padding: 20,
              borderRadius: 10,
              borderColor: "#848484",
              borderWidth: 3,
              margin: 16
            }}
          >
            <Text style={styles.textBlue}>{I18n.t("fields_plus_unlocks")}</Text>
            <Text style={styles.text}>{I18n.t("training_history")}</Text>
            <Text style={styles.text}>{I18n.t("favorite_fields")}</Text>
          </View>

          <TouchableOpacity
            style={{
              padding: 30,
              elevation: 3,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              backgroundColor: "#3facff",
              marginTop: 16,
              marginBottom: 16,

              marginHorizontal: 16,
              borderRadius: 50,
              justifyContent: "center"
            }}
            onPress={() => this.buy()}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18
              }}
            >
              {I18n.t("try_it_out")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldsPlusScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
    alignItems: "center"
  },

  textBlue: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#3facff",
    marginVertical: 16
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#c6c6c6",
    marginVertical: 16
  },
  textBig: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#c6c6c6",
    marginVertical: 16
  }
});
