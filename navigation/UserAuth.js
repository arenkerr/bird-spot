import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Text } from 'react-native';

export default class UserAuth extends Component {
  componentDidMount() {
    const { navigate } = this.props.navigation;
    firebase.auth().onAuthStateChanged(user => {
      navigate(user ? 'HomeScreen' : 'SignUpScreen');
    });
  }

  render() {
    return <Text>Hi</Text>;
  }
}
