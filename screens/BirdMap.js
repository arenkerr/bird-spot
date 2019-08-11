import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';
import MapStyle from '../assets/MapStyle';

const db = FirebaseWrapper.GetInstance();

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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

  gotMarkers = dbMarkers => {
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
              const details = `Spotted by: ${marker.username}\n${
                marker.details
              }`;

              return (
                <MapView.Marker
                  key={index}
                  coordinate={coords}
                  title={
                    marker.unknownSpecies
                      ? 'Unknown Species'
                      : marker.speciesName
                  }
                  description={details}
                />
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
});
