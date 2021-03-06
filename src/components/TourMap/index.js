import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, TouchableHighlight, Alert } from 'react-native';
import MapView from 'react-native-maps';
import Tour from 'models/Tour';
import TourPlaceCallout from 'components/TourMap/TourPlaceCallout';
import TourRecord from 'components/TourRecord';
import Geolocation from 'services/Geolocation';
import Utils from 'utils';

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    marker: {
        backgroundColor: '#1d8daa',
        padding: 5,
        borderRadius: 5,
        width: 30,
        height: 30,
        textAlign: 'center',
        color: '#ffffff',
    },
    routing: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    touchable: {
        color: '#fffaf0',
    },
});

const locationOff = require('assets/location_off.png');
const locationOn = require('assets/location_on.png');
const routingOff = require('assets/routing_off.png');
const routingOn = require('assets/routing_on.png');

export default class TourMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = null;
        this.markersRef = [];
        this.modal = null;
        this.geolocation = new Geolocation();
        this.onPress = this.onPress.bind(this);
        this.onCalloutPress = this.onCalloutPress.bind(this);
        this.toggleRouting = this.toggleRouting.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateMarkersRef = this.updateMarkersRef.bind(this);
        this.state = { showLocation: false, showRouting: false };
    }
    componentDidMount() {
        this.fitToSuppliedMarkers();
        this.geolocation.watchPosition().then(
            () => {
                if (this.state.showLocation) {
                    this.setState({ showLocation: false });
                }
            },
            () => {},
        );
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.tour.tourPlaces !== this.props.tour.tourPlaces ||
            nextProps.tour.direction !== this.props.tour.direction ||
            nextState.showLocation !== this.state.showLocation ||
            nextState.showRouting !== this.state.showRouting) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.tour.tourPlaces !== this.props.tour.tourPlaces) {
            this.fitToSuppliedMarkers();
        }
    }
    componentWillUnmount() {
        this.geolocation.clearWatch();
    }
    onPress(tourPlace) {
        if (Utils.isIos) {
            // Resets zIndex for every marker drawn on the device
            this.markersRef = this.markersRef.map((marker) => {
                marker.setNativeProps({ zIndex: 0 });
                return marker;
            });
            // Sets zIndex to a high value so that callout does not appear behind any marker
            this.markersRef[tourPlace.id].setNativeProps({ zIndex: 9999 });
            this.markersRef[tourPlace.id].showCallout();
        }
    }
    onCalloutPress(tourPlace) {
        this.modal.show(tourPlace);
    }
    fitToSuppliedMarkers() {
        if (this.mapRef !== null) {
            const markerIDs = this.props.tour.tourPlaces.map(tourPlace =>
            tourPlace.id);
            this.mapRef.fitToSuppliedMarkers(markerIDs, false);
        }
    }
    fitToCoordinates(coordinates) {
        if (this.mapRef !== null) {
            this.mapRef.fitToCoordinates([coordinates],
                { edgePadding: { top: 0, right: 0, bottom: 0, left: 0 }, animated: true });
        }
    }
    /*
        updateLocation() only sets to true showLocation if and only if
        the current position has changed. Updating showLocation to false is determined
        by geolocation.watchPosition (see componentDidMount method).
    */
    updateLocation() {
        if (!this.state.showLocation) {
            Geolocation.getCurrentPosition().then(
                (data) => {
                    this.setState({ showLocation: true });
                    this.fitToCoordinates(data);
                },
                error => Alert.alert('Geolocation error', error.statusText),
            );
        }
    }
    /*
        This method is called anytime a MapView.Marker is mounted (e.g. its object reference) or
        unmmounted (e.g. null). Note markersRef is re-assigned on any render call
    */
    updateMarkersRef(ref) {
        if (ref) {
            this.markersRef[ref.props.identifier] = ref;
        }
    }
    toggleRouting() {
        this.setState({ showRouting: !this.state.showRouting });
    }
    render() {
        this.markersRef = [];
        const listMarkers = this.props.tour.tourPlaces.map(tourPlace =>
          <MapView.Marker
            ref={this.updateMarkersRef}
            key={tourPlace.id}
            identifier={tourPlace.id}
            coordinate={{ latitude: tourPlace.location.latitude,
                longitude: tourPlace.location.longitude }}
            onPress={() => { this.onPress(tourPlace); }}
            onCalloutPress={() => { this.onCalloutPress(tourPlace); }}
          >
            <Text style={styles.marker}>{tourPlace.stop}</Text>
            <MapView.Callout tooltip style={{ width: 200 }}>
              <TourPlaceCallout
                title={tourPlace.title}
                description={tourPlace.getShortDescription(100)}
              />
            </MapView.Callout>
          </MapView.Marker>);
        const polylines = this.state.showRouting ? this.props.tour.directions.map(direction =>
          <MapView.Polyline
            key={direction.id}
            coordinates={direction.coordinates}
            strokeWidth={2} strokeColor={'#1d8daa'}
          />) : null;
        return (
          <View style={styles.map}>
            <MapView
              ref={(ref) => { this.mapRef = ref; }}
              style={styles.map}
              showsMyLocationButton={false}
              showsUserLocation
            >
              {listMarkers}
              {polylines}
            </MapView>
            <View style={styles.routing}>
              <TouchableHighlight
                style={{ width: 36, height: 36 }}
                onPress={this.updateLocation} underlayColor={styles.touchable}
              >
                <Image source={this.state.showLocation ? locationOn : locationOff} />
              </TouchableHighlight>
              <TouchableHighlight
                style={{ width: 36, height: 36, top: 5 }}
                onPress={this.toggleRouting} underlayColor={styles.touchable}
              >
                <Image source={this.state.showRouting ? routingOn : routingOff} />
              </TouchableHighlight>
            </View>
            <TourRecord
              ref={(c) => { this.modal = c; }}
            />
          </View>
        );
    }
}
TourMap.defaultProps = {
    tour: new Tour(),
};
TourMap.propTypes = {
    tour: PropTypes.instanceOf(Tour),
};
