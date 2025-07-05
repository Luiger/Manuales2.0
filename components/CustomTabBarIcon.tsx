import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomTabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

export default function CustomTabBarIcon({ name, label, focused }: CustomTabBarIconProps) {
  return (
    <View className="h-12 w-20 items-center justify-center">
      {focused ? (
        <View className="w-16 h-9 rounded-full bg-white justify-center items-center">
          <Ionicons name={name} size={22} color="#003366" />
        </View>
      ) : (
        <>
          <Ionicons name={name} size={22} color="white" />
          <Text className="text-white text-xs mt-1">{label}</Text>
        </>
      )}
    </View>
  );
}
