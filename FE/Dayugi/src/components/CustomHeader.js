import React from 'react';
import { Header, Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

class CustomHeader extends React.Component {
  handleText = (text) => {
    this.setState({ title: '' });
  };
  render() {
    return (
      <Header
        statusBarProps={{ barStyle: 'dark-content' }}
        leftComponent={{
          icon: 'menu',
          color: '#000',
          onPress: () => this.props.navigation.openDrawer(),
        }}
        containerStyle={{
          backgroundColor: '#FFFAF0',
          height: 80,
        }}
        centerComponent={{
          text: this.props.title,
          style: {
            color: '#FF7E36',
            fontSize: 20,
          },
        }}
      />
    );
  }
}

export default CustomHeader;
