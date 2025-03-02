/**
 * Sample React Native App with Expo
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {VPN} from './screens/VPN';
import {Welcome} from './screens/Welcome';

const Stack = createStackNavigator();

export const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="VPN" component={VPN} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
