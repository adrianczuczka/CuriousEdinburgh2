import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View,
         Text, TouchableHighlight,
         Modal, Button,
         Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/Header';
import TourList from './TourList';

const imageSource = require('assets/logo.jpg');

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { modalVisible: false, selectedValue: this.props.tourListSelectedValue };
        this.toggleModal = this.toggleModal.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(itemValue) {
        this.setState({ selectedValue: itemValue });
    }

    toggleModal() {
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    render() {
        return (
          <View style={styles.container}>
            <TouchableHighlight
              onPress={this.toggleModal}
              style={styles.button}
              underlayColor={styles.touchable}
            >
              <Icon
                name="bars"
                size={30}
                color="white"
              />
            </TouchableHighlight>
            <Text style={styles.title}>
              {this.props.title}
            </Text>
            <View style={styles.logo}>
              <Image
                style={styles.image}
                source={imageSource}
              />
            </View>
            <Modal
              animationType={'slide'}
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
              }}
            >
              <TourList
                tours={this.props.tourListTours}
                selectedValue={this.props.tourListSelectedValue}
                onValueChange={this.onValueChange}
              />
              <View style={styles.modal}>
                {this.props.children}
                <Button
                  title="OK" onPress={() => {
                      this.props.okButtonFunction(this.state.selectedValue);
                      this.toggleModal();
                  }}
                />
              </View>
            </Modal>
          </View>
        );
    }
    }
Header.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    tourListTours: PropTypes.arrayOf(PropTypes.object).isRequired,
    tourListSelectedValue: PropTypes.string.isRequired,
    okButtonFunction: PropTypes.func.isRequired,
};
Header.defaultProps = {
    children: null,
};
