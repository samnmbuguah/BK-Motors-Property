import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'KES' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatAmount: (amountInKES: number) => string;
  convertToActive: (amountInKES: number) => number;
  exchangeRate: number; // KES per 1 USD
}

const EXCHANGE_RATE = 130; // Standard commercial bank midpoint

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('bk_currency');
    return saved === 'USD' ? 'USD' : 'KES';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('bk_currency', c);
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'KES' ? 'USD' : 'KES');
  };

  const convertToActive = (amountInKES: number): number => {
    if (currency === 'USD') {
      return Math.round(amountInKES / EXCHANGE_RATE);
    }
    return amountInKES;
  };

  const formatAmount = (amountInKES: number): string => {
    if (currency === 'USD') {
      const usdAmount = Math.round(amountInKES / EXCHANGE_RATE);
      return `$${usdAmount.toLocaleString('en-US')}`;
    }
    return `KES ${amountInKES.toLocaleString('en-KE')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatAmount,
        convertToActive,
        exchangeRate: EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
