'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, Plus } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';

const MarketOverview: React.FC = () => {
  const { cryptocurrencies, addToWatchlist, watchlist, loading } = useCrypto();
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_percentage_24h' | 'current_price'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedCryptos = [...cryptocurrencies]
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    })
    .slice(0, 20);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Market Overview</h2>
        <p className="text-muted-foreground mt-1">Top cryptocurrencies by market cap</p>
      </div>

      {/* Table */}
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
                Price
              </th>
              <th 
                className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                24h %
              </th>
              <th 
                className="text-right p-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('market_cap')}
              >
                Market Cap
              </th>
              <th className="text-center p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
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
                    <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 bg-muted animate-pulse rounded ml-auto mr-auto"></div>
                  </td>
                </tr>
              ))
            ) : (
              sortedCryptos.map((crypto) => (
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
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded hover:bg-accent transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      {!watchlist.includes(crypto.id) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToWatchlist(crypto.id)}
                          className="p-1 rounded hover:bg-accent transition-colors"
                        >
                          <Plus className="w-4 h-4" />
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
  );
};

export default MarketOverview;