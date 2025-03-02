import React from 'react';
import {Image, ScrollView, View} from 'react-native';
import {images, theme} from '../../constants';

const {background} = images;

const backgrounds = [
  {
    title: 'Защищено навсегда.',
    description:
      'Наше приложение обеспечивает надежную защиту ваших данных. Мы используем передовые технологии шифрования для обеспечения вашей безопасности.',
    image: background.welcome,
  },
  {
    title: 'Полное шифрование.',
    description:
      'Все ваши данные надежно зашифрованы. Никто не сможет получить доступ к вашей личной информации без вашего разрешения.',
    image: background.encrypted,
  },
  {
    title: 'Конфиденциальность прежде всего.',
    description:
      'Мы ценим вашу приватность и никогда не передаем ваши данные третьим лицам. Ваша безопасность - наш приоритет.',
    image: background.privacy,
  },
];

export const ImageList = () => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      scrollEnabled
      decelerationRate={0}
      scrollEventThrottle={16}
      snapToAlignment="center"
      showsHorizontalScrollIndicator={false}>
      {backgrounds.map((item, index) => (
        <View
          key={`img-${index}`}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: theme.sizes.width,
          }}>
          <Image
            source={item.image}
            resizeMode="center"
            style={{
              width: theme.sizes.width / 1.5,
              height: '100%',
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};
