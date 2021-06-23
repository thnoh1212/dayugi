import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image }  from 'react-native';
import CustomHeader from '../components/CustomHeader';
import Separator from '../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Dialog from "react-native-dialog";

class DiaryDetailPage extends React.Component{
    state = {
      did : '',
      diary : {},
      dialogVisible : false,
      authorization : '',
      image : null,
    }

    async componentDidMount() {
      this.state.did = this.props.navigation.getParam('did')
      this.state.authorization = await AsyncStorage.getItem('Authorization');
      
      this.getDiaryByDid();
    }

    getDiaryByDid = () => {
      fetch(`http://k4a206.p.ssafy.io:8080/dayugi/diary?did=${encodeURIComponent(this.state.did)}`, {
        method: "GET",
        headers: {
          "accept" : "*/*",
          "authorization": this.state.authorization
        },
        }).then(response => response.json())
        .then(responseJson => {
          let success = responseJson.success;
          if(success === "success"){
            if(responseJson.diary != undefined)
              this.setState({diary : responseJson.diary});
            if(responseJson.diaryFiles != undefined)
              this.setState({image : "http://k4a206.p.ssafy.io/" + responseJson.diaryFiles[0].file_name + ".jpg"});
          }
          else if(success === "fail"){
            if(responseJson.diary != undefined)
              this.setState({diary : responseJson.diary});
            if(responseJson.diaryFiles != undefined)
              this.setState({image : "http://k4a206.p.ssafy.io/" + responseJson.diaryFiles[0].file_name + ".jpg"});
          }
        }
      );
    };

    deleteDiaryByDid = () => {
      fetch(`http://k4a206.p.ssafy.io:8080/dayugi/diary?did=${encodeURIComponent(this.state.did)}`, {
        method: "DELETE",
        headers: {
          "accept" : "*/*",
          "authorization": this.state.authorization
        },
        }).then(response => response.json())
        .then(responseJson => {
          let success = responseJson.success;
          if(success === "success"){
            this.props.navigation.navigate("DiaryCalendar");
          }
          else if(success === "fail"){

          }
        }
      );
    };


    render(){
        return (
        <View style={styles.container}>
            <CustomHeader navigation = {this.props.navigation}/>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.diaryContentContainer}>
                  <Text style={styles.title}>작성 날짜</Text>
                  <Separator />
                  <Text style={styles.dateContent}>{moment(this.state.diary.diary_date).format('YYYY-MM-DD')}</Text>
                  <Separator />
                  <Text style={styles.title}>내용</Text>
                  <Separator />
                  <Text style={styles.diaryContent}>{this.state.diary.diary_content}</Text>
                  <View style={this.state.image != null ? styles.diaryImageContainer : null}>
                    <Image source={{ uri: this.state.image }} style={this.state.image != undefined ? styles.diaryImage : null}/>
                  </View>
                  <Separator />
                  <Text style={styles.title}>코멘트</Text>
                  <Separator />
                  <Text style={styles.reviewContent}>{this.state.diary.review_content}</Text>
              </View>
            </ScrollView>
            <View style={styles.buttons}>
              <View style={styles.diaryNavigationButton}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("DiaryCalendar");
                  }}>
                  <Text style={{color: 'white'}}>홈으로</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.diaryUpdateButton}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("DiaryUpdate", {diary : this.state.diary, image : this.state.image});
                  }}>
                  <Text style={{color: 'white'}}>수정하기</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.diaryDeleteButton}>
                <TouchableOpacity onPress={() => {
                    this.setState({dialogVisible : true});
                  }}>
                  <Text style={{color: 'white'}}>삭제하기</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>다이어리 삭제</Dialog.Title>
              <Dialog.Description>삭제하시겠습니까?</Dialog.Description>
              <Dialog.Button label="취소" onPress={() => this.setState({dialogVisible : false})}/>
              <Dialog.Button label="삭제" onPress={() => this.deleteDiaryByDid()}/>
            </Dialog.Container>
        </View>
        )
    }
}

const styles = StyleSheet.create({
  scrollContainer:{
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    elevation:2,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    width: '100%',
    height: '100%',
  },
  diaryContentContainer: {
    height: '100%',
    width: '100%',
    marginTop: 8,
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
    marginRight: 8,
    marginBottom: 16,
    fontFamily: '교보_손글씨',
  },
  diaryImageContainer: {
    backgroundColor: '#000',
    borderRadius : 5,
    height: 180, 
    margin : 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryImage: {
    width: 180,
    height: 180, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    fontSize: 21,
    marginLeft: 8,
    marginRight: 8,
    height: 100,
    fontFamily: '교보_손글씨',
  },
  buttons: {
    position: 'absolute',
    bottom : 8,
    height: 40,
    width: '100%',
    flexDirection: 'row',
  },
  diaryUpdateButton: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#FF7E36',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:3,
  },
  diaryDeleteButton: {
    flex: 1,
    marginLeft: 4,
    marginRight: 16,
    backgroundColor: '#FF7E36',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:3,
  },
  diaryNavigationButton: {
    flex: 1,
    marginLeft: 16,
    marginRight: 4,
    backgroundColor: '#FF7E36',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:3,
  },
});

export default DiaryDetailPage;