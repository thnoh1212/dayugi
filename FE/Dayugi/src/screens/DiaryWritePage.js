import React from 'react';
import { Modal, Keyboard, StyleSheet, View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView, Image, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import Separator from '../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class DiaryWritePage extends React.Component{
  state = {
    year : '',
    month : '',
    day : '',
    diaryContent : '',
    uid : '',
    authorization : '',
    status : false,
    image : null,
    isModalOpen : false,
  }

  async componentDidMount() {
    let y = this.props.navigation.getParam('year');
    let m = this.props.navigation.getParam('month')
    let d = this.props.navigation.getParam('day')
    this.state.uid = await AsyncStorage.getItem('uid');
    this.state.authorization = await AsyncStorage.getItem('Authorization' );
    this.setState({year : y, month : m, day : d});
  }

  writeDiary = () => {
    let date = this.state.year + '-' + this.state.month + '-' + this.state.day;
    let localUri = this.state.image;
    this.setState({isModalOpen : true});
    if (localUri != null) {
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let formData = new FormData();
      formData.append('files', { uri: localUri, name: filename, type });
      fetch(`http://k4a206.p.ssafy.io:8080/dayugi/diary?diary_content=${encodeURIComponent(this.state.diaryContent)}&diary_date=${encodeURIComponent(date)}&did=0&user.uid=${encodeURIComponent(this.state.uid)}`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "authorization": this.state.authorization,
        },
        body: formData,
      }).then(response => response.json())
        .then(responseJson => {
          this.props.navigation.navigate("DiaryCalendar");
        }
      );
    }
    else {
      fetch(`http://k4a206.p.ssafy.io:8080/dayugi/diary?diary_content=${encodeURIComponent(this.state.diaryContent)}&diary_date=${encodeURIComponent(date)}&did=0&user.uid=${encodeURIComponent(this.state.uid)}`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "authorization": this.state.authorization,
        },
      }).then(response => response.json())
        .then(responseJson => {
          this.props.navigation.navigate("DiaryCalendar");
        }
      );
    }
  };

  _pickImage = async () => {
    const {status_roll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  imgAlert() {
    Alert.alert(
      null,
      '이미지를 삭제하시겠습니까?',
      [
        {text: '삭제하기', onPress: () => this.setState({image : null})},
        {text: '취소', onPress: () => {}},
      ],
      { cancelable: true }
    )
  }

  render(){
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Modal transparent animationType="fade" visible={this.state.isModalOpen}>
          <View style={styles.modalContainer}>
            <View style={styles.uploading}>
                <Text>업로드 중입니다...</Text>
            </View>
          </View>
        </Modal>
        <CustomHeader navigation = {this.props.navigation}/>
        <View style={styles.diaryContentContainer}>
            <Text style={styles.title}>작성 날짜</Text>
            <Separator />
            <Text style={styles.dateContent}>{this.state.year}-{this.state.month}-{this.state.day}</Text>
            <Separator />
            <Text style={styles.title}>내용</Text>
            <Separator />
            <ScrollView>
              <TextInput 
                style={styles.diaryContent}
                underlineColorAndroid="transparent"
                placeholder="내용을 입력해주세요."
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                multiline={true}
                onChangeText={(text) => this.setState({diaryContent : text})}
              />
            </ScrollView>
            <Separator />
            <Text style={styles.title}>이미지</Text>
            <Separator />
            <View style={styles.diaryImageContainer}>
              <TouchableOpacity style={this.state.image == null ? styles.diaryImageLoadButtonBefore : null} onPress={() => {
                this._pickImage();
                }}>
                <Text style={{color:'#aaa'}}>{this.state.image == null ? "이미지 불러오기" : null}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={this.state.image != null ? styles.diaryImageLoadButtonAfter : null} onPress={() => {
                this.imgAlert();
                }}>
                <Image source={{ uri: this.state.image }} style={this.state.image != null ? styles.diaryImage : null}/>
              </TouchableOpacity>
            </View>
        </View>

        <View style={this.state.diaryContent != '' ? styles.diaryNavigationButton : styles.diaryNavigationButtonDisabled }>
          <TouchableOpacity style={styles.touchArea}  onPress={() => {
              if(this.state.diaryContent != '')
                this.writeDiary();
              else
                alert("내용을 입력해주세요")
            }}>
            <Text style={{color: 'white'}}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
    )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    width: '100%',
    height: '100%',
  },
  diaryContentContainer: {
    height: '100%',
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    elevation:2,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  dateContent: {
    fontSize: 21,
    marginLeft: 8,
    fontFamily: '교보_손글씨',
  },
  diaryContent: {
    fontSize: 21,
    marginLeft: 8,
    height: '100%',
    fontFamily: '교보_손글씨',
    color: 'black',
    alignSelf: 'stretch',
  },
  diaryImageContainer:{
    height : 180,
    margin : 8,
    marginTop: 0,
    marginBottom : 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryImageLoadButtonBefore: {
    backgroundColor: '#eee',
    borderRadius : 5,
    width: "100%",
    height: "100%", 
    justifyContent: 'center',
    alignItems: 'center',
    elevation:2,
  },
  diaryImageLoadButtonAfter: {
    backgroundColor: '#000',
    borderRadius : 5,
    width: "100%",
    height: "100%", 
    justifyContent: 'center',
    alignItems: 'center',
    elevation:2,
  },
  diaryImage: {
    width: 180,
    height: 180, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryNavigationButton: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    height: 40,
    backgroundColor: '#FF7E36',
    borderRadius: 5,
    elevation:3,
  },
  diaryNavigationButtonDisabled: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    height: 40,
    backgroundColor: '#aaa',
    borderRadius: 5,
    elevation:3,
  },
  touchArea : {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploading: {
    width:200,
    height:200,
    backgroundColor: '#000',
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default DiaryWritePage;