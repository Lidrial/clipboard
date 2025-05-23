import { Stack } from 'expo-router';

import { FlatList, StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className=''>
        <FlatList
          data={["1", "2", "3", "4", "5"]}
          renderItem={({ item }) => (
            <View className='flex-1 bg-white border-b border-gray-200 p-4'>
              <ScreenContent path="app/(tabs)/settings.tsx" title={`Settings ${item}`} />
            </View>
          )}
        />
      </View>
    </>
  );
}


