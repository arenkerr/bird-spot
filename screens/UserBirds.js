import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';

const db = FirebaseWrapper.GetInstance();

const defaultImage =
  'https://firebasestorage.googleapis.com/v0/b/bird-spot-d2dd5.appspot.com/o/birds%2F2d3f3240-bc51-11e9-b22f-c198db962aea.jpg?alt=media&token=3f149cc4-2e36-4f2b-bba8-370a5c30f710';

export default class UserBirds extends Component {
  constructor(props) {
    super();
    this.state = {
      markers: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.firestoreMarkers(this.gotMarkers);
  }

  gotMarkers = async dbMarkers => {
    if (dbMarkers) {
      this.setState({ isLoading: false, markers: dbMarkers });
    }
  };

  firestoreMarkers = async callback => {
    try {
      await db.SetupCollectionListener('Markers', callback);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const user = this.props.user;

    return (
      <View>
        <Text style={styles.subhead}>Your Birds</Text>

        <View>
          {this.state.isLoading
            ? null
            : this.state.markers.map((marker, index) => {
                console.log(user.email.split('@')[0], marker.username);

                if (marker.username === user.email.split('@')[0]) {
                  const details = marker.details;
                  const title = marker.unknownSpecies
                    ? 'Unknown Species'
                    : marker.speciesName;
                  const imageURL = marker.imageURL
                    ? marker.imageURL
                    : defaultImage;

                  return (
                    <View key={index}>
                      <View style={styles.row}>
                        {imageURL && (
                          <Image
                            source={{ uri: imageURL }}
                            style={styles.image}
                          />
                        )}
                        <View style={styles.column}>
                          <Text style={styles.title}>{title}</Text>
                          <Text style={styles.details}>{details}</Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  row: {
    margin: 10,
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    margin: 10,
  },
  subhead: {
    fontWeight: '700',
    fontSize: 24,
    margin: 10,
    color: '#22b573',
  },
  image: {
    height: 120,
    width: 120,
  },
  title: {
    fontWeight: '700',
    color: '#22b573',
    fontSize: 18,
    marginBottom: 10,
  },
  details: {
    fontStyle: 'italic',
  },
});
