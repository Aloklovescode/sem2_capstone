'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, Star } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';
import MarketOverview from './MarketOverview';
import PortfolioSummary from './PortfolioSummary';
import WatchlistWidget from './WatchlistWidget';
import TradingWidget from './TradingWidget';

const Dashboard: React.FC = () => {
  const { cryptocurrencies, portfolio, loading } = useCrypto();
  const { user } = useAuth();

  const totalMarketCap = cryptocurrencies.reduce((sum, crypto) => sum + crypto.market_cap, 0);
  const totalVolume24h = cryptocurrencies.reduce((sum, crypto) => sum + crypto.total_volume, 0);
  const portfolioValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const portfolioProfitLoss = portfolio.reduce((sum, item) => sum + item.profitLoss, 0);

  const stats = [
    {
      title: 'Total Market Cap',
      value: `$${(totalMarketCap / 1e12).toFixed(2)}T`,
      change: '+2.34%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: '24h Volume',
      value: `$${(totalVolume24h / 1e9).toFixed(1)}B`,
      change: '+8.21%',
      icon: BarChart3,
      positive: true,
    },
    {
      title: 'Portfolio Value',
      value: user ? `$${portfolioValue.toLocaleString()}` : '$0',
      change: portfolioProfitLoss >= 0 ? `+$${portfolioProfitLoss.toFixed(2)}` : `-$${Math.abs(portfolioProfitLoss).toFixed(2)}`,
      icon: Wallet,
      positive: portfolioProfitLoss >= 0,
    },
    {
      title: 'Active Coins',
      value: cryptocurrencies.length.toString(),
      change: 'Live',
      icon: Star,
      positive: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {user ? `Welcome back, ${user.displayName}!` : 'Welcome to CryptoTracker'}
        </h1>
        <p className="text-muted-foreground">
          Track your portfolio, monitor markets, and make informed trading decisions.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.positive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <stat.icon className={`w-5 h-5 ${stat.positive ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className="flex items-center space-x-1">
                {stat.change !== 'Live' && (
                  stat.positive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )
                )}
                <span className={`text-sm ${
                  stat.change === 'Live' ? 'text-muted-foreground' :
                  stat.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <MarketOverview />
          {user && <PortfolioSummary />}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <WatchlistWidget />
          <TradingWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;