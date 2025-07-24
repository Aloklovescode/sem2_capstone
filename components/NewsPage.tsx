'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, TrendingUp, Clock, Search } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  image?: string;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data - in a real app, this would come from a news API
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
      description: 'Bitcoin has surged to unprecedented levels as major corporations and financial institutions continue to embrace cryptocurrency as a legitimate asset class.',
      url: '#',
      publishedAt: '2024-01-15T10:30:00Z',
      source: 'CryptoNews',
      category: 'bitcoin',
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Staking Rewards Hit Record Levels',
      description: 'The Ethereum network continues to see massive growth in staking participation, with rewards reaching new highs for validators.',
      url: '#',
      publishedAt: '2024-01-15T08:15:00Z',
      source: 'BlockchainDaily',
      category: 'ethereum',
      image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'DeFi Protocol Launches Revolutionary Yield Farming Strategy',
      description: 'A new decentralized finance protocol has introduced an innovative approach to yield farming that promises higher returns with lower risk.',
      url: '#',
      publishedAt: '2024-01-14T16:45:00Z',
      source: 'DeFi Weekly',
      category: 'defi',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Central Bank Digital Currencies Gain Momentum Worldwide',
      description: 'Multiple countries are accelerating their CBDC development programs, signaling a major shift in the global financial landscape.',
      url: '#',
      publishedAt: '2024-01-14T14:20:00Z',
      source: 'Financial Times Crypto',
      category: 'regulation',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      title: 'NFT Market Shows Signs of Recovery with New Use Cases',
      description: 'The NFT market is experiencing renewed interest as creators explore utility-focused applications beyond digital art.',
      url: '#',
      publishedAt: '2024-01-14T11:30:00Z',
      source: 'NFT Insider',
      category: 'nft',
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      title: 'Major Exchange Announces Zero-Fee Trading for Retail Investors',
      description: 'One of the world\'s largest cryptocurrency exchanges has eliminated trading fees for retail customers in a bid to increase adoption.',
      url: '#',
      publishedAt: '2024-01-13T09:15:00Z',
      source: 'Exchange News',
      category: 'trading',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews(mockNews);
      setLoading(false);
    };

    fetchNews();
  }, []);

  const categories = [
    { key: 'all', label: 'All News' },
    { key: 'bitcoin', label: 'Bitcoin' },
    { key: 'ethereum', label: 'Ethereum' },
    { key: 'defi', label: 'DeFi' },
    { key: 'nft', label: 'NFT' },
    { key: 'regulation', label: 'Regulation' },
    { key: 'trading', label: 'Trading' },
  ];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Cryptocurrency News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest developments in the crypto world
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'crypto-gradient text-white'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-muted animate-pulse"></div>
              <div className="p-6">
                <div className="w-3/4 h-4 bg-muted animate-pulse rounded mb-2"></div>
                <div className="w-full h-3 bg-muted animate-pulse rounded mb-1"></div>
                <div className="w-2/3 h-3 bg-muted animate-pulse rounded mb-4"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
                  <div className="w-20 h-3 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNews.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {article.image && (
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full capitalize">
                      {article.category}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <span className="font-medium">{article.source}</span>
                </div>
                
                <motion.a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 mt-4 px-4 py-2 crypto-gradient text-white rounded-lg font-medium text-sm"
                >
                  <span>Read More</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {filteredNews.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No news articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or category filter
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default NewsPage;