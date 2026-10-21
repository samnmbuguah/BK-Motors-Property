import React from 'react';
import { ButtonGroup, Button } from '@mui/material';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencyToggleProps {
  color?: string;
  size?: 'small' | 'medium';
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ size = 'small' }) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <ButtonGroup size={size} variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
      <Button
        onClick={() => setCurrency('KES')}
        sx={{
          fontSize: '0.72rem',
          px: 1.2,
          py: 0.3,
          minWidth: 'auto',
          fontWeight: currency === 'KES' ? 800 : 500,
          color: currency === 'KES' ? '#FFFFFF' : '#94A3B8',
          bgcolor: currency === 'KES' ? 'rgba(255,255,255,0.2)' : 'transparent',
          border: 'none !important',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
        }}
      >
        KES
      </Button>
      <Button
        onClick={() => setCurrency('USD')}
        sx={{
          fontSize: '0.72rem',
          px: 1.2,
          py: 0.3,
          minWidth: 'auto',
          fontWeight: currency === 'USD' ? 800 : 500,
          color: currency === 'USD' ? '#FFFFFF' : '#94A3B8',
          bgcolor: currency === 'USD' ? 'rgba(255,255,255,0.2)' : 'transparent',
          border: 'none !important',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
        }}
      >
        USD ($)
      </Button>
    </ButtonGroup>
  );
};
