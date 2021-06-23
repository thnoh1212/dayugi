import React, { Apploading } from 'react';
import { Keyboard, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ToastAndroid, Platform, AlertIOS, BackHandler, TouchableWithoutFeedback  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends React.Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleEmail = text => {
    this.setState({ email: text });
  };

  handlePassword = text => {
    this.setState({ password: text });
  };


  login = (email, password) => {
    let dataObj= {email:email.trim(), password:password};
    fetch('http://k4a206.p.ssafy.io:8080/dayugi/user', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj),
      }).then(response => response.json())
      .then(async(responseJson) => {
        let success = responseJson.success;
        if(success == "success"){
          let uid = String(responseJson.data['uid']);
          let nickName = String(responseJson.data['nickname']);
          let Authorization = String(responseJson.Authorization);
          let time = String(+ new Date());
          await AsyncStorage.setItem('expiration', time);
          await AsyncStorage.setItem('uid', uid);
          await AsyncStorage.setItem('email', this.state.email);
          await AsyncStorage.setItem('nickName', nickName);
          await AsyncStorage.setItem('Authorization', Authorization);
          this.props.navigation.navigate("DiaryCalendar");
        }
        else {
          alert("Id 또는 비밀번호를 확인해주세요.");
        }
      }
    );
  };
  handleBackButton = () => {
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT)
      } else {
        AlertIOS.alert('한번 더 누르시면 종료됩니다.');
      }
        this.exitApp = true;

        this.timeout = setTimeout(
            () => {
                this.exitApp = false;
            },
            2000    // 2초
        );
    } else {
        clearTimeout(this.timeout);

        BackHandler.exitApp();  // 앱 종료
    }
    return true;
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.logoImageContainer}>
            <Image style={styles.logoImage} source={require('../../assets/images/dayugi.png')} />
          </View>
          <Text style={styles.logo}>DAYUGI</Text>
          <View>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder=" Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={this.handleEmail}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder=" Password"
              autoCapitalize="none"
              secureTextEntry = { true }
              onChangeText={this.handlePassword}
            />
          </View>
          
          <View style={styles.Btn}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.login(this.state.email, this.state.password)}
            >
              <Text style={styles.submitButtonText}>로 그 인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpText}>
            <Text>아이디가 없으신가요? </Text>
            <Text style={styles.textLink} onPress={() => this.props.navigation.navigate("SignUp")}>회원가입</Text>
            <Text> 하세요!</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    width: '100%',
  },
  input: {
    marginBottom: 10,
    marginLeft: 70,
    marginRight: 70,
    height: 40,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#FF7E36",
    padding: 10,
    marginTop: 10,
    marginLeft: 70,
    marginRight: 70,
    height: 40,
    borderRadius: 5,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: 'bold'
  },
  logoImageContainer: {
    flex: 1.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  logoImage: {
    marginLeft: '7%',
    height: '100%',
    width: '100%',
  },
  logo: {
    textAlign: 'center',
    color: '#FF7E36',
    fontSize: 40,
    marginBottom: '5%',
    fontFamily: '메이플스토리'
  },
  signUpText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  textLink: {
    color: '#FF7E36',
  }
});

export default LoginPage