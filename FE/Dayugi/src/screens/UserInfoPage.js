import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import DialogInput from 'react-native-dialog-input';
import Separator from '../components/Separator';

class UserInfoPage extends React.Component {
  state = {
    uid: 'none',
    email: '',
    password: '',
    nickName: '',
    birth: '',
    checkWithdrawal: false,
    checkDeleteAll: false,
    checkText: '',
  };

  handleUid = (text) => {
    this.setState({ uid: text });
  };
  handleEmail = (text) => {
    this.setState({ email: text });
  };
  handlePassword = (text) => {
    this.setState({ password: text });
  };
  handleNickName = (text) => {
    this.setState({ nickName: text });
  };
  handleBirth = (text) => {
    this.setState({ birth: text });
  };
  handleCheckWithdrawal = (bool) => {
    this.setState({ checkWithdrawal: bool });
  };
  handleCheckDeleteAll = (bool) => {
    this.setState({ checkDeleteAll: bool });
  };
  handleCheckTest = (text) => {
    this.setState({ checkText: text });
  };

  componentDidMount() {
    this.callApi().then((res) => {
      this.handleUid(String(res.data['uid']));
      this.handleBirth(String(res.data['birth']).substring(0, 10));
      this.handleNickName(String(res.data['nickname']));
    });
  }

  async checkLogin() {
    this.handleUid(String(await AsyncStorage.getItem('uid')));
    if (this.state.uid === 'null') {
      alert('로그인 후 이용해주세요.');
      this.props.navigation.navigate('DiaryCalendar');
    }
  }
  callApi = async () => {
    this.checkLogin();
    this.handleEmail(String(await AsyncStorage.getItem('email')));
    const response = await fetch(
      'http://k4a206.p.ssafy.io:8080/dayugi/user?email=' + this.state.email,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: await AsyncStorage.getItem('Authorization'),
        },
      }
    );
    const body = await response.json();
    return body;
  };

  withdrawal = async (checkText, uid) => {
    this.handleCheckWithdrawal(false);
    if (checkText === '확인') {
      fetch('http://k4a206.p.ssafy.io:8080/dayugi/user?uid=' + uid, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: await AsyncStorage.getItem('Authorization'),
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          let success = responseJson.success;
          if (success == 'success') {
            alert('지금까지 이용해주셔서 감사합니다.');
            AsyncStorage.clear();
            this.props.navigation.navigate('DiaryCalendar');
          }
          else {
            alert('오류가 발생했어요!');
          }
        });
    }
  };

  changeInfo = async () => {
    var dataObj = {
      birth: this.state.birth,
      email: this.state.email,
      nickname: this.state.nickName,
      password: this.state.password,
      uid: 0,
    };
    fetch('http://k4a206.p.ssafy.io:8080/dayugi/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: await AsyncStorage.getItem('Authorization'),
      },
      body: JSON.stringify(dataObj),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          alert('성공적으로 회원정보가 변경되었습니다.');
          this.handlePassword('');
          this.handleNickName(String(responseJson.data['nickname']));
        } else alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      });
  };

  logout = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('keyFirstLaunch', 'true');
    alert('다음에 다시 만나요!');
    this.props.navigation.navigate('Login');
  };

  deleteAll = async (checkText, uid) => {
    this.handleCheckDeleteAll(false);
    if (checkText === '확인') {
      fetch('http://k4a206.p.ssafy.io:8080/dayugi/diary/all?uid=' + uid, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: await AsyncStorage.getItem('Authorization'),
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          let success = responseJson.success;
          if (success == 'success') {
            alert('작성한 모든 다이어리가 삭제되었어요.');
            this.props.navigation.navigate('DiaryCalendar');
          }
          else {
            alert('오류가 발생했어요!');
          }
        });
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <CustomHeader navigation={this.props.navigation} />
          <View style={styles.dayugi}>
            <Image
              style={styles.dayugiImg}
              source={require('../../assets/images/dayugi.png')}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.submitButton} onPress={() => {this.handleCheckDeleteAll(true)}}>
                  <Image
                    style={styles.submitIcon}
                    source={require('../../assets/images/deleteall.png')}
                  />
                <Text style={styles.submitButtonText}>일기 전체삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.changeInfo()}
              >
                  <Image
                    style={styles.submitIcon}
                    source={require('../../assets/images/wrench.png')}
                  />
                  <Text style={styles.submitButtonText}>회원정보 변경</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={() => {this.logout()}}>
                  <Image
                    style={styles.submitIcon}
                    source={require('../../assets/images/logout.png')}
                  />
                <Text style={styles.submitButtonText}>로그아웃</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.handleCheckWithdrawal(true)}
              >
                  <Image
                    style={styles.submitIcon}
                    source={require('../../assets/images/deleteaccount.png')}
                  />
                <Text style={styles.submitButtonText}>회원탈퇴</Text>
              </TouchableOpacity>
              <DialogInput
                isDialogVisible={this.state.checkWithdrawal}
                title={'회원 탈퇴 확인'}
                message={
                  "정말 탈퇴하실거에요? \n진행하시려면 '확인'을 입력해주세요."
                }
                hintInput={'확인'}
                submitInput={(inputText) => {
                  this.withdrawal(inputText, parseInt(this.state.uid));
                }}
                closeDialog={() => {
                  this.handleCheckWithdrawal(false);
                }}
              />
              <DialogInput
                isDialogVisible={this.state.checkDeleteAll}
                title={'전체 삭제 확인'}
                message={
                  "삭제하시면 복구할수 없어요! \n진행하시려면 '확인'을 입력해주세요."
                }
                hintInput={'확인'}
                submitInput={(inputText) => {
                  this.deleteAll(inputText, parseInt(this.state.uid));
                }}
                closeDialog={() => {
                  this.handleCheckDeleteAll(false);
                }}
              />
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.titlecontainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/email.png')}
              />
              <Text style={styles.title}>이메일</Text>
            </View>
            <TextInput
              style={styles.content}
              underlineColorAndroid="transparent"
              value={this.state.email}
              placeholderTextColor="#9a73ef"
              autoCapitalize="none"
              editable={false}
            />
            <Separator />
            <View style={styles.titlecontainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/password.png')}
              />
              <Text style={styles.title}>비밀번호</Text>
            </View>
            <TextInput
              style={styles.content}
              underlineColorAndroid="transparent"
              placeholder="Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={this.handlePassword}
              editable={true}
            />

            <Separator />

            <View style={styles.titlecontainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/nick.png')}
              />
              <Text style={styles.title}>닉네임</Text>
            </View>
            <TextInput
              style={styles.content}
              underlineColorAndroid="transparent"
              value={this.state.nickName}
              placeholderTextColor="#9a73ef"
              autoCapitalize="none"
              onChangeText={this.handleNickName}
              editable={true}
            />

            <Separator />

            <View style={styles.titlecontainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/birth.png')}
              />
              <Text style={styles.title}>생년월일</Text>
            </View>
            <TextInput
              style={styles.content}
              underlineColorAndroid="transparent"
              value={this.state.birth}
              placeholderTextColor="#000"
              autoCapitalize="none"
              editable={false}
            />
            
            <Separator />

            
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    height: '100%',
    width: '100%',
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 8,
    color: '#000',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    height: 100,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
    height: '100%',
    width: '5%',
  },
  submitIcon: {
    height: '50%',
    width: '50%',
    marginBottom: "4%",
  },
  titlecontainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  dayugi: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
    height: '40%',
  },
  dayugiImg: {
    marginLeft: '2%',
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default UserInfoPage;
