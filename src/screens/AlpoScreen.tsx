import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { User } from '../services/auth';
import { ChatContainer } from '../components/ChatContainer';
import { ChatInput } from '../components/ChatInput';
import { chatService } from '../services/chatService';
import { ChatMessage, ChatState } from '../types/chat';

interface AlpoScreenProps {
  user: User | null;
}

export const AlpoScreen: React.FC<AlpoScreenProps> = ({ user }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const [chatState, setChatState] = useState<Omit<ChatState, 'sessionID'>>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Load existing messages and session on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const messages = await chatService.loadMessages();
      const sessionID = chatService.getSessionID();
      setChatState(prev => ({
        ...prev,
        messages,
        sessionID,
      }));
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const generateMessageId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addMessage = (text: string, isUser: boolean): ChatMessage => {
    const message: ChatMessage = {
      id: generateMessageId(),
      text,
      isUser,
      timestamp: new Date(),
    };

    setChatState(prev => {
      const newMessages = [...prev.messages, message];
      // Save messages to storage
      chatService.saveMessages(newMessages);
      return {
        ...prev,
        messages: newMessages,
      };
    });

    return message;
  };

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || chatState.isLoading) return;

    // Clear any previous errors
    setChatState(prev => ({ ...prev, error: null }));

    // Add user message
    addMessage(messageText, true);

    // Set loading state
    setChatState(prev => ({ ...prev, isLoading: true }));

    try {
      // Send message to webhook
      const response = await chatService.sendMessage(messageText);
      
      // Add agent response
      addMessage(response.agentMessage, false);

      // Update session ID if received
      setChatState(prev => ({
        ...prev,
        sessionID: response.sessionID,
        isLoading: false,
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Tuntematon virhe tapahtui';
      
      setChatState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [chatState.isLoading]);

  const handleRetry = useCallback(() => {
    setChatState(prev => ({ ...prev, error: null }));
    // Get the last user message and resend it
    const lastUserMessage = [...chatState.messages].reverse().find(msg => msg.isUser);
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  }, [chatState.messages, handleSendMessage]);

  const handleClearChat = useCallback(() => {
    Alert.alert(
      'Tyhjennä keskustelu',
      'Haluatko varmasti tyhjentää koko keskustelun? Tätä toimintoa ei voi peruuttaa.',
      [
        {
          text: 'Peruuta',
          style: 'cancel',
        },
        {
          text: 'Tyhjennä',
          style: 'destructive',
          onPress: async () => {
            try {
              await chatService.clearSession();
              setChatState({
                messages: [],
                isLoading: false,
                error: null,
                sessionID: null,
              });
            } catch (error) {
              console.error('Failed to clear chat:', error);
            }
          },
        },
      ]
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDarkMode ? styles.containerDark : null]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatContainer
        messages={chatState.messages}
        isLoading={chatState.isLoading}
        error={chatState.error}
        onRetry={handleRetry}
        onClearChat={handleClearChat}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
});