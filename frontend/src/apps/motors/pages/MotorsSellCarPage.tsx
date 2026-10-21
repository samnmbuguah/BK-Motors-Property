import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { inquiryService } from '../../../shared/services/strapi';
import { useAuth } from '../../../shared/context/AuthContext';

export const MotorsSellCarPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, recordInquiry } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: user?.username || '',
    phone: '',
    email: user?.email || '',
    make: '',
    model: '',
    year: 2018,
    mileage: '',
    expectedPrice: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    location: 'Nairobi',
    comments: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.username,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.phone || !formData.make || !formData.model) {
      setError('Please provide your name, phone, vehicle make, and model.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        customerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        preferredContact: 'whatsapp' as const,
        inquiryType: 'sell_car' as const,
        itemTitle: `Consignment: ${formData.year} ${formData.make} ${formData.model}`,
        message: `Sell/Consign Car Request: ${formData.year} ${formData.make} ${formData.model}, Mileage: ${formData.mileage} km, Asking: KES ${formData.expectedPrice}, City: ${formData.location}. Notes: ${formData.comments}`,
      };
      await inquiryService.submitInquiry(payload);
      await recordInquiry(payload);
      setSubmitted(true);
    } catch {
      setError('Unable to submit your car details. Please reach out via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 5 }}>
          <Typography variant="overline" color="#D97706" fontWeight="700">
            HASSLE-FREE CAR SALES & TRADE-IN
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ mt: 1, mb: 2 }}>
            Sell Or Consign Your Car With BK Motors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get your vehicle appraised at fair market valuation. Choose between an instant cash buyout or premium showroom consignment for maximum return.
          </Typography>
        </Box>

        {/* Benefits Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SpeedIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Rapid Valuation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Receive an initial market valuation within 2 hours of submitting your vehicle specs.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonetizationOnIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Top Market Value</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                We tap into verified buyers nationwide, helping you achieve true market price.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VerifiedIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Safe & Legitimate</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Secure escrow payment through verified Kenyan commercial banks and official NTSA transfer.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Form Container */}
        <Card sx={{ maxWidth: 800, mx: 'auto', p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <CardContent>
            {!isAuthenticated ? (
              <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: '#FEF3C7',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" fontWeight="800" sx={{ mb: 1.5, color: '#0F172A' }}>
                  Sign In Required to Consign or Sell Your Car
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540, mx: 'auto', mb: 3.5, lineHeight: 1.6 }}>
                  To guarantee verified logbook transfers, secure escrow settlements, and allow you to track your 150-point inspection progress and buyer offers in real time, please log in or create a client account.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => openAuthModal('login')}
                  sx={{
                    bgcolor: '#D97706',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 4,
                    py: 1.3,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                    '&:hover': { bgcolor: '#B45309' },
                  }}
                >
                  Sign In / Create Account to Continue
                </Button>
              </Box>
            ) : submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Your vehicle details have been received and logged directly into your client account!
                </Alert>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Our appraisal manager (James Kamau) will review your submission and contact you within 2 business hours for the physical 150-point inspection.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: '#0F172A',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Track in My Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSubmitted(false)}
                    sx={{ color: '#D97706', borderColor: '#D97706', textTransform: 'none', fontWeight: 600 }}
                  >
                    Submit Another Vehicle
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Vehicle & Appraisal Details
                  </Typography>
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: '15px !important', color: '#15803D !important' }} />}
                    label={`Verified Client: ${user?.username}`}
                    size="small"
                    sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }}
                  />
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Your Name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Phone / WhatsApp Number"
                      name="phone"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Vehicle Make"
                      name="make"
                      placeholder="e.g. Toyota, Subaru, Mercedes"
                      value={formData.make}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Model & Trim"
                      name="model"
                      placeholder="e.g. Land Cruiser Prado TX-L"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Year of Manufacture"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Mileage (Kilometers)"
                      name="mileage"
                      placeholder="e.g. 65,000"
                      value={formData.mileage}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Asking Price (KES)"
                      name="expectedPrice"
                      placeholder="e.g. 4,500,000"
                      value={formData.expectedPrice}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Transmission</InputLabel>
                      <Select
                        label="Transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      >
                        <MenuItem value="Automatic">Automatic</MenuItem>
                        <MenuItem value="Manual">Manual</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Location (City / Suburb)"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Additional Notes / Condition / Photos Link"
                      name="comments"
                      placeholder="Mention any upgrades, service records, or paste a Google Drive link with photos"
                      value={formData.comments}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DirectionsCarIcon />}
                  sx={{
                    bgcolor: '#D97706',
                    color: '#FFFFFF',
                    mt: 4,
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#B45309' },
                  }}
                >
                  Submit For Valuation
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
