import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../services/auth';
import { ChatContainer } from '../components/ChatContainer';
import { ChatInput } from '../components/ChatInput';
import { chatService } from '../services/chatService';
import { ChatMessage, ChatState } from '../types/chat';
import { Colors } from '../constants/colors';

interface AlpoScreenProps {
  user: User | null;
}

export const AlpoScreen: React.FC<AlpoScreenProps> = ({ user }) => {
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput>(null);

  const navigation = useNavigation<any>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const [chatState, setChatState] = useState<Omit<ChatState, 'sessionID'>>({
    messages: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (isFocused && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Small delay to ensure UI is ready
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  useEffect(() => {
    async function setUserContext() {
      try {
        if (user) {
          await chatService.setUser(user);
        }
      } catch (error) {
        console.error('Failed to set user in chatService:', error);
      }
    }
    setUserContext();
  }, [user]);

  useEffect(() => {
    if (!chatState.isLoading && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0); // Ensure focus after loading completes
    }
  }, [chatState.isLoading]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: keyboardVisible ? () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : undefined,
    });
  }, [navigation, keyboardVisible]);

  

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
      chatService.saveMessage(newMessages[newMessages.length - 1]);
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
      if (response.sessionId) {
        // Removed call to setSessionID as it does not exist in ChatService
        // Session ID is managed internally in ChatService
      }
      setChatState(prev => ({
        ...prev,
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

  const handleBackPress = () => {
    // Use Keyboard from react-native to dismiss keyboard
    Keyboard.dismiss();
  };

  const handleRetry = useCallback(() => {
    setChatState(prev => ({ ...prev, error: null }));
    // Get the last user message and resend it
    const lastUserMessage = [...chatState.messages].reverse().find(msg => msg.isUser);
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  }, [chatState.messages, handleSendMessage]);

  const handleClearChat = useCallback(() => {
    // Removed clear chat functionality
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatContainer
        messages={chatState.messages}
        isLoading={chatState.isLoading}
        error={chatState.error}
        onRetry={handleRetry}
        keyboardVisible={keyboardVisible}
      />
      <ChatInput
        ref={inputRef}
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
        sendButtonTextColor="#FFFFFF"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },
});