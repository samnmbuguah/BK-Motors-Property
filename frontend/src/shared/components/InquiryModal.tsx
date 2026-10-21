import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { InquiryFormData } from '../types';
import { inquiryService } from '../services/strapi';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  inquiryType: InquiryFormData['inquiryType'];
  itemId?: string | number;
  itemTitle?: string;
  themeColor?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  open,
  onClose,
  title,
  inquiryType,
  itemId,
  itemTitle,
  themeColor = '#D97706',
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    customerName: '',
    email: '',
    phone: '',
    message: itemTitle ? `I am interested in ${itemTitle}. Please provide further details.` : '',
    preferredContact: 'whatsapp',
    inquiryType,
    itemId,
    itemTitle,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setErrorMessage('Please fill in your name and phone number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await inquiryService.submitInquiry(formData);
      if (res.success) {
        setSubmitted(true);
      }
    } catch {
      setErrorMessage('Unable to send inquiry. Please reach out via WhatsApp or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSubmitted(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <IconButton aria-label="close" onClick={handleModalClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {submitted ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your inquiry has been received! Our representative will contact you shortly.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              If urgent, feel free to contact our direct sales desk via WhatsApp.
            </Typography>
          </Box>
        ) : (
          <Box component="form" id="inquiry-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {itemTitle && (
              <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">Item Reference:</Typography>
                <Typography variant="subtitle2" fontWeight="600">{itemTitle}</Typography>
              </Box>
            )}

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              required
              fullWidth
              label="Full Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              size="small"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                required
                label="Phone / WhatsApp Number"
                name="phone"
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
                size="small"
              />
              <TextField
                type="email"
                label="Email Address (Optional)"
                name="email"
                value={formData.email}
                onChange={handleChange}
                size="small"
              />
            </Box>

            <Box>
              <FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 0.5 }}>Preferred Contact Channel</FormLabel>
              <RadioGroup
                row
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
              >
                <FormControlLabel value="whatsapp" control={<Radio size="small" />} label="WhatsApp" />
                <FormControlLabel value="call" control={<Radio size="small" />} label="Phone Call" />
                <FormControlLabel value="email" control={<Radio size="small" />} label="Email" />
              </RadioGroup>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message or Special Request"
              name="message"
              value={formData.message}
              onChange={handleChange}
              size="small"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {submitted ? (
          <Button onClick={handleModalClose} variant="contained" sx={{ bgcolor: themeColor }}>
            Done
          </Button>
        ) : (
          <>
            <Button onClick={handleModalClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              form="inquiry-form"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
              sx={{ bgcolor: themeColor, '&:hover': { filter: 'brightness(0.9)' } }}
            >
              Submit Inquiry
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
