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
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleIcon from '@mui/icons-material/People';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import { inquiryService } from '../../../shared/services/strapi';
import { useAuth } from '../../../shared/context/AuthContext';

export const PropertyListPropertyPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, recordInquiry } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: user?.username || '',
    phone: '',
    email: user?.email || '',
    listingStatus: 'For Sale',
    propertyType: 'Apartment',
    title: '',
    suburb: 'Kilimani',
    address: '',
    price: '',
    bedrooms: '3',
    bathrooms: '2',
    description: '',
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
    if (!formData.ownerName || !formData.phone || !formData.title || !formData.price) {
      setError('Please provide your name, phone, property title, and asking price.');
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
        inquiryType: 'property_inquiry' as const,
        itemTitle: `Listing: [${formData.listingStatus}] ${formData.propertyType} - ${formData.title}`,
        message: `Property Listing Request: [${formData.listingStatus}] ${formData.propertyType} - ${formData.title}. Location: ${formData.address}, ${formData.suburb}. Price: KES ${formData.price}. Beds: ${formData.bedrooms}, Baths: ${formData.bathrooms}. Details: ${formData.description}`,
      };
      await inquiryService.submitInquiry(payload);
      await recordInquiry(payload);
      setSubmitted(true);
    } catch {
      setError('Unable to submit your listing request. Please contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 5 }}>
          <Typography variant="overline" color="#0D9488" fontWeight="700">
            LIST WITH NAIROBI’S ELITE AGENCY
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ mt: 1, mb: 2 }}>
            Sell Or Lease Your Property With BK Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gain immediate exposure to verified high-net-worth buyers, corporate tenants, diaspora investors, and embassy personnel across Kenya.
          </Typography>
        </Box>

        {/* Value Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Qualified Buyers & Tenants</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Pre-vetted buyers and multinational corporate tenants ready for immediate closing.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CameraAltIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Professional Media Production</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                High-definition photography, architectural drone footage, and targeted social campaigns.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, bgcolor: '#FFFFFF', textAlign: 'center' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: '50%', width: 50, height: 50, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VerifiedUserIcon />
              </Box>
              <Typography variant="h6" fontWeight="700">Full Legal Escrow Protection</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Protected transactions through licensed conveyancing advocates and legal frameworks.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Listing Form */}
        <Card sx={{ maxWidth: 840, mx: 'auto', p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <CardContent>
            {!isAuthenticated ? (
              <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: '#DCFCE7',
                    color: '#059669',
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
                  Sign In Required to List a Property
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540, mx: 'auto', mb: 3.5, lineHeight: 1.6 }}>
                  To maintain verified land title standards, protect property owners, and give you live dashboard tracking of buyer viewing requests and valuation updates, please sign in or register your account.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => openAuthModal('login')}
                  sx={{
                    bgcolor: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 4,
                    py: 1.3,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                    '&:hover': { bgcolor: '#047857' },
                  }}
                >
                  Sign In / Register to List Property
                </Button>
              </Box>
            ) : submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Your property details have been received and linked directly to your client account!
                </Alert>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Our property listing manager (Sarah Wanjiku) will contact you within 2 hours to confirm title details and schedule an HD photography and drone session.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: '#064E3B',
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
                    sx={{ color: '#059669', borderColor: '#059669', textTransform: 'none', fontWeight: 600 }}
                  >
                    List Another Property
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Property & Owner Information
                  </Typography>
                  <Chip
                    icon={<VerifiedUserIcon sx={{ fontSize: '15px !important', color: '#15803D !important' }} />}
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
                      label="Owner / Agent Full Name"
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
                    <FormControl fullWidth>
                      <InputLabel>Listing Type</InputLabel>
                      <Select
                        label="Listing Type"
                        name="listingStatus"
                        value={formData.listingStatus}
                        onChange={(e) => setFormData({ ...formData, listingStatus: e.target.value })}
                      >
                        <MenuItem value="For Sale">For Sale</MenuItem>
                        <MenuItem value="For Rent">For Rent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        label="Property Type"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      >
                        <MenuItem value="Apartment">Apartment</MenuItem>
                        <MenuItem value="Villa">Villa</MenuItem>
                        <MenuItem value="Townhouse">Townhouse</MenuItem>
                        <MenuItem value="Penthouse">Penthouse</MenuItem>
                        <MenuItem value="Land/Plot">Land / Plot</MenuItem>
                        <MenuItem value="Commercial">Commercial Office / Retail</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Property Title / Headline"
                      name="title"
                      placeholder="e.g. Elegant 4-Bedroom Villa with Swimming Pool"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Location / Suburb"
                      name="suburb"
                      placeholder="e.g. Karen, Kilimani, Westlands, Kileleshwa"
                      value={formData.suburb}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Asking Price (KES)"
                      name="price"
                      placeholder="e.g. 35,000,000"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Property Description & Amenities"
                      name="description"
                      placeholder="Describe key features: borehole, generator, garden size, service charge, etc."
                      value={formData.description}
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
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ApartmentIcon />}
                  sx={{
                    bgcolor: '#0D9488',
                    color: '#FFFFFF',
                    mt: 4,
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#0F766E' },
                  }}
                >
                  Submit Property for Review
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
