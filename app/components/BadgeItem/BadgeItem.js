import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import I18n from "FieldsReact/i18n";

export default class BadgeItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    if (this.props.unlocked === true) {
      var status = (
        <Text style={styles.textGreen} >
          {I18n.t("unlocked")}
        </Text>
      );
    } else {
      var status = (
        <Text style={styles.textRed} >
          {I18n.t("locked")}
        </Text>
      );
    }
    return (
      <View style={styles.item}>
        <View style={styles.borderLocked}>
          <TouchableOpacity
            style={{
              elevation: 3,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 1
            }}
          >
            <Image
              source={{ uri: this.props.uri }}
              style={{ height: 50, width: 50, margin: 20 }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.textGray} >
              {I18n.t("required_reputation") + " " + this.props.rep}
            </Text>
            {status}
          </View>
        </View>
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

  borderLocked: {
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#ededed",
    marginVertical: 15,
    alignSelf: "center",
    flexDirection: "row",
    marginHorizontal: 16,
    alignItems: "center"
  },
  borderUnlocked: {
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#3bd774",
    marginTop: 30,
    padding: 20,
    alignSelf: "center"
  },

  textGray: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    margin: 15,
    flexWrap: "wrap"
  },
  textRed: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    color: "red",
    margin: 15,
    flexWrap: "wrap"
  },
  textGreen: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    margin: 15,
    color: "#3bd774",
    flexWrap: "wrap"
  },

  fieldImage: {
    width: 50,
    height: 50,

    marginStart: 8,
    borderWidth: 5,
    borderColor: "white",
    margin: 5
  }
});
