import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GridImageView from 'react-native-grid-image-viewer';

class GalleryPage extends React.Component {
  state = {
    files: [],
    uid: '',
    url: 'http://k4a206.p.ssafy.io/',
    authorization: '',
    imageList: [],
  };

  async componentDidMount() {
    this.state.uid = await AsyncStorage.getItem('uid');
    this.state.authorization = await AsyncStorage.getItem('Authorization');
    this.getAllDiary();
  }

  getAllDiary = () => {
    fetch(
      `http://k4a206.p.ssafy.io:8080/dayugi/diary/diaryfile?uid=${encodeURIComponent(
        this.state.uid
      )}`,
      {
        method: 'GET',
        headers: {
          accept: '*/*',
          authorization: this.state.authorization,
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let success = responseJson.success;
        if (success === 'success') {
          for (let i = 0; i < responseJson.diaries.length; i++) {
            let file_name = responseJson.diaries[i].file_name;
            // let fid = responseJson.diaries[i].fid;
            // let file_origname = responseJson.diaries[i].file_origname;
            // let file_path = responseJson.diaries[i].file_path;
            const { imageList } = this.state;
            this.setState({
              imageList: imageList.concat({
                image: this.state.url + file_name + '.jpg',
                // file_name: file_name,
                // file_origname: file_origname,
                // file_path: file_path,
              }),
            });
          }
        } else if (success === 'fail') {
          this.setState({ contents: [] });
        }
      });
  };

  render() {
    let Images = null;
    if (this.state.imageList.length == 0) {
      Images = (
        <View>
          <Image 
            style={styles.noImage}
            source={require('../../assets/images/NoImage.jpg')}
          />
        </View>
      );
    } else {
      Images = <GridImageView data={this.state.imageList} />;
    }

    return (
      <View style={styles.background}>
        <CustomHeader navigation={this.props.navigation}/>
        <Text style={styles.headline_text}>사진</Text>
        {
          this.state.imageList.length != 0 &&
          <Text style={styles.explore_text}>추억을 모아봤습니다</Text>
        }
        
        {Images}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stretch: {
    flex: 1,
    width: '30%',
    height: 200,
    resizeMode: 'stretch',
  },
  background: {
    backgroundColor: 'white',
    flex: 1,
  },
  headline_text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 20,
  },
  explore_text: {
    marginTop: 5,
    marginBottom: 10,
    color: 'black',
    marginLeft: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  noImage: {
    marginLeft: '10%',
    height: '80%',
    width: '80%',
    alignItems: 'center',
    resizeMode:'contain'
  },
  noImageText: {
    marginLeft: '40%',

  }
});

export default GalleryPage;
