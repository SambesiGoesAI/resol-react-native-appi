import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useNews } from '../services/useNews';
import { NewsCard } from '../components/NewsCard';
import { User } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UutisetScreen: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        // Silent fail - user load error
      } finally {
        setUserLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const { news, loading, error } = useNews({ user: user || undefined });

  if (userLoading) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#333'} />
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Ladataan käyttäjätietoja...
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#333'} />
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Ladataan uutisia...
        </Text>
      </View>
    );
  }

  if (error && news.length === 0) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Kirjaudu sisään nähdäksesi uutiset
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      {news.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
            Taloyhtiöllesi ei ole tällä hetkellä uutisia saatavilla
          </Text>
        </View>
      ) : (
        news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))
      )}
    </ScrollView>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
  textDark: {
    color: '#FFF',
    fontSize: 16,
  },
});