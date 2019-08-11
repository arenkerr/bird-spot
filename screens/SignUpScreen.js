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

export default class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = { email: '', password: '', errorMessage: null };
    this.handleSignUp.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
  }

  handleSignUp = async () => {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      console.log('Account created');
      // also create them in Users db?
      this.props.navigation.navigate(user ? 'HomeScreen' : 'SignUp');
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
          <Text style={styles.getStartedText}>Sign Up</Text>
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
          <Button title="Sign Up" onPress={this.handleSignUp} />
          <Button
            title="Already have an account? Login"
            onPress={() => this.props.navigation.navigate('LogInScreen')}
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
    padding: 8,
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 12,
    borderRadius: 8,
  },
});
