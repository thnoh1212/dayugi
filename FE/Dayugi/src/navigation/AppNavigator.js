import { createStackNavigator } from 'react-navigation-stack';
import Drawer from '../navigation/Drawer';

const AppNavigator = createStackNavigator(
    {
        Drawer : { screen: Drawer },
    },
    {
        headerMode: 'none',
        initialRouteName: "Drawer",
    }
)

export default AppNavigator;