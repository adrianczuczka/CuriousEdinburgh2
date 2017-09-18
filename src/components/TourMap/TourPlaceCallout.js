import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    callout: {
        width: 200,
    },
    calloutHeader: {
        width: 200,
        backgroundColor: '#1d8daa',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        padding: 5,
    },
    calloutHeaderTitle: {
        color: '#ffffff',
        textAlign: 'center',
    },
    calloutBody: {
        width: 200,
        backgroundColor: '#ffffff',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 5,
    },
});
export default function TourPlaceCallout(props) {
    return (
      <View style={styles.callout}>
        <View style={styles.calloutHeader}>
          <Text style={styles.calloutHeaderTitle}>{props.title}</Text>
        </View>
        <View style={styles.calloutBody}>
          <Text>{props.description}</Text>
        </View>
      </View>
    );
}
TourPlaceCallout.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

