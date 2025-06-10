import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  imagePath?: string;
}

// Mock data for news items
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Uutinen 1',
    text: 'Tämä on lyhyt uutinen, joka mahtuu alle kolmeen riviin.',
    imagePath: '../assets/icon1.png',
  },
  {
    id: '2',
    title: 'Uutinen 2',
    text: 'Tämä uutinen on hieman pidempi ja sen pitäisi katkaista kolmeen riviin, jotta "Lue lisää" -linkki tulee näkyviin. Tämä teksti jatkuu vielä hieman pidemmälle, jotta voimme testata leikkaamista.',
    imagePath: '../assets/icon2.png',
  },
  {
    id: '3',
    title: 'Uutinen 3',
    text: 'Tämä on todella pitkä uutinen, joka ylittää selvästi kolme riviä. Sen tarkoituksena on testata, että uutisen tekstin katkaisu ja laajennus toimivat oikein. Käyttäjä voi klikata "Lue lisää" nähdäksesi koko tekstin ja "Näytä vähemmän" piilottaakseen sen uudelleen.',
    imagePath: '../assets/icon3.png',
  },
];

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // For now, return mock data
    setNews(mockNewsData);

    // Future: replace with Supabase fetch logic here
  }, []);

  return { news };
}