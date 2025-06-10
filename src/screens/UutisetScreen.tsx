import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useNews } from '../services/useNews';
import { NewsCard } from '../components/NewsCard';

export const UutisetScreen: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { news } = useNews();

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
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
});