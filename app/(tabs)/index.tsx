import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ScreenContent } from '~/components/ScreenContent';

// Add to your app for URL scheme handling
import * as Linking from 'expo-linking';

export default function Home() {
  const { clipboardData } = useLocalSearchParams<{ clipboardData?: string }>();
  const [copied, setCopied] = useState<boolean | null>(null);
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);

  const handleCopy = async (item: string) => {
    await Clipboard.setStringAsync(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    console.log('Copied to clipboard:', item);

  }

  useEffect(() => {
    console.log('🔍 Current clipboardHistory:', clipboardHistory);
  }, [clipboardHistory]);

  useEffect(() => {
    // Handle URL params passed from router
    if (clipboardData) {
      setClipboardHistory((prevHistory) => [clipboardData, ...prevHistory]);
    }

    // Handle URLs directly with Linking API
    const handleURL = (event: { url: string }) => {
      const { url } = event;
      if (url.startsWith('clipboard://(tabs)?data=')) {
        const clipboardText = decodeURIComponent(url.split('data=')[1]);
        setClipboardHistory((prevHistory) => {
          const newHistory = [clipboardText, ...prevHistory];
          return newHistory;
        });
      } else {
        console.log('❌ URL pattern did not match');
      }
    };

    // Handle initial URL (when app is launched via URL scheme)
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && initialUrl.startsWith('clipboard://(tabs)?data=')) {
        handleURL({ url: initialUrl });
      }
    };

    getInitialURL();
    const subscription = Linking.addEventListener('url', handleURL);
    return () => subscription.remove();
  }, [clipboardData]);

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
            data={clipboardHistory}
            keyExtractor={(item, index) => `${item}-${index}`}
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
