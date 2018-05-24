import React, { Component } from 'react';
import { WebView, Modal, Dimensions, ScrollView, Text } from 'react-native';
import PhotoView from 'react-native-photo-view';
import styles from './styles/ImageViewer';

export default class ImageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            image: null,
            video: null,
        };
    }

    hide() {
        this.setState({
            visible: false,
            image: null,
        });
    }

    showImage(img) {
        this.setState({
            visible: true,
            image: img,
            video: null,
        });
    }

    showVideo(vid) {
        this.setState({
            visible: true,
            image: null,
            video: vid,
        });
    }

    render() {
        const { visible, image, video } = this.state;
        if (image) {
            return (
              <Modal
                visible={visible}
                onRequestClose={() => { this.hide(); }}
              >
                <PhotoView
                  source={{ uri: image ? image.url : null }}
                  minimumZoomScale={1}
                  maximumZoomScale={3}
                  onTap={() => {
                      this.hide();
                  }}
                  resizeMode="contain"
                  style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                />
                <ScrollView
                  style={
                  [styles.scrollView,
                      {
                          top: Dimensions.get('window').height - 60,
                          width: Dimensions.get('window').width,
                      },
                  ]}
                >
                  <Text
                    style={styles.image}
                  >
                    {image ? image.text : null}
                  </Text>
                </ScrollView>
              </Modal>
            );
        } return (
          <Modal
            visible={visible}
            onRequestClose={() => {
                this.hide();
            }}
          >
            <WebView
              source={{ uri: video }}
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
            />
            <ScrollView
              style={
              [styles.scrollView,
                  {
                      top: Dimensions.get('window').height - 60,
                      width: Dimensions.get('window').width,
                  },
              ]}
            >
              <Text
                style={styles.image}
              >
                {image ? image.text : null}
              </Text>
            </ScrollView>
          </Modal>
        );
    }
}
