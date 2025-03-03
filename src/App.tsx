/**
 * Sample React Native App with Expo
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {Alert, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {VPN} from './screens/VPN';
import {Welcome} from './screens/Welcome';
import {checkDeviceSecurity, initSecurity} from './services/securityService';

const Stack = createStackNavigator();

export const App = () => {
  // Инициализация сервиса безопасности при запуске приложения
  useEffect(() => {
    // Инициализируем сервис безопасности
    const securityInitialized = initSecurity();

    if (!securityInitialized) {
      console.warn('Не удалось инициализировать сервис безопасности');
    }

    // Проверяем безопасность устройства
    const checkSecurity = async () => {
      const securityStatus = await checkDeviceSecurity();

      if (!securityStatus.isSecure) {
        // Если обнаружены угрозы безопасности, показываем предупреждение
        if (Platform.OS === 'web') {
          console.warn(
            'Обнаружены угрозы безопасности:',
            securityStatus.threats.join(', '),
          );
        } else {
          Alert.alert(
            'Предупреждение безопасности',
            `Обнаружены потенциальные угрозы безопасности:\n${securityStatus.threats.join(
              '\n',
            )}`,
            [
              {
                text: 'Понятно',
                style: 'default',
              },
            ],
          );
        }
      }
    };

    checkSecurity();
  }, []);

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
