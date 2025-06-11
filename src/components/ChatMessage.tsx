import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fi-FI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[
      styles.container,
      message.isUser ? styles.userContainer : styles.agentContainer
    ]}>
      <View style={[
        styles.messageBubble,
        message.isUser 
          ? [styles.userBubble, isDarkMode ? styles.userBubbleDark : null]
          : [styles.agentBubble, isDarkMode ? styles.agentBubbleDark : null]
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser 
            ? [styles.userText, isDarkMode ? styles.userTextDark : null]
            : [styles.agentText, isDarkMode ? styles.agentTextDark : null]
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          message.isUser 
            ? [styles.userTimestamp, isDarkMode ? styles.userTimestampDark : null]
            : [styles.agentTimestamp, isDarkMode ? styles.agentTimestampDark : null]
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  agentContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  userBubbleDark: {
    backgroundColor: '#0A84FF',
  },
  agentBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  agentBubbleDark: {
    backgroundColor: '#2C2C2E',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  userTextDark: {
    color: '#FFFFFF',
  },
  agentText: {
    color: '#000000',
  },
  agentTextDark: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  userTimestampDark: {
    color: '#FFFFFF',
  },
  agentTimestamp: {
    color: '#666666',
  },
  agentTimestampDark: {
    color: '#CCCCCC',
  },
});