import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { Car, CarFilterState } from '../../../shared/types';
import { carService } from '../../../shared/services/strapi';
import { VehicleCard } from '../components/VehicleCard';
import { CarFilterBar } from '../components/CarFilterBar';
import { FinancingCalculator } from '../components/FinancingCalculator';
import { InquiryModal } from '../../../shared/components/InquiryModal';

export const MotorsHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilterState>({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    carService.getAll().then((data) => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set('search', filters.searchTerm);
    if (filters.make) params.set('make', filters.make);
    if (filters.bodyType) params.set('bodyType', filters.bodyType);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    navigate(`/inventory?${params.toString()}`);
  };

  const categories = [
    { title: 'SUVs & 4x4', query: 'SUV', count: '18 Units Available' },
    { title: 'Executive Sedans', query: 'Sedan', count: '12 Units Available' },
    { title: 'Pickups & Vans', query: 'Pickup', count: '9 Units Available' },
    { title: 'Foreign Direct Imports', query: 'Foreign Used', count: '25 Units Available' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#0B132B',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.22) 0%, transparent 50%), linear-gradient(180deg, #0B132B 0%, #1E293B 100%)',
          color: '#FFFFFF',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: 760, mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#F59E0B',
                fontWeight: 800,
                letterSpacing: '0.15em',
                fontSize: '0.85rem',
              }}
            >
              NAIROBI’S TRUSTED AUTOMOTIVE DESTINATION
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                fontWeight: 800,
                lineHeight: 1.12,
                mt: 1,
                mb: 2.5,
              }}
            >
              Drive Away In Your Next Vehicle with Confidence.
            </Typography>
            <Typography variant="body1" sx={{ color: '#CBD5E1', fontSize: '1.15rem', lineHeight: 1.6, mb: 3 }}>
              Explore certified foreign Japanese & UK imports and clean local verified cars. Enjoy competitive bank asset financing up to 80% and hassle-free trade-in options.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/inventory')}
                sx={{
                  bgcolor: '#D97706',
                  color: '#FFFFFF',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#B45309' },
                }}
              >
                Browse Inventory
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/sell')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Sell or Trade-In Car
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Floating Filter Bar */}
      <Container maxWidth="lg" sx={{ mt: { xs: -7, md: -9 }, position: 'relative', zIndex: 10, mb: 7 }}>
        <CarFilterBar filter={filters} onFilterChange={setFilters} onSearch={handleSearch} />
      </Container>

      {/* Categories Grid */}
      <Container maxWidth="lg" sx={{ mb: 7 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2.5 }}>
          Browse by Vehicle Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.title}>
              <Card
                onClick={() => navigate(`/inventory?filter=${encodeURIComponent(cat.query)}`)}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: '#FFFFFF',
                  '&:hover': { borderColor: '#D97706' },
                }}
              >
                <Typography variant="subtitle1" fontWeight="700">
                  {cat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cat.count}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Inventory Section */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography variant="overline" color="#D97706" fontWeight="700">
              HANDPICKED SELECTION
            </Typography>
            <Typography variant="h4" fontWeight="800">
              Featured Showroom Arrivals
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/inventory')}
            sx={{ color: '#D97706', fontWeight: 700 }}
          >
            View All ({cars.length})
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {cars.slice(0, 6).map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <VehicleCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Value Proposition / Why Buy From BK Motors */}
      <Box sx={{ bgcolor: '#F1F5F9', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
            <Typography variant="overline" color="#D97706" fontWeight="700">
              THE BK MOTORS ADVANTAGE
            </Typography>
            <Typography variant="h4" fontWeight="800">
              Why Car Buyers in Kenya Choose Us
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                  <VerifiedIcon />
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  150-Point Inspection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every vehicle undergoes comprehensive mechanical, chassis, and electronic diagnostic inspection before listing.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                  <AccountBalanceIcon />
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  Up to 80% Bank Financing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Partnered with top tier-one Kenyan banks (NCBA, Stanbic, KCB, Equity, Co-op) with rapid approvals within 48 hours.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                  <HandshakeIcon />
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  Instant Trade-In
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bring your existing car for valuation and offset the value towards upgrading to your next dream ride seamlessly.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                  <LocalShippingIcon />
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  Direct Import On Order
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Looking for a rare spec? We import directly from verified Japanese auctions and UK dealers directly to Mombasa port.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Financing Calculator Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <FinancingCalculator onApply={() => setModalOpen(true)} />
      </Container>

      {/* Sell Your Car Banner */}
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: '#0F172A',
            color: '#FFFFFF',
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              Planning to Sell or Consign Your Vehicle?
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8' }}>
              Get verified market valuation and showcase your car to thousands of qualified buyers across Kenya without stress.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/sell')}
            sx={{
              bgcolor: '#D97706',
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#B45309' },
            }}
          >
            Submit Your Car Details
          </Button>
        </Box>
      </Container>

      {/* Financing Application Modal */}
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply for Vehicle Asset Financing"
        inquiryType="car_purchase"
        themeColor="#D97706"
      />
    </Box>
  );
};
