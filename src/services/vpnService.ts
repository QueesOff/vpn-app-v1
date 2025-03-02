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
      console.log('Конфигурация:', VPN_CONFIG);

      // Здесь должен быть реальный код для подключения к VPN
      // Для демонстрации просто возвращаем успешный статус
      return {
        isConnected: true,
        message: 'Успешно подключено к Selectel VPN',
      };
    }

    // Для других серверов просто имитируем подключение
    return {
      isConnected: true,
      message: `Подключено к серверу (демо)`,
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
    console.log('Отключение от VPN...');

    // Здесь должен быть реальный код для отключения от VPN
    // Для демонстрации просто возвращаем успешный статус
    return {
      isConnected: false,
      message: 'Отключено от VPN',
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
