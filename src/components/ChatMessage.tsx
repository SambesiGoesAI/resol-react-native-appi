import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { sanitize } from '../utils/sanitizeHtml';
import { Colors } from '../constants/colors';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fi-FI', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const contentWidth = Dimensions.get('window').width * 0.8;
  const containsHTML = /<[a-z][\s\S]*>/i.test(message.text);
  const baseTextStyle = message.isUser
    ? styles.userText
    : styles.agentText;

  return (
    <View style={[
      styles.container,
      message.isUser ? styles.userContainer : styles.agentContainer
    ]}>
      <View style={[
        styles.messageBubble,
        message.isUser
          ? styles.userBubble
          : styles.agentBubble
      ]}>
        {message.isUser ? (
          containsHTML ? (
            <View>
              <RenderHTML
                contentWidth={contentWidth}
                source={{ html: sanitize(message.text) }}
                baseStyle={StyleSheet.flatten(baseTextStyle) || {}}
                tagsStyles={{
                  a: { textDecorationLine: 'underline', color: Colors.primary },
                  b: baseTextStyle || {},
                  i: baseTextStyle || {},
                  u: baseTextStyle || {},
                  em: baseTextStyle || {},
                  strong: baseTextStyle || {},
                  p: baseTextStyle || {},
                  li: baseTextStyle || {},
                  ul: baseTextStyle || {},
                  ol: baseTextStyle || {},
                  br: baseTextStyle || {},
                  img: { maxWidth: '100%', height: 'auto' },
                }}
              />
            </View>
          ) : (
            <Text style={baseTextStyle}>
              {message.text}
            </Text>
          )
        ) : (
          // Agent message
          containsHTML ? (
            <View>
              <RenderHTML
                contentWidth={contentWidth}
                source={{ html: sanitize(`<b>Virtuaalitalkkari Alpo</b><br/>${message.text}`) }}
                baseStyle={StyleSheet.flatten(baseTextStyle) || {}}
                tagsStyles={{
                  a: { textDecorationLine: 'underline', color: Colors.primary },
                  b: { fontWeight: 'bold', color: Colors.chatAgentText },
                  i: baseTextStyle || {},
                  u: baseTextStyle || {},
                  em: baseTextStyle || {},
                  strong: baseTextStyle || {},
                  p: baseTextStyle || {},
                  li: baseTextStyle || {},
                  ul: baseTextStyle || {},
                  ol: baseTextStyle || {},
                  br: baseTextStyle || {},
                  img: { maxWidth: '100%', height: 'auto' },
                }}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.agentHeader}>Virtuaalitalkkari Alpo</Text>
              <Text style={baseTextStyle}>{message.text}</Text>
            </View>
          )
        )}
        <Text style={[
          styles.timestamp,
          message.isUser
            ? styles.userTimestamp
            : styles.agentTimestamp
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
    backgroundColor: Colors.chatUserBubble,
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: Colors.chatAgentBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.chatUserText,
  },
  agentText: {
    color: Colors.chatAgentText,
  },
  agentHeader: {
    fontWeight: 'bold',
    color: Colors.chatAgentText,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: Colors.chatUserText,
    textAlign: 'right',
  },
  agentTimestamp: {
    color: Colors.chatAgentText,
  },
});
