import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { Calendar } from 'react-native-calendars';
import Separator from '../components/Separator';
import checkFirstLaunch from '../utils/CheckFirstLaunch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

class DiaryCalendarPage extends React.Component{
  constructor(props) {
    super(props);
  }

  state = {
    uid: '',
    authorization: '',
    currentYear: '',
    currentMonth: '',
    currentDay: '',
    contents: [
    
    ],
    markedDate: {},
    selectedContent: '',
    selectedDiaryID: '',
  };

  async componentDidMount() {
    const isFirstLaunch = await checkFirstLaunch();
    this.state.uid = await AsyncStorage.getItem('uid');
    this.state.authorization = await AsyncStorage.getItem('Authorization');
    
    if(isFirstLaunch){
      this.props.navigation.navigate("Tutorial");
    }
    else if (this.state.uid == null || this.state.uid == undefined || this.state.uid == '' ) {
      this.props.navigation.navigate("Login")
    }
    else{
      this.getAllDiary();
    }
  }

  getAllDiary = () => {
    fetch(`http://k4a206.p.ssafy.io:8080/dayugi/diary/all?uid=${encodeURIComponent(this.state.uid)}`, {
      method: "GET",
      headers: {
        "accept" : "*/*",
        "authorization": this.state.authorization
      },
      }).then(response => response.json())
      .then(responseJson => {
        let success = responseJson.success;
        if(success === "success"){
          let mDate = {};
          for (let i = 0; i < responseJson.diaries.length; i++) {
            let date = moment(responseJson.diaries[i].diary_date).format('YYYY-MM-DD');
            mDate[date] = {selected: false, marked : true, dotColor: '#FF7E36'};
          }
          this.setState({markedDate : mDate});
          this.setState({contents : responseJson.diaries});
        }
        else if(success === "fail"){
          this.setState({contents : []});
        }
      }
    );
  };
  
  render(){
    return (
      <View style={styles.container}>
          <CustomHeader navigation = {this.props.navigation}/>
          <Calendar
              style={{elevation : 3, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
              theme={{
                  calendarBackground: '#fff',
                  todayTextColor: '#FF7E36',
                  arrowColor: '#FF7E36',
                  selectedDayBackgroundColor: '#FF7E36',
                  selectedDotColor: '#fff',
              }} 
              markedDates={this.state.markedDate}
              onDayPress={d => {
                let dateString = d.dateString;
                this.setState({
                  currentYear: d.year,
                  currentMonth: ("0" + (d.month)).slice(-2),
                  currentDay: ("0" + (d.day)).slice(-2),
                });
                var content = "작성한 내용이 없습니다.";
                var did = -1;
                this.state.contents.forEach((data) => {
                  if(dateString == moment(data.diary_date).format('YYYY-MM-DD')){
                    content = data.diary_content;
                    did = data.did;
                  }
                });
                this.setState({selectedContent : content});
                this.setState({selectedDiaryID : did});
              }}
              monthFormat={'yyyy MM'}
              hideExtraDays={false}
              firstDay={1}
          />
          <View style={styles.diaryContentContainer}>
              <Text style={styles.diaryDate}>{this.state.currentYear}{this.state.currentYear != '' ? '-' : ''}{this.state.currentMonth}{this.state.currentYear != '' ? '-' : ''}{this.state.currentDay}</Text>
              <Separator />
              <Text style={styles.diaryContent}>{this.state.selectedContent}</Text>
          </View>
          
          <View style={this.state.selectedContent != '' ? styles.diaryNavigationButton : null}>
            <TouchableOpacity style={styles.touchArea} onPress={() => {
                this.state.selectedContent != "작성한 내용이 없습니다." 
                ? this.props.navigation.navigate("DiaryDetail", {did : this.state.selectedDiaryID}) 
                : this.props.navigation.navigate("DiaryWrite", {year : this.state.currentYear, month : this.state.currentMonth, day : this.state.currentDay}) 
              }}>
              <Text style={{color: 'white'}}>{ this.state.selectedContent != "작성한 내용이 없습니다." ? "상세조회" : "작성하기" }</Text>
            </TouchableOpacity>
          </View>
          
      </View>
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
    width: '100%',
    backgroundColor: '#fff',
    elevation: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: 8,
  },
  diaryDate: {
    fontSize: 18,
    marginLeft: 8,
    marginTop: 8,
  },
  diaryContent: {
    fontSize: 21,
    marginLeft: 8,
    fontFamily: '교보_손글씨',
  },
  touchArea : {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryNavigationButton: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    height: 40,
    backgroundColor: '#FF7E36',
    borderRadius: 5,
    elevation: 16,
  },
});

export default DiaryCalendarPage;