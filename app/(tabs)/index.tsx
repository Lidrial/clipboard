import { Stack } from 'expo-router';
import { useState } from 'react';

import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  const [copied, setCopied] = useState<boolean | null>(null);

  const handleCopy = async (item: string) => {
    await Clipboard.setStringAsync(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }
  return (
    <>
      <Stack.Screen options={{ title: 'Clipboard History' }} />
      <View className='w-full h-full'>
        <View className='flex-1 bg-gray-50'>
          {copied && (
            <View className='absolute top-1/2 right-0 left-0 z-10 items-center justify-center'>
              <Text className='text-center text-white bg-gray-600 p-4 rounded-lg'>
                Copied !
              </Text>
            </View>
          )}
          <FlatList
            data={["Ceci est le texte 1", "Ceci est le texte 2", "Ceci est le texte 3", "Ceci est le texte 4", "Ceci est le texte 5"]}
            renderItem={({ item }) => (
              <View className='flex-row justify-between border-b border-gray-300 pt-4 pb-4'>
                <View className='justify-center pl-6 flex-1'>
                  <TouchableOpacity onPress={() => handleCopy(item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                </View>
                <View className='flex-row w-1/3 justify-evenly'>
                  <View className='h-16 w-px -my-2 bg-gray-200'></View>
                  {(() => {
                    const date = new Date();
                    const [day, month, year] = date.toLocaleDateString('fr-FR').split('/');
                    const time = date.toLocaleTimeString('fr-FR');
                    return (
                      <View className="items-center justify-center">
                        <Text className='text-center'>
                          {`${day}/${month}/${year}`}
                          {'\n'}
                          {time}
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              </View>
            )}>
          </FlatList >
        </View >
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
