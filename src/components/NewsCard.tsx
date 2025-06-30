import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NewsItem } from '../services/useNews';

interface NewsCardProps {
  news: NewsItem;
}

// Static mapping of image paths to require calls
const imageMap: { [key: string]: any } = {
  'icon.png': require('../../assets/icon.png'),
  'ruoho.png': require('../../assets/ruoho.png'),
  // Add other images here as needed, e.g.:
  // 'image1.png': require('../../assets/image1.png'),
};

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [imageError, setImageError] = useState(false);

  // Determine if imagePath is a remote URL or local asset key
  let imageSource = null;
  const imageUrl = news.image_url || news.imagePath;
  if (imageUrl && !imageError) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      imageSource = { uri: imageUrl };
    } else if (imageMap[imageUrl]) {
      imageSource = imageMap[imageUrl];
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.centeredContent}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.thumbnail}
            onError={() => setImageError(true)}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]}>
            <Text style={styles.placeholderText}>Alpo tiedottaa</Text>
          </View>
        )}
        <Text style={styles.title}>{news.title}</Text>
        <Text
          style={styles.text}
          accessibilityLabel={news.text}
        >
          {news.text}
        </Text>
      </View>
    </View>
  );
};

import { Colors } from '../constants/colors';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.newsCardBackground,
    borderRadius: 8,
    paddingVertical: 20,
    marginVertical: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  centeredContent: {
    width: '80%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.newsCardText,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  placeholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});