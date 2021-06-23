import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_VALUE = 'keyFirstLaunch';

function setAppLaunched() {
    AsyncStorage.setItem(KEY_VALUE, 'true');
}

export default async function checkFirstLaunch() {
    try {
        const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE);
        if (isFirstLaunched === null) { 
            setAppLaunched();
            return true; 
        }
        return false;  
    } catch (error) {
        return false;
    }
}