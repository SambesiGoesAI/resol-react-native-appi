import React from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface WebViewScreenProps {
  uri: string;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({ uri }) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    return (
      <iframe
        src={uri}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    );
  }

  // Approximate height of tab bar (50) + keyboard accessory (44)
  const keyboardOffset = insets.bottom + 50 + 44;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 250 : 0}
      >
        <WebView
          source={{ uri }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

