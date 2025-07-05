import { Tabs } from 'expo-router';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import CustomTabBar from '../../components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}
