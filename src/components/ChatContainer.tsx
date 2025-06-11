import React, { useContext, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  error,
  onRetry,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[
        styles.emptyTitle,
        isDarkMode ? styles.emptyTitleDark : null
      ]}>
        Tervetuloa keskustelemaan!
      </Text>
      <Text style={[
        styles.emptySubtitle,
        isDarkMode ? styles.emptySubtitleDark : null
      ]}>
        Aloita keskustelu kirjoittamalla viesti alle.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={[
        styles.errorText,
        isDarkMode ? styles.errorTextDark : null
      ]}>
        {error}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            isDarkMode ? styles.retryButtonDark : null
          ]}
          onPress={onRetry}
        >
          <Text style={[
            styles.retryButtonText,
            isDarkMode ? styles.retryButtonTextDark : null
          ]}>
            Yritä uudelleen
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <View style={[
        styles.loadingBubble,
        isDarkMode ? styles.loadingBubbleDark : null
      ]}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, isDarkMode ? styles.dotDark : null]} />
          <View style={[styles.dot, isDarkMode ? styles.dotDark : null]} />
          <View style={[styles.dot, isDarkMode ? styles.dotDark : null]} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.containerDark : null
    ]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 ? styles.messagesContentEmpty : null
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />
      {isLoading && renderLoadingIndicator()}
      {error && renderError()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 16,
  },
  clearButtonDark: {
    backgroundColor: '#FF453A',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  clearButtonTextDark: {
    color: '#FFFFFF',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messagesContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyTitleDark: {
    color: '#FFFFFF',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySubtitleDark: {
    color: '#CCCCCC',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingBubbleDark: {
    backgroundColor: '#2C2C2E',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999999',
    marginHorizontal: 2,
  },
  dotDark: {
    backgroundColor: '#666666',
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorTextDark: {
    color: '#FF453A',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  retryButtonDark: {
    backgroundColor: '#0A84FF',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButtonTextDark: {
    color: '#FFFFFF',
  },
});