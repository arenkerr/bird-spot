import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as firebase from 'firebase';

export default class LogInScreen extends Component {
  constructor() {
    super();
    this.state = { email: '', password: '', errorMessage: null };
    this.handleLogIn.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
  }

  handleLogIn = async () => {
    try {
      const { email, password } = this.state;
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log('Logged in! :>');
      // this.props.navigation.navigate(user && 'HomeScreen');
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: error });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.getStartedText}>Log In</Text>
          {this.state.errorMessage && (
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          )}
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Button title="Log In" onPress={this.handleLogIn} />
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => this.props.navigation.navigate('SignUpScreen')}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 12,
    borderRadius: 8,
  },
});
