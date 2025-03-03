import {Platform} from 'react-native';
import VpnIpsec from 'react-native-vpn-ipsec';
import {VPN_CONFIG} from '../constants';

// Интерфейс для статуса подключения
export interface VpnStatus {
  isConnected: boolean;
  message: string;
}

// Функция для подключения к VPN серверу
export const connectToVpn = async (serverId: string): Promise<VpnStatus> => {
  try {
    // Если выбран Selectel, используем реальную конфигурацию
    if (serverId === 'selectel') {
      console.log('Подключение к Selectel VPN серверу...');

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
          // Подготавливаем VPN
          await VpnIpsec.prepare();

          // Проверяем текущее состояние
          const currentState = await VpnIpsec.getCurrentState();
          console.log('Текущее состояние VPN:', currentState);

          if (currentState === 'CONNECTED') {
            console.log(
              'VPN уже подключен, отключаемся перед новым подключением',
            );
            await VpnIpsec.disconnect();
          }

          // Подключаемся к VPN с обновленными параметрами
          console.log('Подключение к VPN через IPSec...');
          console.log('Параметры подключения:', {
            server: VPN_CONFIG.server.host,
            username: VPN_CONFIG.credentials.username,
            password: '***********', // Скрываем пароль в логах
            remoteId: VPN_CONFIG.settings.remoteId || VPN_CONFIG.server.host,
            localId: VPN_CONFIG.settings.localId || '',
          });

          // Проверяем доступность VpnIpsec
          if (!VpnIpsec || typeof VpnIpsec.connect !== 'function') {
            throw new Error('VpnIpsec модуль не инициализирован корректно');
          }

          try {
            console.log('Вызываем VpnIpsec.connect с параметрами...');

            // Добавляем таймаут для подключения
            const connectPromise = VpnIpsec.connect(
              VPN_CONFIG.server.host,
              VPN_CONFIG.credentials.username,
              VPN_CONFIG.credentials.password,
              VPN_CONFIG.settings.remoteId || VPN_CONFIG.server.host,
              VPN_CONFIG.settings.localId || '',
            );

            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                reject(
                  new Error(
                    'Таймаут подключения: превышено время ожидания (30 секунд)',
                  ),
                );
              }, 30000);
            });

            const connected = await Promise.race([
              connectPromise,
              timeoutPromise,
            ]);
            console.log('Результат подключения:', connected);

            // Проверяем состояние сразу после подключения
            const stateAfterConnect = await VpnIpsec.getCurrentState();
            console.log('Состояние сразу после connect:', stateAfterConnect);

            if (!connected) {
              console.error('VpnIpsec.connect вернул false');
              throw new Error(
                'Не удалось установить VPN-соединение: connect вернул false',
              );
            }
          } catch (error) {
            console.error('Ошибка при вызове VpnIpsec.connect:', error);
            throw error;
          }

          // Проверяем статус подключения
          const newState = await VpnIpsec.getCurrentState();
          console.log('Новое состояние VPN:', newState);

          if (newState === 'CONNECTED') {
            return {
              isConnected: true,
              message: 'Успешно подключено к Selectel VPN',
            };
          } else {
            throw new Error('VPN не подключился после попытки подключения');
          }
        } catch (vpnError) {
          console.error('Ошибка при подключении через IPSec:', vpnError);
          return {
            isConnected: false,
            message: `Ошибка подключения: ${
              vpnError instanceof Error
                ? vpnError.message
                : 'Неизвестная ошибка'
            }`,
          };
        }
      } else {
        console.warn('VPN подключение не поддерживается на этой платформе');
        return {
          isConnected: false,
          message: 'VPN не поддерживается на этой платформе',
        };
      }
    }

    // Для других серверов возвращаем ошибку
    return {
      isConnected: false,
      message: 'Выбранный сервер не поддерживает реальное VPN-подключение',
    };
  } catch (error) {
    console.error('Ошибка при подключении к VPN:', error);
    return {
      isConnected: false,
      message: `Ошибка подключения: ${
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      }`,
    };
  }
};

// Функция для отключения от VPN
export const disconnectFromVpn = async (): Promise<VpnStatus> => {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        // Проверяем текущее состояние VPN
        const currentState = await VpnIpsec.getCurrentState();
        console.log('Текущее состояние VPN при отключении:', currentState);

        if (currentState === 'CONNECTED' || currentState === 'CONNECTING') {
          // Отключаемся от VPN
          console.log('Отключение от VPN через IPSec...');
          await VpnIpsec.disconnect();

          // Проверяем статус отключения
          const newState = await VpnIpsec.getCurrentState();
          console.log('Новое состояние VPN после отключения:', newState);

          if (newState === 'DISCONNECTED') {
            return {
              isConnected: false,
              message: 'Отключено от VPN',
            };
          } else {
            throw new Error('VPN не отключился полностью');
          }
        }

        return {
          isConnected: false,
          message: 'VPN уже отключен',
        };
      } catch (vpnError) {
        console.error('Ошибка при отключении через IPSec:', vpnError);
        throw vpnError;
      }
    }

    return {
      isConnected: false,
      message: 'VPN не поддерживается на этой платформе',
    };
  } catch (error) {
    console.error('Ошибка при отключении от VPN:', error);
    return {
      isConnected: false,
      message: `Ошибка отключения: ${
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      }`,
    };
  }
};
