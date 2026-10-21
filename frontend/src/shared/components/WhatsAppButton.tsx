import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { createWhatsAppLink } from '../utils/formatters';

interface WhatsAppButtonProps {
  phone?: string;
  defaultMessage?: string;
  floating?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = '+254700000000',
  defaultMessage = 'Hello BK Group, I would like to make an inquiry.',
  floating = true,
}) => {
  const url = createWhatsAppLink(phone, defaultMessage);

  if (!floating) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <WhatsAppIcon sx={{ color: '#25D366' }} /> Chat on WhatsApp
        </span>
      </a>
    );
  }

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left" arrow>
      <Fab
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="whatsapp"
        sx={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          backgroundColor: '#25D366',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          zIndex: 1300,
          '&:hover': {
            backgroundColor: '#1EBE5D',
            transform: 'scale(1.06)',
            transition: 'all 0.2s ease',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Tooltip>
  );
};
