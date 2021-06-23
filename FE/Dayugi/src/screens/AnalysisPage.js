import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';
import Separator from '../components/Separator';
import CustomHeader from '../components/CustomHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import Plotly from 'react-native-plotly';

class AnalysisPage extends React.Component {
  state = {
    uid: '',
    email: '',
    nickName: '',
    authorization: '',

    startDate: new Date(),
    startDateString: moment(new Date()).format('YYYY-MM-DD'),
    startMode: 'date',
    startShow: false,
    diaries: [],

    endDate: new Date(),
    endDateString: moment(new Date()).format('YYYY-MM-DD'),
    endMode: 'date',
    endShow: false,

    screenWidth: Dimensions.get('window').width * 0.9,
    data: {
      labels: [''],
      datasets: [
        {
          data: [0],
          color: () => `#337EFF`,
        },
      ],
    },

    chartConfig: {
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0,
      fillShadowGradientOpacity: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2,
    },
    radarData: [
      {
        type: 'scatterpolar',
        r: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        theta: ['행복', '분노', '역겨움', '공포', '슬픔', '놀람', '보통', '행복'],
        fill: 'toself',
        name: 'Group A',
      },
    ],
    radarLayout: {
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 100],
          showticklabels: false,
          showline: false,
          ticklen: 0,
        },
        angularaxis: {
          color: '#eee',
          ticklen: 0,
          tickfont: {
            color: '#888',
            size: 13,
          },
        },
        gridshape: 'linear',
      },
      showlegend: false,
    },
  };

  componentDidMount() {
    this.getUid();
    this.getEmail();
    this.getNickName();
    this.getAuthorization();
  }

  async getUid() {
    let tmp = String(await AsyncStorage.getItem('uid'));
    this.setState({ uid: tmp });
  }
  async getEmail() {
    let tmp = String(await AsyncStorage.getItem('email'));
    this.setState({ email: tmp });
  }
  async getNickName() {
    let tmp = String(await AsyncStorage.getItem('nickName'));
    this.setState({ nickName: tmp });
  }

  async getAuthorization() {
    let tmp = String(await AsyncStorage.getItem('Authorization'));
    this.setState({ authorization: tmp });
  }

  handleStartDate = (Date) => {
    this.setState({ startDate: Date });
    this.setState({
      startDateString: moment(this.state.startDate).format('YYYY-MM-DD'),
    });
    if (this.state.startDate > this.state.endDate) {
      this.handleEndDate(Date);
    }
  };

  onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startDate;
    this.handleStartShow(Platform.OS === 'ios');
    this.handleStartDate(currentDate);
  };

  handleStartMode = (text) => {
    this.setState({ startMode: text });
  };

  startShowMode = (currentMode) => {
    this.handleStartShow(true);
    this.handleStartMode(currentMode);
  };

  startShowDatepicker = () => {
    this.startShowMode('date');
  };

  handleStartShow = (Boolean) => {
    this.setState({ startShow: Boolean });
  };

  handleEndDate = (Date) => {
    this.setState({ endDate: Date });
    this.setState({
      endDateString: moment(this.state.endDate).format('YYYY-MM-DD'),
    });
  };

  onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.endDate;
    this.handleEndShow(Platform.OS === 'ios');
    this.handleEndDate(currentDate);
  };

  handleEndMode = (text) => {
    this.setState({ endMode: text });
  };

  endShowMode = (currentMode) => {
    this.handleEndShow(true);
    this.handleEndMode(currentMode);
  };

  endShowDatepicker = () => {
    this.endShowMode('date');
  };

  handleEndShow = (Boolean) => {
    this.setState({ endShow: Boolean });
  };

  analysis = () => {
    const url = `http://k4a206.p.ssafy.io:8080/dayugi/diary/period?uid=${encodeURIComponent(
      this.state.uid
    )}&startDate=${encodeURIComponent(this.state.startDateString)}&endDate=${encodeURIComponent(
      this.state.endDateString
    )}`;

    fetch(url, {
      method: 'GET',
      headers: {
        accept: '*/*',
        authorization: this.state.authorization,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let success = responseJson.success;
        let data = responseJson.data;

        if (success === 'success') {
          data.sort(function (a, b) {
            if (a.diary_date < b.diary_date) return -1;
            if (a.diary_date > b.diary_date) return 1;
          });
          this.setState({ diaries: data });

          let sum = [0, 0, 0, 0, 0, 0, 0, 0];
          let cnt = 0;
          for (let index = 0; index < data.length; index++) {
            const d = data[index];
            if (d.happiness == null) continue;

            cnt++;
            sum[0] += Number(d.happiness);
            sum[1] += Number(d.angry);
            sum[2] += Number(d.disgust);
            sum[3] += Number(d.fear);
            sum[4] += Number(d.sadness);
            sum[5] += Number(d.surprise);
            sum[6] += Number(d.neutral);
          }

          for (let index = 0; index < 7; index++) {
            sum[index] = (sum[index] / cnt) * 100;
          }
          sum[7] = sum[0];

          let tmpData = [
            {
              type: 'scatterpolar',
              r: sum,
              theta: ['행복', '분노', '역겨움', '공포', '슬픔', '놀람', '보통', '행복'],
              fill: 'toself',
              name: 'Group A',
            },
          ];
          this.setState({ radarData: tmpData });
          let values = []
          let s = data[0]['diary_date']
          let e = data[data.length - 1]['diary_date']
          let sday = [Number(s.slice(0, 4)), Number(s.slice(5, 7)), Number(s.slice(8, 10))]
          let eday = [Number(e.slice(0, 4)), Number(e.slice(5, 7)), Number(e.slice(8, 10))]
          let day = [s.slice(5, 10)]
          while (sday[2] != eday[2] || sday[1] != eday[1] || sday[1] != eday[1]) {
            sday[2]++
            if ((sday[1] == 2 && ((sday[0] % 4 == 0 && sday[2] == 30) || (sday[0] % 4 != 0 && sday[2] == 29)))
              || ([4, 6, 9, 11].includes(sday[1]) && sday[2] == 30)
              || ([1, 3, 5, 7, 8, 10, 12].includes(sday[1]) && sday[2] == 31)) {
              sday[1]++
              sday[2] = 1
            }
            let month = String(sday[1])
            if (month.length == 1) {
              month = '0' + month
            }
            let days = String(sday[2])
            if (days.length == 1) {
              days = '0' + days
            }
            day.push(month + '-' + days)
          }
          let i = 0
          for (let index = 0; index < data.length; index++) {
            const d = data[index];
            while (true) {
              if (d['diary_date'].slice(5, 10) == day[i]) {
                values.push(Number(d['happiness']))
                i++
                break
              } else {
                values.push(null)
              }
              i++
            }
          }
          let l = 1 + parseInt(day.length / 8)
          for (let index = 0; index < day.length; index++) {
            if (index % l != 0) {
              day[index] = ''
            }
          }
          let lineData = {
            labels: day,
            datasets: [
              {
                data: values,
                color: () => `#337EFF`,
              },
            ],
          };
          this.setState({ data: lineData })
        } else {
          this.setState({
            diaries: [],
          });
        }
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader navigation={this.props.navigation} />
        <Text style={styles.headline_text}>다이어리 분석</Text>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ width: '100%' }}>
          <View style={{ marginHorizontal: 20 }}>
            <Separator />
            <View style={styles.setDateText}>
              <Text>기간 설정 : &nbsp;</Text>
              <TouchableOpacity onPress={() => this.startShowDatepicker()}>
                <Text style={styles.text}>
                  {this.state.startDateString}&nbsp;
                <Icon name="calendar" size={15} color="#FF7E36" />
                </Text>
              </TouchableOpacity>
              <Text>&nbsp;&nbsp;~&nbsp;&nbsp;</Text>
              {this.state.startShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.startDate}
                  mode={this.state.startMode}
                  is24Hour={true}
                  display="default"
                  onChange={this.onStartChange}
                />
              )}
              <TouchableOpacity onPress={() => this.endShowDatepicker()}>
                <Text style={styles.text}>
                  {this.state.endDateString}&nbsp;
                <Icon name="calendar" size={15} color="#FF7E36" />
                </Text>
              </TouchableOpacity>
              {this.state.endShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.endDate}
                  mode={this.state.endMode}
                  is24Hour={true}
                  display="default"
                  onChange={this.onEndChange}
                  minimumDate={this.state.startDate}
                />
              )}
              <View>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.analysis()}>
                  <Text style={styles.submitButtonText}>조회</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Separator />
            <View>
              <Text>평균 감정 그래프</Text>
              <View style={styles.chartRow}>
                <Plotly
                  data={this.state.radarData}
                  layout={this.state.radarLayout}
                  debug
                  enableFullPlotly
                />
              </View>
            </View>
            <Separator />
            <Text>날짜별 행복지수</Text>
            <Text></Text>
            <View style={styles.lineChartRow}>
              <LineChart
                data={this.state.data}
                width={this.state.screenWidth}
                height={256}
                fromZero='true'
                yAxisInterval='365'
                chartConfig={this.state.chartConfig}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
  },
  headerView: {
    flexDirection: 'row',
  },
  headerText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FF7E36',
    fontSize: 20,
  },
  scrollView: {
  },
  text: {
    color: 'dimgray',
    fontSize: 16,
  },
  setDateText: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#FF7E36',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 2,
    height: 20,
    marginRight: 0,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 12,
  },
  chartRow: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  lineChartRow: {
    flex: 1,
    width: '100%',
    height: 350,
    marginBottom: 50,
  },
  pieChartRow: {
    flex: 1,
    width: '100%',
    height: 280,
  },
  headline_text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 20,
  },
});

export default AnalysisPage;
