import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WebViewScreenProps {
  uri: string;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({ uri }) => {
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
