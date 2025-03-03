export const VPN_CONFIG = {
  server: {
    host: '45.12.130.48', // IP вашего VPN сервера
  },
  credentials: {
    username: 'vpnuser', // Имя пользователя IPSec
    password: 'TAxap46WpwbD', // Пароль IPSec и PSK
  },
  settings: {
    remoteId: '45.12.130.48', // IP сервера
    localId: '', // Оставляем пустым для IKEv1
  },
};
