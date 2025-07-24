'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { cryptocurrencies, addToWatchlist, watchlist } = useCrypto();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState(cryptocurrencies.slice(0, 10));

  useEffect(() => {
    if (searchQuery) {
      const filtered = cryptocurrencies.filter(
        crypto =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCryptos(filtered.slice(0, 10));
    } else {
      setFilteredCryptos(cryptocurrencies.slice(0, 10));
    }
  }, [searchQuery, cryptocurrencies]);

  const handleAddToWatchlist = (id: string) => {
    addToWatchlist(id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl mx-4 bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              {filteredCryptos.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredCryptos.map((crypto) => (
                    <motion.div
                      key={crypto.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleAddToWatchlist(crypto.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium">{crypto.name}</h3>
                            <p className="text-sm text-muted-foreground uppercase">
                              {crypto.symbol}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${crypto.current_price.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-1">
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm ${
                                crypto.price_change_percentage_24h >= 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {watchlist.includes(crypto.id) && (
                        <div className="mt-2">
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                            In Watchlist
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cryptocurrencies found</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Click on any cryptocurrency to add it to your watchlist
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;