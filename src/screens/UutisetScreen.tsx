import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNews } from '../services/useNews';
import { NewsCard } from '../components/NewsCard';
import { User } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

export const UutisetScreen: React.FC = () => {
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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={styles.text}>
          Ladataan käyttäjätietoja...
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={styles.text}>
          Ladataan uutisia...
        </Text>
      </View>
    );
  }

  if (error && news.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>
          {error}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>
          Kirjaudu sisään nähdäksesi uutiset
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {news.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.text}>
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
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.text,
    fontSize: 16,
  },
});