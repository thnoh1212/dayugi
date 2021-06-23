import React from 'react';
import AppContainer from './src/navigation/AppContainer';
import { StyleSheet, View, Text, Modal } from 'react-native';

import * as Font from 'expo-font';

class App extends React.Component {
  state = {
    isReady: false
  }
  async componentDidMount() {
    await Font.loadAsync({
      메이플스토리: require('./assets/fonts/Maplestory_Bold.ttf'),
      교보_손글씨: require('./assets/fonts/Kyobo_Handwriting_2019.ttf'),
    });
    this.handleIsReady(true);
  }
  handleIsReady = boolean => {
    this.setState({ isReady: boolean });
  }

  render() {
    // AsyncStorage.clear();
    if(this.state.isReady){
      return (
        <AppContainer />
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Modal transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.loading}>
                <Text style={styles.loadingText}>로딩중입니다...</Text>
              </View>
            </View>
          </Modal>
        </View>
        )
    }
  }
}

const styles = StyleSheet.create({
  loading: {
    width:200,
    height:200,
    backgroundColor: '#000',
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    width: '100%',
    height: '100%',
  },
});
export default App;