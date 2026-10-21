import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { inquiryService } from '../../../shared/services/strapi';
import { createWhatsAppLink } from '../../../shared/utils/formatters';

export const MotorsContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await inquiryService.submitInquiry({
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
      preferredContact: 'whatsapp',
      inquiryType: 'car_purchase',
    });
    setLoading(false);
    setSubmitted(true);
  };

  const directWhatsapp = createWhatsAppLink('+254700000000', 'Hello BK Motors, I would like to talk with a sales representative.');

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
          <Typography variant="overline" color="#D97706" fontWeight="700">
            CONNECT WITH OUR SALES SPECIALISTS
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ mt: 1, mb: 2 }}>
            Visit Our Showrooms or Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our experienced team is on standby to assist with vehicle inspections, asset financing pre-approvals, and test drives.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Showroom Details */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Ngong Road Showroom (Head Office)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: 'text.secondary', mt: 1 }}>
                  <LocationOnIcon sx={{ color: '#D97706', mt: 0.3 }} />
                  <Typography variant="body2">
                    Opposite Adams Arcade, Ngong Road, Nairobi, Kenya
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', mt: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#D97706', fontSize: 20 }} />
                  <Typography variant="body2">Monday – Saturday: 8:00 AM – 6:00 PM</Typography>
                </Box>
              </Card>

              <Card sx={{ p: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Kiambu Road Branch
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: 'text.secondary', mt: 1 }}>
                  <LocationOnIcon sx={{ color: '#D97706', mt: 0.3 }} />
                  <Typography variant="body2">
                    Adjacent to Ridgeview Gardens, Kiambu Road, Nairobi
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', mt: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#D97706', fontSize: 20 }} />
                  <Typography variant="body2">Monday – Saturday: 8:30 AM – 6:00 PM</Typography>
                </Box>
              </Card>

              <Card sx={{ p: 3, bgcolor: '#0F172A', color: '#FFFFFF', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFFFFF' }} gutterBottom>
                  Direct Telephone & WhatsApp
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIcon sx={{ color: '#D97706' }} />
                    <Typography variant="body2">+254 (0) 700 000 000 / +254 (0) 722 000 000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EmailIcon sx={{ color: '#D97706' }} />
                    <Typography variant="body2">sales@bkmotors.co.ke</Typography>
                  </Box>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  href={directWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WhatsAppIcon />}
                  sx={{ bgcolor: '#25D366', color: '#FFFFFF', mt: 3, fontWeight: 700, '&:hover': { bgcolor: '#1EBE5D' } }}
                >
                  Start Live WhatsApp Chat
                </Button>
              </Card>
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 4, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Send a Direct Message
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Leave your details and request below; our representative will respond within 30 minutes during showroom hours.
                </Typography>

                {submitted ? (
                  <Alert severity="success" sx={{ py: 3 }}>
                    Thank you! Your message has been sent. We will get back to you immediately.
                  </Alert>
                ) : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      required
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Phone Number"
                          placeholder="+254 7XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Email Address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label="Message / Inquired Vehicle"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{ bgcolor: '#D97706', color: '#FFFFFF', py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#B45309' } }}
                    >
                      Send Message
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
