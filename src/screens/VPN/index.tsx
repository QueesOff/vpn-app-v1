import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {images, theme} from '../../constants';
import {checkDeviceSecurity} from '../../services/securityService';
import {connectToVpn, disconnectFromVpn} from '../../services/vpnService';
import {Server, ServerValue} from './Server';
import {ServerList} from './ServerList';

// constants
const {icons} = images;
const {colors, fonts, shadow, sizes, weights} = theme;

export const VPN = () => {
  const insets = useSafeAreaInsets();
  const [connected, setConnected] = React.useState(false);
  const [connecting, setConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [server, setServer] = useState<ServerValue>({
    name: 'Автоматически',
    icon: icons.automatic,
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверяем поддержку VPN на текущей платформе
  const isVpnSupported = Platform.OS === 'ios' || Platform.OS === 'android';

  const handleConnect = async () => {
    if (connected) {
      // Отключение
      setConnecting(true);
      setError(null);
      try {
        const result = await disconnectFromVpn();
        setConnected(false);
        setStatusMessage(result.message);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Неизвестная ошибка';
        setError(errorMessage);
        Alert.alert('Ошибка', `Не удалось отключиться от VPN: ${errorMessage}`);
        console.error(error);
      } finally {
        setConnecting(false);
      }
    } else {
      // Подключение
      setConnecting(true);
      setError(null);
      try {
        // Проверяем безопасность устройства перед подключением
        const securityStatus = await checkDeviceSecurity();

        if (!securityStatus.isSecure && server.id === 'selectel') {
          // Если обнаружены угрозы безопасности и выбран реальный VPN сервер
          Alert.alert(
            'Предупреждение безопасности',
            `Обнаружены потенциальные угрозы безопасности:\n${securityStatus.threats.join(
              '\n',
            )}\n\nПодключение к VPN может быть небезопасным.`,
            [
              {
                text: 'Отмена',
                style: 'cancel',
                onPress: () => {
                  setConnecting(false);
                },
              },
              {
                text: 'Продолжить',
                style: 'destructive',
                onPress: async () => {
                  // Продолжаем подключение, несмотря на угрозы
                  await connectToVpnServer();
                },
              },
            ],
          );
        } else {
          // Если устройство безопасно или выбран демо-сервер, подключаемся
          await connectToVpnServer();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Неизвестная ошибка';
        setError(errorMessage);
        Alert.alert('Ошибка', `Не удалось подключиться к VPN: ${errorMessage}`);
        console.error(error);
        setConnecting(false);
      }
    }
  };

  // Функция для подключения к VPN серверу
  const connectToVpnServer = async () => {
    try {
      if (!isVpnSupported && server.id === 'selectel') {
        Alert.alert(
          'Не поддерживается',
          'VPN подключение не поддерживается на этой платформе',
        );
        setConnecting(false);
        return;
      }

      const serverId = server.id || 'default';
      const result = await connectToVpn(serverId);
      setConnected(result.isConnected);
      setStatusMessage(result.message);

      if (result.isConnected) {
        if (server.id === 'selectel') {
          Alert.alert(
            'Успешно',
            `Подключено к серверу ${server.name}. Теперь ваше соединение защищено.`,
          );
        } else {
          Alert.alert(
            'Успешно',
            `Подключено к серверу ${server.name} (демо режим)`,
          );
        }
      } else {
        setError(result.message);
        Alert.alert('Ошибка', result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      setError(errorMessage);
      Alert.alert('Ошибка', `Не удалось подключиться к VPN: ${errorMessage}`);
      console.error(error);
    } finally {
      setConnecting(false);
    }
  };

  const handleServer = (value: ServerValue) => {
    setServer(value);
    if (connected) {
      // Если уже подключены, отключаемся при смене сервера
      disconnectFromVpn().then(() => {
        setConnected(false);
        setStatusMessage('Отключено при смене сервера');
      });
    }
    setShow(false);
  };

  return (
    <SafeAreaView edges={['top', 'right', 'left']} style={styles.container}>
      <View style={{paddingVertical: sizes.h3}}>
        <Text style={[fonts.title, {fontWeight: weights.semibold}]}>VPN</Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={styles.connectedBlock}>
          <Text style={styles.connectedText}>
            {connected ? 'Подключено' : 'Отключено'}
          </Text>
          <View
            style={[
              {
                backgroundColor: connected
                  ? colors.success
                  : 'rgba(83,84,83,0.5)',
              },
              styles.status,
            ]}
          />
        </View>

        {statusMessage ? (
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        ) : null}

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <Image
          style={styles.image}
          source={icons[connected ? 'online' : 'offline']}
        />
        <Pressable
          style={[
            styles.connect,
            connected && styles.connected,
            connecting && styles.connecting,
          ]}
          disabled={connecting}
          onPress={handleConnect}>
          {connecting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                color={connected ? colors.black : colors.white}
              />
              <Text
                style={[
                  styles.connectText,
                  {
                    color: !connected ? colors.white : undefined,
                    marginLeft: 10,
                  },
                ]}>
                ПОДОЖДИТЕ...
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.connectText,
                {color: !connected ? colors.white : undefined},
              ]}>
              {connected ? 'ОТКЛЮЧИТЬСЯ' : 'ПОДКЛЮЧИТЬСЯ'}
            </Text>
          )}
        </Pressable>

        {server.id === 'selectel' && (
          <Text
            style={[styles.realVpnText, connected && {color: colors.success}]}>
            {connected ? '✓ Реальное VPN подключение' : 'Реальный VPN сервер'}
          </Text>
        )}
      </View>
      <View
        style={[
          {
            height: sizes.base * 9 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          styles.servers,
        ]}>
        <Pressable onPress={() => setShow(true)}>
          <Server server={server} />
        </Pressable>
      </View>
      <ServerList show={show} server={server} onServer={handleServer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connect: {
    minHeight: sizes.base * 5.5,
    borderRadius: sizes.radius,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    width: sizes.width / 2,
  },
  connected: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: colors.black,
  },
  connecting: {
    opacity: 0.7,
  },
  connectedBlock: {
    ...shadow,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: sizes.radius,
    paddingVertical: sizes.base,
    paddingHorizontal: sizes.padding,
  },
  connectedText: {
    ...fonts.subtitle,
    fontWeight: weights.semibold,
    color: colors.gray,
    height: sizes.h3,
  },
  statusMessage: {
    marginTop: 10,
    color: colors.gray,
    textAlign: 'center',
    ...fonts.caption,
  },
  errorMessage: {
    marginTop: 10,
    color: colors.error || 'red',
    textAlign: 'center',
    ...fonts.caption,
  },
  realVpnText: {
    marginTop: 10,
    color: colors.gray,
    textAlign: 'center',
    ...fonts.caption,
    fontWeight: weights.semibold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
    marginVertical: 20,
  },
  status: {
    borderRadius: sizes.base,
    width: sizes.base,
    height: sizes.base,
    marginLeft: sizes.small,
  },
  connectText: {
    ...fonts.caption,
    textAlign: 'center',
    fontWeight: weights.bold,
    marginVertical: sizes.padding / 2,
  },
  servers: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    width: sizes.width,
    ...shadow,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.05,
    shadowRadius: sizes.base / 2,
  },
});
