'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface Portfolio {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface CryptoContextType {
  cryptocurrencies: CryptoCurrency[];
  portfolio: Portfolio[];
  watchlist: string[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  addToPortfolio: (crypto: CryptoCurrency, amount: number, price: number) => void;
  removeFromPortfolio: (id: string) => void;
  updatePortfolio: () => void;
  fetchCryptocurrencies: () => void;
  getCryptocurrencyById: (id: string) => CryptoCurrency | undefined;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCryptocurrencies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCryptocurrencies(response.data);
    } catch (error) {
      toast.error('Failed to fetch cryptocurrency data');
      console.error('Error fetching cryptocurrencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (id: string) => {
    if (!watchlist.includes(id)) {
      const newWatchlist = [...watchlist, id];
      setWatchlist(newWatchlist);
      localStorage.setItem('cryptotracker_watchlist', JSON.stringify(newWatchlist));
      toast.success('Added to watchlist');
    }
  };

  const removeFromWatchlist = (id: string) => {
    const newWatchlist = watchlist.filter(item => item !== id);
    setWatchlist(newWatchlist);
    localStorage.setItem('cryptotracker_watchlist', JSON.stringify(newWatchlist));
    toast.success('Removed from watchlist');
  };

  const addToPortfolio = (crypto: CryptoCurrency, amount: number, price: number) => {
    const existingPortfolioItem = portfolio.find(item => item.id === crypto.id);
    
    if (existingPortfolioItem) {
      const totalAmount = existingPortfolioItem.amount + amount;
      const totalValue = (existingPortfolioItem.amount * existingPortfolioItem.averagePrice) + (amount * price);
      const newAveragePrice = totalValue / totalAmount;
      
      const updatedPortfolio = portfolio.map(item =>
        item.id === crypto.id
          ? {
              ...item,
              amount: totalAmount,
              averagePrice: newAveragePrice,
              currentPrice: crypto.current_price,
              totalValue: totalAmount * crypto.current_price,
              profitLoss: (totalAmount * crypto.current_price) - (totalAmount * newAveragePrice),
              profitLossPercentage: ((crypto.current_price - newAveragePrice) / newAveragePrice) * 100,
            }
          : item
      );
      setPortfolio(updatedPortfolio);
      localStorage.setItem('cryptotracker_portfolio', JSON.stringify(updatedPortfolio));
    } else {
      const newPortfolioItem: Portfolio = {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        amount,
        averagePrice: price,
        currentPrice: crypto.current_price,
        totalValue: amount * crypto.current_price,
        profitLoss: (amount * crypto.current_price) - (amount * price),
        profitLossPercentage: ((crypto.current_price - price) / price) * 100,
      };
      
      const updatedPortfolio = [...portfolio, newPortfolioItem];
      setPortfolio(updatedPortfolio);
      localStorage.setItem('cryptotracker_portfolio', JSON.stringify(updatedPortfolio));
    }
    
    toast.success('Added to portfolio');
  };

  const removeFromPortfolio = (id: string) => {
    const newPortfolio = portfolio.filter(item => item.id !== id);
    setPortfolio(newPortfolio);
    localStorage.setItem('cryptotracker_portfolio', JSON.stringify(newPortfolio));
    toast.success('Removed from portfolio');
  };

  const updatePortfolio = () => {
    if (portfolio.length > 0) {
      const updatedPortfolio = portfolio.map(item => {
        const crypto = cryptocurrencies.find(c => c.id === item.id);
        if (crypto) {
          return {
            ...item,
            currentPrice: crypto.current_price,
            totalValue: item.amount * crypto.current_price,
            profitLoss: (item.amount * crypto.current_price) - (item.amount * item.averagePrice),
            profitLossPercentage: ((crypto.current_price - item.averagePrice) / item.averagePrice) * 100,
          };
        }
        return item;
      });
      setPortfolio(updatedPortfolio);
      localStorage.setItem('cryptotracker_portfolio', JSON.stringify(updatedPortfolio));
    }
  };

  const getCryptocurrencyById = (id: string) => {
    return cryptocurrencies.find(crypto => crypto.id === id);
  };

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cryptotracker_watchlist');
    const savedPortfolio = localStorage.getItem('cryptotracker_portfolio');
    
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    
    fetchCryptocurrencies();
    
    // Set up periodic data refresh
    const interval = setInterval(fetchCryptocurrencies, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updatePortfolio();
  }, [cryptocurrencies]);

  const value = {
    cryptocurrencies,
    portfolio,
    watchlist,
    loading,
    searchQuery,
    setSearchQuery,
    addToWatchlist,
    removeFromWatchlist,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolio,
    fetchCryptocurrencies,
    getCryptocurrencyById,
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
};