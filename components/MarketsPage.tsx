'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Filter, Star, Plus, Eye } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';

const MarketsPage: React.FC = () => {
  const { cryptocurrencies, addToWatchlist, watchlist, loading } = useCrypto();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_percentage_24h' | 'current_price' | 'total_volume'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'gainers' | 'losers'>('all');

  const filteredCryptos = cryptocurrencies
    .filter(crypto => {
      const matchesSearch = crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterBy === 'gainers') return matchesSearch && crypto.price_change_percentage_24h > 0;
      if (filterBy === 'losers') return matchesSearch && crypto.price_change_percentage_24h < 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const marketStats = {
    totalMarketCap: cryptocurrencies.reduce((sum, crypto) => sum + crypto.market_cap, 0),
    totalVolume: cryptocurrencies.reduce((sum, crypto) => sum + crypto.total_volume, 0),
    gainers: cryptocurrencies.filter(crypto => crypto.price_change_percentage_24h > 0).length,
    losers: cryptocurrencies.filter(crypto => crypto.price_change_percentage_24h < 0).length,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Cryptocurrency Markets</h1>
        <p className="text-muted-foreground">
          Real-time cryptocurrency prices, market caps, and trading volumes
        </p>
      </motion.div>

      {/* Market Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Market Cap</h3>
          <p className="text-2xl font-bold">${(marketStats.totalMarketCap / 1e12).toFixed(2)}T</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">24h Volume</h3>
          <p className="text-2xl font-bold">${(marketStats.totalVolume / 1e9).toFixed(1)}B</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Gainers</h3>
          <p className="text-2xl font-bold text-green-500">{marketStats.gainers}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Losers</h3>
          <p className="text-2xl font-bold text-red-500">{marketStats.losers}</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
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
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'gainers', label: 'Gainers' },
              { key: 'losers', label: 'Losers' },
            ].map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterBy(filter.key as typeof filterBy)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterBy === filter.key
                    ? 'crypto-gradient text-white'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Markets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 font-medium">#</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th 
                  className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('current_price')}
                >
                  Price {sortBy === 'current_price' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('price_change_percentage_24h')}
                >
                  24h % {sortBy === 'price_change_percentage_24h' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('total_volume')}
                >
                  Volume {sortBy === 'total_volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('market_cap')}
                >
                  Market Cap {sortBy === 'market_cap' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="text-center p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4">
                      <div className="w-6 h-4 bg-muted animate-pulse rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                        <div>
                          <div className="w-20 h-4 bg-muted animate-pulse rounded mb-1"></div>
                          <div className="w-12 h-3 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="w-16 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="w-12 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="w-16 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="w-8 h-8 bg-muted animate-pulse rounded ml-auto mr-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredCryptos.map((crypto) => (
                  <motion.tr
                    key={crypto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-4 text-muted-foreground">
                      {crypto.market_cap_rank}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground uppercase">
                            {crypto.symbol}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${crypto.current_price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`font-medium ${
                            crypto.price_change_percentage_24h >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {crypto.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${(crypto.total_volume / 1e9).toFixed(2)}B
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${(crypto.market_cap / 1e9).toFixed(2)}B
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded hover:bg-accent transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        {!watchlist.includes(crypto.id) ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToWatchlist(crypto.id)}
                            className="p-1 rounded hover:bg-accent transition-colors"
                            title="Add to Watchlist"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded bg-yellow-500/20 text-yellow-500"
                            title="In Watchlist"
                          >
                            <Star className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredCryptos.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No cryptocurrencies found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MarketsPage;