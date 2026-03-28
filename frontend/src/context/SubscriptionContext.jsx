import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await api.get('/subscriptions/status');
          setSubscription(data.data);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
      setIsLoading(false);
    };

    fetchStatus();
  }, [isAuthenticated, user]);

  const isActive = subscription?.status === 'active';
  const plan = subscription?.plan || null;
  const renewalDate = subscription?.currentPeriodEnd || null;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isActive,
        plan,
        renewalDate,
        isLoading,
        setSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
