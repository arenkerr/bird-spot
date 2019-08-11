import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import * as firebase from 'firebase';

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = { currentUser: null };
    this.userOnState.bind(this);
  }

  componentDidMount() {
    this.userOnState();
  }

  userOnState = async () => {
    try {
      const { currentUser } = await firebase.auth();
      this.setState({ currentUser });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const user = this.state.currentUser;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.container}>
            {user && (
              <Text style={styles.heading}>
                Welcome, {user.email.split('@')[0]}
              </Text>
            )}

            <Button title="Log Out" onPress={this.handleLogIn} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

// HomeScreen.navigationOptions = {
//   header: null,
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 30,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  heading: {
    color: '#22b573',
    fontSize: 32,
    margin: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
});
