# React Native

### 실행

```
yarn install
npm start
```

### dependency 추가

```
yarn add '~~~'
```

### 디렉토리/파일 구조

- assets
  - font, image 저장할 디렉토리
- src/components
  - screen에서 공동으로 사용될 수 있는 컴포넌트 정의
- src/navigation
  - screen 간의 전환을 위한 navigator 선언
- src/screens
  - 사용자에게 보여질 screen 레이아웃 및 기능 정의
- src/utils
  - 앱 동작에 필요한 함수 선언해둘 디렉토리 (아직 없지만 서버나 문자열 처리 등)
- App.js
  - 앱 구동시 실행되는 파일, src/navigation 을 포함하는 container로 선언했음

### 진행 상황

- 스크린 
  - 레이아웃 완료, 기능 미구현 - 튜토리얼(앱 최초 구동 시에만 실행되도록), 달력 다이어리(달력 날짜 선택 시 이벤트 처리를 통한 다이어리 조회), 모아보기(월 별 다이어리 목록 조회), 설정
  - 레이아웃 미구현 - 갤러리, 분석 그래프, 다이어리 작성/수정/조회, 회원 정보 관리
- 사이드바 - 각 페이지 이동 기능 구현 완료

### 실행 순서

1. 앱 실행 시 App.js가 실행된다.
2. src/navigation/Drawer.js 에서 스크린으로의 navigation을 선언하고, DrawerContent를 render
3. Drawer를 포함하는 AppContainer를 선언해 App.js에서 보이도록 함

### 기본 코드 구조

```react
import React from 'react';
import { '사용할 기본 컴포넌트' ex) View, Text, StyleSheet } from 'react-native';

class '클래스명' extends React.Component {
  state = {
      // vue의 bind처럼 동적으로 변하는 데이터들을 저장하는 느낌?
  }
  
  componentDidMount() {
	  // 컴포넌트 생성 후 실행되는 함수 ex) 초기화
  }
    
  // 그 외 필요한 함수 구현할 수 있음

  render() {
    // 스크린(컴포넌트)를 화면에 보이도록 만드는 함수
    // 반드시 단 하나의 View 컴포넌트를 반환해야 함
    return (
      <View style={styles.'정의한 StyleSheet 내 변수'}>
      	화면 구성
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // style 정의 ( css 형식 )
});

export default '클래스명'
```

### 사용 및 정의한 컴포넌트

#### 기본 컴포넌트 (검색이 더 정확할 수 있음 주의)

- <View> - html의 div 태그 처럼 사용되는 컴포넌트
- <Text> - 텍스트 값을 담는 컴포넌트, 그냥 텍스트를 써도 이 태그 밖에 쓰면 오류 떴음..
- <StyleSheet> - css 정의 라고 생각
- <TouchableOpacity> - view 태그와 비슷하지만 onPress 값을 통해 이벤트를 처리할 수 있는 영역

- <Modal> - visible값을 state 내 지정한 변수와 bind해서 on/off 구분, on/off 함수도 따로 구현
- <Switch> - on/off에 따라 다른 기능을 하도록 하는 스위치, 마찬가지로 on/off 함수 따로 구현
- <FlatList> - data를 state에 정의해 두었다(나중엔 서버에서 받아와야 함), renderItem 속성을 통해 따로 정의해둔 Item 태그로 넘겨 주면 반복적으로 item이 생성됨, key값을 unique하게 설정해야 함

#### src/components에 정의된 컴포넌트

- <Separator> - 그냥 구분선
- <CustomHeader> - 각 스크린마다 공통으로 들어가는 Header, 사이드바를 버튼으로 열 수 있도록 구현했음
- <DrawerContent> - 사이드바의 내용이 들어감, state에 이전에 정의해둔 navigation 경로 및 사용자에게 보여질 부분의 텍스트 저장

#### dependency 추가된 컴포넌트

- 'react-native-month-picker' - 다이어리 모아보기 페이지에서 특정 년/월을 선택하는 뷰
- 'react-native-calendars' - 메인(달력 다이어리) 페이지에서의 달력 뷰
- '@react-native-community/Viewpager' - 튜토리얼 페이지에서 스와이프를 통한 화면 전환을 할 수 있도록 도와줌

### [중요] props

컴포넌트 내에서 다른 컴포넌트를 사용할 때 props라는 속성을 전달해 줄 수 있음

this.props.'속성명' 을 사용해 상위 컴포넌트로 전달받은 값 또는 객체에 접근이 가능

기능이 많은 컴포넌트를 정의하거나, 외부 컴포넌트를 받아와 스타일을 적용할 때 사용하는 일이 많다

```react
// 사용 예시 1)
<CustomHeader navigation = {this.props.navigation}/>
/*
	위와 같이 사용하게 되면 상위 컴포넌트로 받아온 navigation이라는 값 또는 객체를 CustomHeader라는 컴포넌트에 navigation이라는 이름으로 전달하는 것입니다.
	그렇게 되면 CustomHeader 컴포넌트 내에서도 this.props.navigation을 통해 상위 컴포넌트에서 전달한 값 또는 객체에 접근이 가능합니다.
	저는 직접 정의한 CustomHeader에 배치한 버튼을 눌렀을 때 사이드바를 열 수 있도록 navigation을 전달하였습니다.
*/

// 사용 예시 2)
<Calendar 
    theme={{calendarBackground: '#FFF'}}
    monthFormat={"YYYY MM"}
    onDayPress={day => {alert(day.dateString, day);}}
/>
/*
	위와 같이 외부 컴포넌트를 사용할 때에도 props가 사용됩니다. 컴포넌트 내부에서 받아오는 코드는 우리가 작성하지 않지만 위와 같이 props를 통해 스타일 정의, 함수 등 값을 전달할 수 있습니다.
*/
```

### Style 정의 팁

#### flex

스타일 정의 부분의 flex값을 통해 화면 비율을 배정할 수 있습니다.

ex )

1. flex : 1 인 뷰 A -> A 전체화면
2. flex : 1 인 뷰 A, B -> A, B 가 화면의 반씩 차지
3. flex : 1 인 뷰 A, flex : 2인 뷰 B, flex : 3인 뷰 C, -> 화면의 비율 1:2:3을 각각 차지

사실 인터넷 검색해보는 게 이미지가 많아서 빠를 거 같습니다

#### 가로/세로 가운데 정렬

다음 3 가지 속성을 추가하면 정의한 뷰의 정 가운데에 내용을 정렬시킬 수 있습니다

  flexDirection: 'row' 

  justifyContent: 'center' 

  alignItems: 'center'

#### 기타

- 현재 정의된 style 중 대부분 margin/padding을 조정해 화면과 8px 간격을 두도록 구현했습니다.

### 유의사항

그 외 모르는거 말해주기 

dependency 추가 땐 꼭 알려주기,,