'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Edit, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface PriceAlert {
  id: string;
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

const AlertsPage: React.FC = () => {
  const { cryptocurrencies } = useCrypto();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  // Load alerts from localStorage
  useEffect(() => {
    if (user) {
      const savedAlerts = localStorage.getItem(`cryptotracker_alerts_${user.id}`);
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
    }
  }, [user]);

  // Save alerts to localStorage
  const saveAlerts = (newAlerts: PriceAlert[]) => {
    if (user) {
      localStorage.setItem(`cryptotracker_alerts_${user.id}`, JSON.stringify(newAlerts));
      setAlerts(newAlerts);
    }
  };

  // Check alerts against current prices
  useEffect(() => {
    if (alerts.length > 0 && cryptocurrencies.length > 0) {
      const updatedAlerts = alerts.map(alert => {
        const crypto = cryptocurrencies.find(c => c.id === alert.cryptoId);
        if (crypto) {
          const shouldTrigger = alert.isActive && (
            (alert.condition === 'above' && crypto.current_price >= alert.targetPrice) ||
            (alert.condition === 'below' && crypto.current_price <= alert.targetPrice)
          );

          if (shouldTrigger) {
            toast.success(
              `Alert triggered! ${alert.cryptoSymbol.toUpperCase()} is ${alert.condition} $${alert.targetPrice}`,
              { duration: 6000 }
            );
            return { ...alert, isActive: false, currentPrice: crypto.current_price };
          }
          
          return { ...alert, currentPrice: crypto.current_price };
        }
        return alert;
      });

      if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
        saveAlerts(updatedAlerts);
      }
    }
  }, [cryptocurrencies, alerts]);

  const createAlert = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create alerts');
      return;
    }

    const crypto = cryptocurrencies.find(c => c.id === selectedCrypto);
    if (!crypto || !targetPrice) {
      toast.error('Please select a cryptocurrency and enter a target price');
      return;
    }

    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      cryptoId: crypto.id,
      cryptoName: crypto.name,
      cryptoSymbol: crypto.symbol,
      targetPrice: parseFloat(targetPrice),
      currentPrice: crypto.current_price,
      condition,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updatedAlerts = [...alerts, newAlert];
    saveAlerts(updatedAlerts);
    
    setShowCreateModal(false);
    setSelectedCrypto('');
    setTargetPrice('');
    toast.success('Price alert created successfully!');
  };

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    saveAlerts(updatedAlerts);
    toast.success('Alert deleted successfully!');
  };

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    saveAlerts(updatedAlerts);
    toast.success('Alert status updated!');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to create and manage price alerts
          </p>
          <button className="px-6 py-3 crypto-gradient text-white rounded-lg font-medium">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when cryptocurrencies reach your target prices
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 crypto-gradient text-white rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Create Alert</span>
        </motion.button>
      </motion.div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No price alerts yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first alert to get notified when prices reach your targets
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 crypto-gradient text-white rounded-lg font-medium"
          >
            Create Your First Alert
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card border rounded-lg p-6 ${
                alert.isActive ? 'border-border' : 'border-muted bg-muted/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">
                    {alert.cryptoSymbol.toUpperCase()}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.isActive 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {alert.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleAlert(alert.id)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <Bell className={`w-4 h-4 ${alert.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target Price:</span>
                  <span className="font-medium">${alert.targetPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Price:</span>
                  <span className="font-medium">${alert.currentPrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Condition:</span>
                  <div className="flex items-center space-x-1">
                    {alert.condition === 'above' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium capitalize">{alert.condition}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    {alert.condition === 'above' && alert.currentPrice >= alert.targetPrice && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {alert.condition === 'below' && alert.currentPrice <= alert.targetPrice && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Alert Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-card border border-border rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create Price Alert</h2>
              <p className="text-muted-foreground mt-1">
                Get notified when a cryptocurrency reaches your target price
              </p>
            </div>

            <form onSubmit={createAlert} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cryptocurrency</label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select a cryptocurrency</option>
                  {cryptocurrencies.slice(0, 50).map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol.toUpperCase()}) - ${crypto.current_price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter target price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alert Condition</label>
                <div className="flex space-x-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCondition('above')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      condition === 'above'
                        ? 'profit-gradient text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Above
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCondition('below')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      condition === 'below'
                        ? 'loss-gradient text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 inline mr-2" />
                    Below
                  </motion.button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 crypto-gradient text-white rounded-lg font-medium"
                >
                  Create Alert
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AlertsPage;