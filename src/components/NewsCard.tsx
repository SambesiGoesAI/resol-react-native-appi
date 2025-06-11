import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NewsItem } from '../services/useNews';

interface NewsCardProps {
  news: NewsItem;
}

const MAX_LINES_COLLAPSED = 3;

// Static mapping of image paths to require calls
const imageMap: { [key: string]: any } = {
  'icon.png': require('../../assets/icon.png'),
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
      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text>
        <View>
          <Text
            style={styles.text}
            accessibilityLabel={news.text}
          >
            {news.text}
          </Text>
        </View>
      </View>
      <View style={styles.thumbnailContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.thumbnail}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Alpo tiedottaa</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  toggleText: {
    marginTop: 4,
    color: '#007AFF',
    fontWeight: '600',
  },
  thumbnailContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 6,
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