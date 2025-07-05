import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import CustomTabBarIcon from './CustomTabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// A map to connect route names to icon names
const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  home: 'home-outline',
  // Add other routes here
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
      <View className="flex-row bg-blue-900 h-20 items-center justify-around">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <CustomTabBarIcon
              name={iconMap[route.name] || 'alert-circle-outline'}
              label={label}
              focused={isFocused}
            />
          </TouchableOpacity>
        );
      })}
      </View>
    </SafeAreaView>
  );
}
