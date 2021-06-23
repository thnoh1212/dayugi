import React from 'react'
import { StyleSheet, View, Image, Text, Button, StatusBar, TouchableOpacity } from 'react-native'
import ViewPager from "@react-native-community/viewpager"
import { block } from 'react-native-reanimated'

class TutorialPage extends React.Component {
  render() {
    return (
      <ViewPager
        style={{ flex: 1 }}
        initialPage={0}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.pageStyle}>
          <View style={styles.tutorialImage}>
            <Image
              resizeMode='contain'
              style={styles.tinyLogo}
              source={require('../../assets/images/tutorial8.png')}
            />
          </View>
          <View style={styles.tutorialText}>
            <Text style={{ fontSize: 16 }}>만나서 반가워요!</Text>
            <Text style={{ fontSize: 16 }}>다육이도 반갑다네요</Text>
          </View>
          <View style={styles.tutorialBottom}>
          </View>
        </View>

        <View style={styles.pageStyle}>
          <View style={styles.tutorialImage}>
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/images/tutorial2.png')}
            />
          </View>
          <View style={styles.tutorialText}>
            <Text style={{ fontSize: 16 }}>달력을 눌러서 일기를 작성해 봐요</Text>
          </View>
          <View style={styles.tutorialBottom}>
          </View>
        </View>

        <View style={styles.pageStyle}>
          <View style={styles.tutorialImage}>
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/images/tutorial0.png')}
            />
          </View>
          <View style={styles.tutorialText}>
            <Text style={{ fontSize: 16 }}>다육이가 일기를 읽고</Text>
            <Text style={{ fontSize: 16 }}>말을 건넬거에요</Text>
          </View>
          <View style={styles.tutorialBottom}>
          </View>
        </View>

        <View style={styles.pageStyle}>
          <View style={styles.tutorialImage}>
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/images/tutorial10.png')}
            />
          </View>
          <View style={styles.tutorialText}>
            <Text style={{ fontSize: 16 }}>감정 분석 통계도 확인할 수 있어요</Text>
            <Text style={{ fontSize: 16 }}>멋져!</Text>
          </View>
          <View style={styles.tutorialBottom}>
          </View>
        </View>

        <View style={styles.pageStyle}>
          <View style={styles.tutorialImage}>
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/images/tutorial5.png')}
            />
          </View>
          <View style={styles.tutorialText}>
            <Text style={{ fontSize: 16 }}>이제 일기를 작성하러 가볼까요?</Text>
          </View>
          <View style={styles.tutorialButton}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("Login") }}>
              <Text style={{ color: 'white' }}>시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ViewPager>
    )
  }
}

const styles = StyleSheet.create({
  pageStyle: {
    backgroundColor: '#FFFAF0',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    flex: 1,
  },
  tutorialImage: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 1000,
    flex: 8,
  },
  tinyLogo: {
    resizeMode: 'contain',
    height: '60%',
  },
  tutorialText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 3,
  },
  tutorialBottom: {
    flex: 1,
  },
  tutorialButton: {
    backgroundColor: '#FF7E36',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    flex: 1,
  }
})

export default TutorialPage;