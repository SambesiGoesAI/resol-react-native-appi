import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Important Update',
    summary: 'New features have been added to the application.',
    date: '2025-01-07',
  },
  {
    id: '2',
    title: 'System Maintenance',
    summary: 'Scheduled maintenance will occur next week.',
    date: '2025-01-06',
  },
  {
    id: '3',
    title: 'Welcome to Alpo',
    summary: 'Thank you for using our application.',
    date: '2025-01-05',
  },
];

export const UutisetScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Uutiset</Text>
        <Text style={styles.subtitle}>Latest news and updates</Text>
        
        {mockNews.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsItem}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>
            <Text style={styles.newsDate}>{item.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 30,
  },
  newsItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  newsSummary: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsDate: {
    fontSize: 14,
    color: '#999999',
  },
});