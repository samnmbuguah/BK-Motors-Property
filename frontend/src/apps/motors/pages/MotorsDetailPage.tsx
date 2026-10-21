import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
  IconButton,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Car } from '../../../shared/types';
import { carService } from '../../../shared/services/strapi';
import { formatMileage, createWhatsAppLink } from '../../../shared/utils/formatters';
import { useCurrency } from '../../../shared/context/CurrencyContext';
import { useFavorites } from '../../../shared/context/FavoritesContext';
import { FinancingCalculator } from '../components/FinancingCalculator';
import { InquiryModal } from '../../../shared/components/InquiryModal';

export const MotorsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();
  const { isCarFavorite, toggleFavoriteCar } = useFavorites();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryType, setInquiryType] = useState<'car_purchase' | 'test_drive'>('car_purchase');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      carService.getBySlug(slug).then((data) => {
        setCar(data || null);
        setActiveImageIndex(0);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!car) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Vehicle Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The car you are looking for may have been sold or reserved.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/inventory')} sx={{ bgcolor: '#D97706' }}>
          Back to Inventory
        </Button>
      </Container>
    );
  }

  const isFavorited = isCarFavorite(car.id);
  const whatsAppText = `Hello BK Motors, I would like to inquire about the ${car.year} ${car.make} ${car.model} (${car.refNumber}) priced at ${formatAmount(car.price)}. Is it available for viewing?`;
  const whatsappUrl = createWhatsAppLink('+254700000000', whatsAppText);

  return (
    <Box sx={{ py: 4, minHeight: '90vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/inventory" underline="hover" color="inherit">
              Inventory
            </Link>
            <Typography color="text.primary" fontWeight="600">
              {car.make} {car.model}
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
          <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
            <Chip label={car.condition} color="primary" size="small" sx={{ fontWeight: 700 }} />
            <Chip label={`Ref: ${car.refNumber}`} variant="outlined" size="small" />
            <Chip label={car.status} size="small" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 600 }} />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight="800">
                {car.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: '#D97706' }} />
                <Typography variant="body2">{car.location}</Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => toggleFavoriteCar(car.id)}
              sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' }, p: 1.2 }}
            >
              {isFavorited ? <FavoriteIcon sx={{ color: '#EF4444' }} /> : <FavoriteBorderIcon sx={{ color: '#64748B' }} />}
            </IconButton>
          </Box>
        </Box>

        {/* Gallery & Sidebar Grid */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Main Photo Gallery */}
          <Grid item xs={12} md={7.5}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 2, bgcolor: '#0F172A' }}>
              <Box
                component="img"
                src={car.images[activeImageIndex] || car.images[0]}
                alt={car.title}
                sx={{
                  width: '100%',
                  height: { xs: 260, sm: 420 },
                  objectFit: 'cover',
                }}
              />
            </Card>

            {/* Thumbnail Strip */}
            {car.images.length > 1 && (
              <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
                {car.images.map((img, idx) => (
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
                      border: activeImageIndex === idx ? '3px solid #D97706' : '2px solid transparent',
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon sx={{ color: '#D97706' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Year</Typography>
                  <Typography variant="subtitle2" fontWeight="700">{car.year}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: '#D97706' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Mileage</Typography>
                  <Typography variant="subtitle2" fontWeight="700">{formatMileage(car.mileage)}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalGasStationIcon sx={{ color: '#D97706' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Engine & Fuel</Typography>
                  <Typography variant="subtitle2" fontWeight="700">{car.engineCC}cc • {car.fuelType}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon sx={{ color: '#D97706' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Transmission</Typography>
                  <Typography variant="subtitle2" fontWeight="700">{car.transmission}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Action Price Box */}
          <Grid item xs={12} md={4.5}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 90 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cash Price (Negotiable)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
                {formatAmount(car.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Asset financing available from approx. <strong>{formatAmount(Math.round(car.price * 0.026))}/mo</strong>
              </Typography>

              <Stack spacing={1.5}>
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
                  Inquire on WhatsApp
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setInquiryType('test_drive');
                    setModalOpen(true);
                  }}
                  startIcon={<DirectionsCarIcon />}
                  sx={{
                    bgcolor: '#0F172A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    py: 1.3,
                    '&:hover': { bgcolor: '#1E293B' },
                  }}
                >
                  Book a Test Drive
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setInquiryType('car_purchase');
                    setModalOpen(true);
                  }}
                  sx={{
                    borderColor: '#CBD5E1',
                    color: '#0F172A',
                    fontWeight: 600,
                    '&:hover': { borderColor: '#D97706', bgcolor: 'transparent' },
                  }}
                >
                  Make an Offer / Trade-In
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
                  <span>Logbook ready / Direct importation clearance</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
                  <span>30-Day Dealership Mechanical Warranty</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
                  <span>Pre-purchase independent inspection allowed</span>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Specs & Features Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            {/* Description */}
            <Card sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Dealer Overview & Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8 }}>
                {car.description}
              </Typography>
            </Card>

            {/* Specifications Table */}
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Technical Specifications
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Make</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{car.make}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{car.model}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Year of Manufacture</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Trim Package</TableCell>
                    <TableCell>{car.trim || 'Standard'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Engine Displacement</TableCell>
                    <TableCell>{car.engineCC} CC</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Fuel System</TableCell>
                    <TableCell>{car.fuelType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Transmission</TableCell>
                    <TableCell>{car.transmission}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Drivetrain</TableCell>
                    <TableCell>{car.driveType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Exterior Color</TableCell>
                    <TableCell>{car.exteriorColor}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Interior Color</TableCell>
                    <TableCell>{car.interiorColor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Body Style</TableCell>
                    <TableCell>{car.bodyType}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Condition</TableCell>
                    <TableCell>{car.condition}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            {/* Installed Equipment / Features */}
            {car.features.length > 0 && (
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Features & Accessories
                </Typography>
                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  {car.features.map((feat) => (
                    <Grid item xs={12} sm={6} key={feat}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#D97706', fontSize: 18 }} />
                        <Typography variant="body2">{feat}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}
          </Grid>

          {/* Financing Calculator */}
          <Grid item xs={12} md={5}>
            <FinancingCalculator initialPrice={car.price} onApply={() => setModalOpen(true)} />
          </Grid>
        </Grid>

        {/* Modal for Inquiries & Test Drives */}
        <InquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={inquiryType === 'test_drive' ? 'Book a Test Drive' : 'Inquire About Vehicle'}
          inquiryType={inquiryType}
          itemId={car.id}
          itemTitle={`${car.year} ${car.make} ${car.model} (${car.refNumber})`}
          themeColor="#D97706"
        />
      </Container>
    </Box>
  );
};
