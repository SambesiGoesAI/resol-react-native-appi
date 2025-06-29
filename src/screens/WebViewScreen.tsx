import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WebViewScreenProps {
  uri: string;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({ uri }) => {
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

  return (
    <SafeAreaView style={styles.flexContainer}>
      <WebView
        source={{ uri }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
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

