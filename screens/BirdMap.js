import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';
import MapStyle from '../assets/MapStyle';
import { Ionicons } from '@expo/vector-icons';

const db = FirebaseWrapper.GetInstance();

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const defaultImage =
  'https://firebasestorage.googleapis.com/v0/b/bird-spot-d2dd5.appspot.com/o/birds%2F2d3f3240-bc51-11e9-b22f-c198db962aea.jpg?alt=media&token=3f149cc4-2e36-4f2b-bba8-370a5c30f710';

export default class BirdMap extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
    };
  }

  componentDidMount() {
    this.firestoreMarkers(this.gotMarkers);
    this.getLocation();
  }

  gotMarkers = async dbMarkers => {
    if (dbMarkers) {
      this.setState({ isLoading: false, markers: dbMarkers });
    }
  };

  getLocation = async () => {
    try {
      await navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      this.watchID = navigator.geolocation.watchPosition(position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  firestoreMarkers = async callback => {
    try {
      await db.SetupCollectionListener('Markers', callback);
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        customMapStyle={MapStyle}
        showsUserLocation={true}
        region={this.state.region}
        // onRegionChange={region => this.setState({ region })}
        // onRegionChangeComplete={region => this.setState({ region })}
      >
        {this.state.isLoading
          ? null
          : this.state.markers.map((marker, index) => {
              const coords = {
                latitude: marker.latitude,
                longitude: marker.longitude,
              };
              const user = ` ${marker.username}`;
              const details = marker.details;
              const title = marker.unknownSpecies
                ? 'Unknown Species'
                : marker.speciesName;

              const imageURL = marker.imageURL ? marker.imageURL : defaultImage;

              return (
                <MapView.Marker key={index} coordinate={coords}>
                  <Callout style={styles.callout}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={{ color: '#22b573' }}>
                      <Ionicons name="md-contact" size={20} color="#22b573" />
                      {user}
                    </Text>
                    {imageURL && (
                      <Image source={{ uri: imageURL }} style={styles.image} />
                    )}
                    <Text style={styles.details}>{details}</Text>
                  </Callout>
                </MapView.Marker>
              );
            })}
      </MapView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  callout: {
    width: 140,
  },
  image: {
    height: 120,
    width: 120,
  },
  title: {
    fontWeight: '700',
    color: '#22b573',
    fontSize: 16,
  },
  details: {
    fontStyle: 'italic',
    marginTop: 10,
  },
});
