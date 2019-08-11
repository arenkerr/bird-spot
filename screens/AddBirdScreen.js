import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  Alert,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';

const db = FirebaseWrapper.GetInstance();

export default class BirdMap extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      isLoading: true,
      latitude: null,
      longitude: null,
      speciesName: '',
      unknownSpecies: false,
      details: '',
    };
    this.getLocation.bind(this);
    this.userOnState.bind(this);
  }

  componentDidMount() {
    this.getLocation();
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

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.setState({
          isLoading: false,
          latitude,
          longitude,
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  handleSubmit() {
    try {
      if (this.state.latitude && this.state.longitude) {
        const username = this.state.currentUser.email.split('@')[0];

        const newMarker = {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          speciesName: this.state.speciesName,
          unknownSpecies: this.state.unknownSpecies,
          details: this.state.details,
          username: username,
        };
        const submitted = db.CreateNewDocument('/Markers', newMarker);
      } else {
        Alert.alert('Please wait while BirdSpot gets your location');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  render() {
    const user = this.state.currentUser;

    return (
      <ScrollView>
        {this.state.isLoading ? (
          <Text>Loading Location</Text>
        ) : (
          <View>
            {user && <Text style={styles.heading}>Add a Bird</Text>}
            <Switch
              style={styles.switch}
              onValueChange={() => this.setState({ unknownSpecies: true })}
              value={this.state.unknownSpecies}
            />
            {!this.state.unknownSpecies && (
              <TextInput
                placeholder="Species"
                style={styles.textInput}
                onChangeText={speciesName => this.setState({ speciesName })}
              />
            )}
            <TextInput
              placeholder="Details: Where was the bird? What was it doing?"
              style={styles.textInput}
              onChangeText={details => this.setState({ details })}
            />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.handleSubmit()}
            >
              <Text style={styles.btnTxt}>Add Bird</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    padding: 8,
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 12,
    borderRadius: 8,
  },
  switch: {
    margin: 12,
    backgroundColor: '#000000',
  },
  btn: {
    margin: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8,
    backgroundColor: '#22b573',
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
  },
  heading: {
    color: '#22b573',
    fontSize: 36,
    margin: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
});
