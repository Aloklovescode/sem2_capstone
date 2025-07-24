'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bug as Buy, Bell as Sell, Wallet } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const TradingWidget: React.FC = () => {
  const { cryptocurrencies, addToPortfolio } = useCrypto();
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const selectedCryptoCurrency = cryptocurrencies.find(crypto => crypto.id === selectedCrypto);

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to trade');
      return;
    }

    if (!selectedCryptoCurrency || !amount || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);

    if (tradeAmount <= 0 || tradePrice <= 0) {
      toast.error('Amount and price must be greater than 0');
      return;
    }

    if (tradeType === 'buy') {
      addToPortfolio(selectedCryptoCurrency, tradeAmount, tradePrice);
      toast.success(`Bought ${tradeAmount} ${selectedCryptoCurrency.symbol.toUpperCase()}`);
    } else {
      // For demo purposes, we'll just show a success message for selling
      toast.success(`Sold ${tradeAmount} ${selectedCryptoCurrency.symbol.toUpperCase()}`);
    }

    setAmount('');
    setPrice('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">Quick Trade</h2>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Buy or sell cryptocurrencies
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {!user ? (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Sign in to start trading</p>
            <button className="px-4 py-2 crypto-gradient text-white rounded-lg font-medium text-sm">
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleTrade} className="space-y-4">
            {/* Trade Type */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setTradeType('buy')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tradeType === 'buy'
                    ? 'profit-gradient text-white'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                }`}
              >
                <Buy className="w-4 h-4 inline mr-2" />
                Buy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setTradeType('sell')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tradeType === 'sell'
                    ? 'loss-gradient text-white'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                }`}
              >
                <Sell className="w-4 h-4 inline mr-2" />
                Sell
              </motion.button>
            </div>

            {/* Cryptocurrency Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Cryptocurrency</label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {cryptocurrencies.slice(0, 20).map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={selectedCryptoCurrency?.current_price.toString() || '0.00'}
                className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {selectedCryptoCurrency && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current price: ${selectedCryptoCurrency.current_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Total */}
            {amount && price && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-medium">
                    ${(parseFloat(amount) * parseFloat(price)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-3 rounded-lg font-medium ${
                tradeType === 'buy'
                  ? 'profit-gradient text-white'
                  : 'loss-gradient text-white'
              }`}
            >
              {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default TradingWidget;