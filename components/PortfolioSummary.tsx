'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';

const PortfolioSummary: React.FC = () => {
  const { portfolio } = useCrypto();

  const totalValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfitLoss = portfolio.reduce((sum, item) => sum + item.profitLoss, 0);
  const totalInvested = portfolio.reduce((sum, item) => sum + (item.amount * item.averagePrice), 0);
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  if (portfolio.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-8 text-center"
      >
        <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Start Building Your Portfolio</h3>
        <p className="text-muted-foreground mb-4">
          Add cryptocurrencies to track your investments and monitor performance.
        </p>
        <button className="px-4 py-2 crypto-gradient text-white rounded-lg font-medium">
          Add First Investment
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Portfolio Summary</h2>
        <p className="text-muted-foreground mt-1">Your investment performance</p>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              totalProfitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${
              totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${Math.abs(totalProfitLoss).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalProfitLoss >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Percent className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className={`text-2xl font-bold ${
              totalProfitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">Return</p>
          </div>
        </div>

        {/* Holdings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Holdings</h3>
          {portfolio.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.amount.toFixed(6)} {item.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.totalValue.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {item.profitLoss >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    item.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.profitLossPercentage >= 0 ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioSummary;