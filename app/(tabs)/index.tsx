import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ScreenContent } from '~/components/ScreenContent';

import * as Linking from 'expo-linking';

import { ClipboardItem } from '~/components/ClipboardItem';
import { CopiedNotification } from '~/components/CopiedNotification';
import { SaveClipboardButton } from '~/components/SaveClipboardButton';
import { ClipBoardList } from '~/components/ClipboardList';
import { PaywallModal } from '~/components/PaywallModal';

export default function Home() {
  const { clipboardData } = useLocalSearchParams<{ clipboardData?: string }>();
  const [copied, setCopied] = useState<boolean>(false);
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);

  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  const FREE_LIMIT = 5; // Maximum items for free users

  const STORAGE_KEY = 'clipboard-history'

  const saveCurrentClipboard = async () => {
    try {
      const currentClipboard = await Clipboard.getStringAsync();

      // Check if clipboard is empty
      if (!currentClipboard || currentClipboard.trim() === '') {
        console.log('❌ Clipboard is empty or contains only whitespace');
        return;
      }

      // Check for duplicates
      if (clipboardHistory.includes(currentClipboard.trim())) {
        console.log('📋 Item already exists:', currentClipboard);
        return;
      }

      let newHistory;

      // Check if user is at free limit
      if (!isPremium && clipboardHistory.length >= FREE_LIMIT) {
        // Auto-delete oldest item (keep newest 4 + add new one = 5 total)
        newHistory = [currentClipboard.trim(), ...clipboardHistory.slice(0, FREE_LIMIT - 1)];
        setShowPaywall(true);
        console.log('💾 Free limit reached - auto-deleting oldest item');
      } else {
        // Normal save (under limit or premium user)
        newHistory = [currentClipboard.trim(), ...clipboardHistory];
      }

      console.log('💾 Saving clipboard:', currentClipboard);
      setClipboardHistory(newHistory);  // Use newHistory, not the old logic!

    } catch (error) {
      console.error('❌ Error getting clipboard content:', error);
    }
  };

  const handleCopy = async (item: string) => {
    await Clipboard.setStringAsync(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    console.log('Copied to clipboard:', item);

  }

  const handleDelete = (index: number) => {
    setClipboardHistory((prevHistory) => prevHistory.filter((_, i) => i !== index))
  }

  const handleUpgrade = () => {
    console.log('User wants to upgrade to premium!');
    alert('Premium upgrade comming soon!');
    setShowPaywall(false);
  }

  const handlePaywallClose = () => {
    console.log('Paywall closed');
    setShowPaywall(false);
  }

  const saveToStorage = async (history: string[]) => {
    try {
      const jsonData = JSON.stringify(history);
      await AsyncStorage.setItem(STORAGE_KEY, jsonData);
      console.log('💾 Saved to storage:', history.length, 'items');

    } catch (error) {
      console.log('❌ Error saving to storage:', error);

    }
  }

  const loadFromStorage = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEY)
      if (jsonData) {
        const history = JSON.parse(jsonData)
        console.log('📂 Loaded from storage:', history.length, 'items');
        return history
      }
      return []; //return empty array if no data
    } catch (error) {
      console.log('❌ Error loading from storage:', error);
      return []; //return empty array on error
    }
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
        setClipboardHistory((prevHistory) => [clipboardText, ...prevHistory]);
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

  useEffect(() => {
    // Load clipboard history from storage on mount
    const loadHistory = async () => {
      console.log('🔄 Loading clipboard from storage...')
      const savedhistory = await loadFromStorage();
      setClipboardHistory(savedhistory);
      console.log('📂 Loaded history:', savedhistory.length, 'items from storage');
    }
    loadHistory();
  }, []);

  useEffect(() => {
    // Save clipboard history to storage whenever it changes
    if (clipboardHistory.length > 0) {
      console.log('💾 Saving', clipboardHistory.length, 'items to storage...');
      saveToStorage(clipboardHistory);
    }
  }, [clipboardHistory]);

  return (
    <>
      <Stack.Screen options={{ title: 'Clipboard History' }} />

      {/* Manual Save Button */}
      <SaveClipboardButton
        onPress={saveCurrentClipboard}
        itemCount={clipboardHistory.length}
        maxItems={isPremium ? undefined : FREE_LIMIT}
      />

      <ClipBoardList
        data={clipboardHistory}
        onCopy={handleCopy}
        onDelete={isPremium ? handleDelete : undefined}
      />

      <CopiedNotification isVisible={copied} />

      <PaywallModal
        isVisible={showPaywall}
        onClose={handlePaywallClose}
        onUpgrade={handleUpgrade}
      />
    </>
  );

}
