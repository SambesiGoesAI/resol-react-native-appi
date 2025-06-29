import React, { useContext, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
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

  // Deduplicate messages by ID to avoid duplicate key errors
  const uniqueMessagesMap = React.useMemo(() => {
    const map = new Map<string, ChatMessageType>();
    messages.forEach(msg => {
      if (msg.id) {
        if (!map.has(msg.id)) {
          map.set(msg.id, msg);
        } else {
          console.warn('ChatContainer: Duplicate message ID found and ignored:', msg.id);
        }
      } else {
        console.warn('ChatContainer: Message with missing id detected:', msg);
      }
    });
    return map;
  }, [messages]);

  const uniqueMessages = Array.from(uniqueMessagesMap.values());

  // Diagnostic: Check for duplicate or missing message IDs
  React.useEffect(() => {
    const idCounts: Record<string, number> = {};
    uniqueMessages.forEach(msg => {
      if (!msg.id) {
        console.warn('ChatContainer: Message with missing id detected:', msg);
      } else {
        idCounts[msg.id] = (idCounts[msg.id] || 0) + 1;
      }
    });
    const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
    if (duplicates.length > 0) {
      console.warn('ChatContainer: Duplicate message IDs detected:', duplicates);
    }
  }, [uniqueMessages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage key={item.id} message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[
        styles.emptyTitle,
        isDarkMode ? styles.emptyTitleDark : null
      ]}>
        Tässä voit aloittaa keskustelun Alpon kanssa!
      </Text>
      <Text style={[
        styles.emptySubtitle,
        isDarkMode ? styles.emptySubtitleDark : null
      ]}>
        {`Kirjoita kysymyksesi alla olevaan tekstikenttään ja paina 'Lähetä' - Alpo vastaa sinulle pian 👷🏻‍♂️ \n\n Huomioithan, että Alpo ei ole oikea henkilö, vaan tekoälyavustaja: se ei voi antaa oikeudellista tai lääketieteellistä neuvontaa.
        \n\nJos olet pikaisen avun tarpeessa olethan yhteydessä asiakaspalveluumme 030 450 4850 (avoinna: 08:00 - 17:00).\n\n Päivystäjämme tavoitat 24h numerosta 044 796 7982.`}
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

  const renderLoadingIndicator = () => {
    // Move hooks to top-level component scope to avoid violating rules of hooks
    return <LoadingDots isDarkMode={isDarkMode} />;
  };
  
  const LoadingDots: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const dot1Opacity = useRef(new Animated.Value(0)).current;
    const dot2Opacity = useRef(new Animated.Value(0)).current;
    const dot3Opacity = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const createAnimation = (animatedValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
      };
  
      const anim1 = createAnimation(dot1Opacity, 0);
      const anim2 = createAnimation(dot2Opacity, 250);
      const anim3 = createAnimation(dot3Opacity, 500);
  
      anim1.start();
      anim2.start();
      anim3.start();
  
      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    }, [dot1Opacity, dot2Opacity, dot3Opacity]);
  
    return (
      <View style={styles.loadingContainer}>
        <View style={[
          styles.loadingBubble,
          isDarkMode ? styles.loadingBubbleDark : null
        ]}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, isDarkMode ? styles.dotDark : null, { opacity: dot1Opacity }]} />
            <Animated.View style={[styles.dot, isDarkMode ? styles.dotDark : null, { opacity: dot2Opacity }]} />
            <Animated.View style={[styles.dot, isDarkMode ? styles.dotDark : null, { opacity: dot3Opacity }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.containerDark : null
    ]}>
      <FlatList
        ref={flatListRef}
        data={uniqueMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          uniqueMessages.length === 0 ? styles.messagesContentEmpty : null
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => {
          if (uniqueMessages.length > 0) {
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