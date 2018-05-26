import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-elements";

import Data from "./Data";
import Deck from "./src/Deck";

export default class App extends React.Component {
  renderCard = item => {
    // return <Text key={item.id}>{item.text}</Text>;
    return (
      <Card key={item.id} title={item.text} image={{ uri: item.uri }}>
        <Text style={{ marginBottom: 10 }}>
          I can customize the Card further.
        </Text>
        <Button
          icon={{ name: "code" }}
          backgroundColor="#03A9F4"
          title="View Now!"
        />
      </Card>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Deck data={Data} renderCard={this.renderCard} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
