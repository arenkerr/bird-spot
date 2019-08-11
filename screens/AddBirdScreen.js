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
  Image,
} from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import uuidv1 from 'uuid/v1';

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
      image: null,
      uploading: false,
      imageURL: '',
    };
    this.getLocation.bind(this);
    this.userOnState.bind(this);
    this.getPermissionAsync.bind(this);
  }

  componentDidMount() {
    this.getLocation();
    this.userOnState();
    this.getPermissionAsync();
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
          imageURL: this.state.imageURL,
        };
        const submitted = db.CreateNewDocument('/Markers', newMarker);
        submitted ? Alert.alert('Submitted!') : Alert.alert('Try again :>');
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
          <View style={styles.loadingLocation}>
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.heading}>Add a Bird</Text>
            <TouchableOpacity style={styles.btn} onPress={this._pickImage}>
              <View>
                <Text style={styles.btnTxt}>Select Photo</Text>
              </View>
            </TouchableOpacity>
            {/** Display selected image */}
            {this.state.image && (
              <View>
                <Image
                  source={{ uri: this.state.image }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleUpload}
                >
                  <View>
                    <Text style={styles.btnTxt}>Upload Photo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  handleUpload = async () => {
    const ext = this.state.image.split('.').pop(); // Extract image extension
    const imageName = `${uuidv1()}.${ext}`; // Generate unique name
    const uploaded = await this.uploadImage(this.state.image, imageName);
    if (uploaded) {
      try {
        const storage = await firebase.storage().ref();
        const ref = await storage.child(`birds/${imageName}`);
        const imageURL = await ref.getDownloadURL();
        this.setState({ imageURL });
        console.log(this.state.imageURL);
      } catch (error) {
        console.log('Something went wrong :>', error);
      }
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('birds/' + imageName);
    return ref.put(blob);
  };
}

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

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
  loadingLocation: {
    backgroundColor: '#22b573',
    color: '#fff',
    position: 'absolute',
    width,
    height,
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 200,
  },
  image: {
    margin: 12,
    alignItems: 'center',
    width: 200,
    height: 200,
  },
});
