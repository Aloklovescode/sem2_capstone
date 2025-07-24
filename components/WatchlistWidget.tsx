'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';

const WatchlistWidget: React.FC = () => {
  const { cryptocurrencies, watchlist, removeFromWatchlist } = useCrypto();

  const watchlistCryptos = cryptocurrencies.filter(crypto => 
    watchlist.includes(crypto.id)
  ).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold">Watchlist</h2>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Your tracked cryptocurrencies
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {watchlistCryptos.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">No cryptocurrencies in watchlist</p>
            <p className="text-sm text-muted-foreground">
              Use the search to add cryptocurrencies to track
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlistCryptos.map((crypto) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{crypto.symbol.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      ${crypto.current_price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${
                      crypto.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {crypto.price_change_percentage_24h.toFixed(1)}%
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromWatchlist(crypto.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WatchlistWidget;