import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const logo = require('../assets/images/logo.png');

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-gray-100" edges={['top']}>
      <View className="flex-row h-16 items-center justify-between px-3">
        {/* Left Container */}
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="p-1"
        >
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        {/* Center Container */}
        <View className="flex-row items-center">
          <Image source={logo} className="w-8 h-8 mr-2" resizeMode="contain" />
          <Text className="text-lg font-bold">Manuales de Contrataciones</Text>
        </View>

        {/* Right Spacer */}
        <View className="w-8" />
      </View>
    </SafeAreaView>
  );
}
