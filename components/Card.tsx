import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title: string;
  subtitle: string;
  tag: string;
  footerText: string;
  onPress?: () => void;
}

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

export default function Card({ title, subtitle, tag, footerText, onPress }: CardProps) {
  return (
    <TouchableOpacity style={{ width: cardWidth }} className="bg-white rounded-lg shadow-md mb-4" onPress={onPress}>
      <View className="p-4 bg-blue-900 rounded-t-lg h-40">
        <Text className="text-white font-bold text-lg">{title}</Text>
        <Text className="text-white text-sm">{subtitle}</Text>
        <Text className="text-gray-300 text-xs mt-auto">{tag}</Text>
      </View>
      <View className="p-3 bg-white rounded-b-lg">
        <Text className="text-center font-semibold">{footerText}</Text>
      </View>
    </TouchableOpacity>
  );
}
