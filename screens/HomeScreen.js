import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import UserBirds from './UserBirds';

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = { currentUser: null, username: '' };
    this.userOnState.bind(this);
    this.setState.bind(this);
  }

  componentDidMount() {
    this.userOnState();
  }

  handleButton = () => {
    this.setState({ myBirds: true });
  };

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
          <View style={styles.topHome}>
            {user && (
              <Text style={styles.heading}>
                Welcome, {user.email.split('@')[0]}
              </Text>
            )}
            <TouchableOpacity style={styles.btn} onPress={this.handleButton}>
              <Text style={styles.btnTxt}>My Birds</Text>
            </TouchableOpacity>
          </View>
          {this.state.myBirds && <UserBirds user={user} />}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22b573',
    width: '100%',
    height: '100%',
  },
  topHome: {
    backgroundColor: '#22b573',
    width: '100%',
    padding: 60,
  },
  contentContainer: {
    paddingTop: 30,
  },
  heading: {
    color: '#fff',
    fontSize: 38,
    margin: 10,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'codec',
  },
  btn: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#2b8e5f',
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
