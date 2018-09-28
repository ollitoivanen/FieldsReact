import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { event_type_array } from "../../strings/strings";
import I18n from "FieldsReact/i18n";

export default class EventListItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    if (this.props.eFI !== undefined) {
      var eventField = ", " + this.props.eFN;
    } else {
      var eventField = null;
    }

    return (
      <View style={styles.cont}>
        <View style={styles.item}>
          <Text style={styles.bigDateText} >
            {this.props.date}
          </Text>

          <Text style={styles.timeText} >
            {this.props.startTime + "-" + this.props.eT}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.trainingText} >
            {I18n.t(['event_type_array', this.props.eTY]) + [eventField]}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cont: {
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    marginTop: 8,
    marginHorizontal: 8
  },

  item: {
    flexDirection: "row"
  },

  trainingText: {
    flexWrap: "wrap",
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginStart: 16,
    marginBottom: 16
  },

  bigDateText: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    margin: 16
  },

  timeText: {
    fontSize: 20,

    margin: 16
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
