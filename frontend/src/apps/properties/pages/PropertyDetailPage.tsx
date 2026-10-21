import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Card,
  Divider,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
  Slider,
  TextField,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Property } from '../../../shared/types';
import { propertyService } from '../../../shared/services/strapi';
import { formatPrice, createWhatsAppLink, calculateMonthlyPayment } from '../../../shared/utils/formatters';
import { InquiryModal } from '../../../shared/components/InquiryModal';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Mortgage Calculator State
  const [downPercent, setDownPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const interestRate = 12.5;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      propertyService.getBySlug(slug).then((data) => {
        setProperty(data || null);
        setActiveImageIndex(0);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#0D9488' }} />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Property Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This property listing may have expired, sold, or is currently under contract.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/properties')} sx={{ bgcolor: '#0D9488' }}>
          Back to Property Catalog
        </Button>
      </Container>
    );
  }

  const isSale = property.listingStatus === 'For Sale';
  const mortgageResult = calculateMonthlyPayment(property.price, downPercent, interestRate, loanTenureYears * 12);

  const whatsAppMessage = `Hello BK Properties, I would like to schedule a private viewing for "${property.title}" (Ref: ${property.refNumber}).`;
  const whatsappUrl = createWhatsAppLink('+254711000000', whatsAppMessage);

  return (
    <Box sx={{ py: 4, minHeight: '90vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/properties" underline="hover" color="inherit">
              Properties
            </Link>
            <Typography color="text.primary" fontWeight="600">
              {property.title}
            </Typography>
          </Breadcrumbs>
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: '#64748B' }}
          >
            Back
          </Button>
        </Box>

        {/* Title Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={property.listingStatus}
              size="small"
              sx={{ bgcolor: isSale ? '#CCFBF1' : '#EFF6FF', color: isSale ? '#0F766E' : '#1D4ED8', fontWeight: 800 }}
            />
            <Chip label={property.propertyType} variant="outlined" size="small" />
            <Chip label={`Ref: ${property.refNumber}`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569' }} />
          </Stack>
          <Typography variant="h4" fontWeight="800">
            {property.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: '#0D9488' }} />
            <Typography variant="body2">
              {property.location.address}, {property.location.suburb}, {property.location.county}
            </Typography>
          </Box>
        </Box>

        {/* Gallery & Sidebar Grid */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Main Gallery */}
          <Grid item xs={12} md={7.5}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 2, bgcolor: '#0F172A' }}>
              <Box
                component="img"
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                sx={{
                  width: '100%',
                  height: { xs: 280, sm: 440 },
                  objectFit: 'cover',
                }}
              />
            </Card>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
                {property.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setActiveImageIndex(idx)}
                    sx={{
                      width: 90,
                      height: 65,
                      borderRadius: 1.5,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: activeImageIndex === idx ? '3px solid #0D9488' : '2px solid transparent',
                      opacity: activeImageIndex === idx ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': { opacity: 1 },
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Key Specs Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                gap: 2,
                bgcolor: '#FFFFFF',
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                mt: 3,
              }}
            >
              {property.bedrooms !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                    <Typography variant="subtitle2" fontWeight="700">{property.bedrooms} Beds</Typography>
                  </Box>
                </Box>
              )}

              {property.bathrooms !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathtubIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                    <Typography variant="subtitle2" fontWeight="700">{property.bathrooms} Baths</Typography>
                  </Box>
                </Box>
              )}

              {property.areaSqFt !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SquareFootIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Floor Area</Typography>
                    <Typography variant="subtitle2" fontWeight="700">{property.areaSqFt.toLocaleString()} sq ft</Typography>
                  </Box>
                </Box>
              )}

              {property.parkingSpaces !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalParkingIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Parking</Typography>
                    <Typography variant="subtitle2" fontWeight="700">{property.parkingSpaces} Cars</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Pricing & Booking Sidebar */}
          <Grid item xs={12} md={4.5}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 90 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isSale ? 'Guide Price' : 'Monthly Rental'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
                {formatPrice(property.price, property.currency)}
                {!isSale && (
                  <Typography component="span" variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>
                    / month
                  </Typography>
                )}
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setModalOpen(true)}
                  startIcon={<CalendarMonthIcon />}
                  sx={{
                    bgcolor: '#0D9488',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    py: 1.3,
                    '&:hover': { bgcolor: '#0F766E' },
                  }}
                >
                  Schedule Private Viewing
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    bgcolor: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    py: 1.3,
                    '&:hover': { bgcolor: '#1EBE5D' },
                  }}
                >
                  WhatsApp Property Agent
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Verified Clean Title Deed (Ministry of Lands)</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Ready for immediate occupation / transfer</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Mortgage pre-approved with top Kenyan banks</span>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Description & Amenities */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            {/* Description */}
            <Card sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Property Description & Features
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8 }}>
                {property.description}
              </Typography>
            </Card>

            {/* Amenities Grid */}
            {property.amenities.length > 0 && (
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Amenities & Facilities
                </Typography>
                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  {property.amenities.map((amenity) => (
                    <Grid item xs={12} sm={6} key={amenity}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#0D9488', fontSize: 18 }} />
                        <Typography variant="body2">{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}
          </Grid>

          {/* Mortgage Estimator (For Sale properties) */}
          {isSale && (
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 1, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2 }}>
                    <CalculateIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Mortgage Repayment Estimator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commercial bank mortgage calculation (at {interestRate}% p.a.)
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        Down Payment: {downPercent}%
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: '#0D9488' }}>
                        {formatPrice(mortgageResult.downPaymentAmount)}
                      </Typography>
                    </Box>
                    <Slider
                      value={downPercent}
                      onChange={(_, val) => setDownPercent(val as number)}
                      min={10}
                      max={50}
                      step={5}
                      valueLabelDisplay="auto"
                      sx={{ color: '#0D9488' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        Mortgage Term: {loanTenureYears} Years
                      </Typography>
                    </Box>
                    <Slider
                      value={loanTenureYears}
                      onChange={(_, val) => setLoanTenureYears(val as number)}
                      min={5}
                      max={25}
                      step={5}
                      marks={[
                        { value: 5, label: '5 Yrs' },
                        { value: 15, label: '15 Yrs' },
                        { value: 25, label: '25 Yrs' },
                      ]}
                      sx={{ color: '#0D9488' }}
                    />
                  </Box>

                  <Box sx={{ bgcolor: '#0F172A', color: '#FFFFFF', p: 2.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Estimated Monthly Repayment
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2DD4BF', my: 0.5 }}>
                      {formatPrice(mortgageResult.monthlyPayment)}
                      <Typography component="span" variant="caption" sx={{ color: '#94A3B8', ml: 1 }}>
                        / month
                      </Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 1 }}>
                      Loan Principal: {formatPrice(mortgageResult.loanAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Schedule Viewing Modal */}
        <InquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule a Private Property Tour"
          inquiryType="property_viewing"
          itemId={property.id}
          itemTitle={property.title}
          themeColor="#0D9488"
        />
      </Container>
    </Box>
  );
};
