export const VPN_CONFIG = {
  server: {
    host: '45.12.130.48',
    port: 443, // порт для VPN подключений
    protocol: 'vless',
  },
  credentials: {
    uuid: 'a6c542e8-f416-452c-f', // ID из панели
    path: '/ws',
  },
  settings: {
    transport: 'ws', // изменено на ws
    tls: true, // включаем TLS
    xtls: false, // из панели: xtls выключен
    sniffing: true, // из панели: sniffing включен
    domain: '45.12.130.48', // добавляем домен
  },
};
