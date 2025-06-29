import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { ThemeContext } from '../context/ThemeContext';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { sanitize } from '../utils/sanitizeHtml';

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

  const contentWidth = Dimensions.get('window').width * 0.8;
  const containsHTML = /<[a-z][\s\S]*>/i.test(message.text);
  const baseTextStyle = message.isUser
    ? [styles.userText, isDarkMode ? styles.userTextDark : null]
    : [styles.agentText, isDarkMode ? styles.agentTextDark : null];

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
        {containsHTML ? (
          <View>
            <RenderHTML
              contentWidth={contentWidth}
              source={{ html: sanitize(message.text) }}
              baseStyle={baseTextStyle[0] || {}}
              tagsStyles={{
                a: { textDecorationLine: 'underline', color: baseTextStyle[0]?.color || '#0000EE' },
                b: baseTextStyle[0] || {},
                i: baseTextStyle[0] || {},
                u: baseTextStyle[0] || {},
                em: baseTextStyle[0] || {},
                strong: baseTextStyle[0] || {},
                p: baseTextStyle[0] || {},
                li: baseTextStyle[0] || {},
                ul: baseTextStyle[0] || {},
                ol: baseTextStyle[0] || {},
                br: baseTextStyle[0] || {},
                img: { maxWidth: '100%', height: 'auto' },
              }}
            />
          </View>
        ) : (
          <Text style={baseTextStyle}>
            {message.text}
          </Text>
        )}
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
// TODO: Manual test cases for HTML support:
// - Basic tags: <b>, <i>, <u>, <em>, <strong>, <p>, <br>
// - Links: <a href="..."> with various URLs
// - Images: <img src="..." alt="..." width="..." height="...">
// - Nested tags and complex HTML structures
// - Verify no raw HTML tags appear in UI
// - Confirm sanitization blocks scripts and unsafe attributes

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
