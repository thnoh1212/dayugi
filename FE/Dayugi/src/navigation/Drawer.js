import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import DrawerContent from '../components/DrawerContent';

import { AnalysisPage, DiaryArchivePage, DiaryCalendarPage, GalleryPage, GrowthDiaryPage, SettingPage, TutorialPage, LoginPage, SignUpPage, DiaryDetailPage, DiaryWritePage, UserInfoPage, DiaryUpdatePage } from '../screens/index';

const Routes = {
  Tutorial : { screen : TutorialPage,
    navigationOptions:{
      drawerLockMode: 'locked-closed'
    }
  },
  Login: { screen: LoginPage,
    navigationOptions:{
      drawerLockMode: 'locked-closed'
    }
  },
  SignUp: { screen: SignUpPage,
    navigationOptions:{
      drawerLockMode: 'locked-closed'
    }
  },
  UserInfo: { screen: UserInfoPage },
  DiaryCalendar : { screen : DiaryCalendarPage },
  DiaryArchive : { screen : DiaryArchivePage },
  GrowthDiary : { screen : GrowthDiaryPage },
  Gallery: { screen: GalleryPage },
  Analysis : { screen : AnalysisPage },
  Setting : { screen : SettingPage },
  DiaryDetail : { screen : DiaryDetailPage },
  DiaryWrite : { screen : DiaryWritePage },
  DiaryUpdate : { screen : DiaryUpdatePage },
}

const Drawer = createDrawerNavigator(
    Routes,
    {
      initialRouteName: "DiaryCalendar",
      unmountInactiveRoutes: true,
      headerMode: "none",
      contentComponent: props => <DrawerContent {...props} />
    }
)

export default Drawer;