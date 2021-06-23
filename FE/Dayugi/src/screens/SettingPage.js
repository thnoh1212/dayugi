import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import Separator from '../components/Separator'

class SettingPage extends React.Component {
  state = {
    settingEnabled: false,
  }

  toggleSetting = () => {
    var toggle = !this.state.settingEnabled;

    this.setState({
      settingEnabled: toggle
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader navigation = {this.props.navigation}/>
        <View style={styles.menuContainer}>
          <View style={styles.settingMenu}>
            <Text style={styles.settingMenuText}>설정 기능 1</Text>
            <View style={styles.settingMenuSwitch}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSetting}
                value={this.state.settingEnabled}
              />
            </View>
          </View>
          <Separator />
          <View style={styles.settingMenu}>
            <Text style={styles.settingMenuText}>설정 기능 2</Text>
          </View>
          <Separator />
          <View style={styles.settingMenu}>
            <Text style={styles.settingMenuText}>설정 기능 3</Text>
          </View>
          <Separator />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  menuContainer: {
    marginTop: 8,
  },
  settingMenu: {
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center',
  },
  settingMenuText: {
    width: '80%',
    fontSize: 18,
    paddingLeft: 30,
  },
  settingMenuSwitch: {
    width: '20%',
    flexDirection: 'row', 
    alignItems: 'center',
  },
});

export default SettingPage