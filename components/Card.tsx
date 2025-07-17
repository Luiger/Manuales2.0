import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ImageSourcePropType } from 'react-native';

// 1. Se actualiza la interfaz de propiedades
interface CardProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  // 'imageSource' ahora puede ser una URL o un archivo local
  imageSource?: ImageSourcePropType;
  footerText: string;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

export default function Card({ title, subtitle, tag, imageSource, footerText, onPress }: CardProps) {
  return (
    <TouchableOpacity style={{ width: cardWidth }} className="bg-white rounded-lg shadow-md mb-4" onPress={onPress}>
      <View className="bg-blue-900 rounded-t-lg h-40 overflow-hidden">
        {/* 2. Se renderiza la imagen o el texto condicionalmente */}
        {imageSource ? (
          // Ahora el 'source' es más flexible
          <Image source={imageSource} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="p-4 flex-1 justify-between">
            <View>
              {title && <Text className="text-white font-bold text-lg">{title}</Text>}
              {subtitle && <Text className="text-white text-sm mt-1">{subtitle}</Text>}
            </View>
            {tag && <Text className="text-gray-300 text-xs">{tag}</Text>}
          </View>
        )}
      </View>
      <View className="p-3 bg-white rounded-b-lg">
        <Text className="text-center font-semibold">{footerText}</Text>
      </View>
    </TouchableOpacity>
  );
}
