import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  ScrollView,
  AsyncStorage,
  Linking
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
  constructor(props) {
    super(props);
    firebase
      .analytics()
      .setCurrentScreen("FieldsPlusScreen", "FieldsPlusScreen");
    this.state = { subscription: [1, 2, 3] };
  }
  static navigationOptions = {
    header: null
  };
  async componentDidMount() {
    const itemSkus = Platform.select({
      ios: ["fields_plus"],
      android: ["fields_plus"]
    });
    try {
      await RNIap.initConnection();
      const subscription = await RNIap.getSubscriptions(itemSkus);
      this.setState({ subscription: subscription }, () => {
        console.warn(this.state.subscription);
      });
    } catch (err) {}
  }
  componentWillUnmount() {
    RNIap.clearProducts();

    RNIap.endConnection();
  }

  buy = () => {
    try {
      firebase.analytics().logEvent("buying_init");
      var currentRep = this.props.userData.re;
      var newRep = currentRep + 2000;
      RNIap.buyProductWithoutFinishTransaction("fields_plus")
        .then(() => {
          RNIap.finishTransaction();

          firebase.analytics().logEvent("bying_success");
          promise1 = firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              fP: true,
              re: newRep
            });

          promise2 = AsyncStorage.setItem("fP", "true");

          promise3 = this.props.getUserData();

          Promise.all([promise1, promise2, promise3]).then(() => {
            this.props.navigation.replace("PurchaseSuccessfulScreen");
          });
        })
        .catch(err => {
          console.warn(err);

          firebase.analytics().logEvent("buying_declined"); // resetting UI
        });
    } catch (error) {}
  };
  render() {
    const tapp = (
      <Text
        onPress={() => Linking.openURL("https://fields.one/privacy-policy/")}
        style={styles.textSmallBlue}
      >
        Terms and Privacy Policy
      </Text>
    );
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#333333" }}>
        <View style={styles.container}>
          <Image
            source={{ uri: "f_plus_logo" }}
            style={{ height: 200, width: 200, margin: 32 }}
            resizeMode={"contain"}
          />

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
            <Text style={styles.text}>
              {this.state.subscription[0].localizedPrice}/{I18n.t("month")},{" "}
              {I18n.t("try_one_month_free")}
            </Text>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={styles.textSmall}>
              A {this.state.subscription[0].localizedPrice} purchase will be
              applied to your iTunes account at the end of the trial or
              immediately if the trial has already been depleted. Subscription
              will automatically renew unless canceled at least 24-hours before
              the end of the current one month period. You can cancel anytime
              with your iTunes account settings. Any unused portion of a free
              trial will be forfeited if you purchase a subscription. For more
              information, see our {tapp}
            </Text>
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
  textSmall: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    color: "#c6c6c6",
    marginVertical: 16
  },
  textSmallBlue: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    color: "#3facff",
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
