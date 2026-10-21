import React from 'react';
import { Box, Chip, ButtonGroup, Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface PortalSwitcherProps {
  currentPortal: 'motors' | 'properties';
  onSwitch: (portal: 'motors' | 'properties') => void;
}

export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({ currentPortal, onSwitch }) => {
  // If deployed in single-domain mode or dev mode, show switcher bar at the very top
  const isTargetForced = typeof __BUILD_TARGET__ !== 'undefined' && (__BUILD_TARGET__ === 'motors' || __BUILD_TARGET__ === 'properties');

  if (isTargetForced) {
    return null; // Production domain-isolated build
  }

  return (
    <Box
      sx={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        px: 2,
        py: 0.75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label="BK Unified Platform Preview"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
          }}
        />
        <span style={{ opacity: 0.7 }}>Toggle between independent portals:</span>
      </Box>

      <ButtonGroup size="small" variant="contained">
        <Button
          onClick={() => onSwitch('motors')}
          startIcon={<DirectionsCarIcon />}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            backgroundColor: currentPortal === 'motors' ? '#D97706' : 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: currentPortal === 'motors' ? '#B45309' : 'rgba(255,255,255,0.2)',
            },
          }}
        >
          BK Motors (Dealership)
        </Button>
        <Button
          onClick={() => onSwitch('properties')}
          startIcon={<ApartmentIcon />}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            backgroundColor: currentPortal === 'properties' ? '#0D9488' : 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: currentPortal === 'properties' ? '#0F766E' : 'rgba(255,255,255,0.2)',
            },
          }}
        >
          BK Properties (Real Estate)
        </Button>
      </ButtonGroup>
    </Box>
  );
};
