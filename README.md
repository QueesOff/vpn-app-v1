# VPN App с Expo 52

![VPN Mobile App](/src/assets/cover.png 'VPN Mobile App')

## 🛠 Установка

1. Установка зависимостей

   ```sh
   npm install
   ```

2. Установка и использование правильной версии Node с помощью [NVM](https://github.com/nvm-sh/nvm)

   ```sh
   nvm install
   ```

## 🚀 Запуск приложения

1. Запуск Expo сервера разработки

   ```sh
   npm start
   # или напрямую
   npx expo start
   ```

2. Запуск приложения

   ```sh
   npm run ios
   # или
   npm run android
   # или
   npm run web
   ```

## 📱 Запуск на физическом устройстве

1. Установите приложение Expo Go на ваше устройство:

   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Отсканируйте QR-код, который появится в терминале или в веб-интерфейсе Expo после запуска `npm start`

## 🏗️ Сборка для продакшн

1. Настройка EAS Build

   ```sh
   npx eas build:configure
   ```

2. Сборка для iOS/Android

   ```sh
   npx eas build --platform ios
   # или
   npx eas build --platform android
   ```

## 📚 Ресурсы

Ресурс: [Day 278 – VPN Mobile App UI Kit – Sketch Freebie](https://project365.design/2018/10/05/day-278-vpn-mobile-app-ui-kit-sketch-freebie/)

##

Удачного кодинга!
