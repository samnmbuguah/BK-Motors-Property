import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyFilterState } from '../../../shared/types';
import { propertyService } from '../../../shared/services/strapi';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilterBar } from '../components/PropertyFilterBar';
import { InquiryModal } from '../../../shared/components/InquiryModal';

export const PropertyHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilterState>({ listingStatus: 'For Sale' });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    propertyService.getAll().then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set('search', filters.searchTerm);
    if (filters.listingStatus) params.set('status', filters.listingStatus);
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.suburb) params.set('suburb', filters.suburb);
    if (filters.minBedrooms) params.set('beds', filters.minBedrooms.toString());
    navigate(`/properties?${params.toString()}`);
  };

  const neighborhoods = [
    { name: 'Karen', desc: 'Serene luxury villas, lush acreage & premier international schools', count: '14 Listings' },
    { name: 'Kilimani', desc: 'Vibrant modern apartments, high rental yield & cosmopolitan hub', count: '28 Listings' },
    { name: 'Westlands', desc: 'Executive high-rises, commercial towers & nightlife destination', count: '19 Listings' },
    { name: 'Runda & Gigiri', desc: 'Diplomatic enclave, secure gated mansions & UN zone', count: '11 Listings' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#0F172A',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.25) 0%, transparent 60%), linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
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
                color: '#2DD4BF',
                fontWeight: 800,
                letterSpacing: '0.15em',
                fontSize: '0.85rem',
              }}
            >
              PREMIER REAL ESTATE PORTFOLIO
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
              Discover Exceptional Properties In Kenya’s Finest Locations.
            </Typography>
            <Typography variant="body1" sx={{ color: '#CBD5E1', fontSize: '1.15rem', lineHeight: 1.6, mb: 3 }}>
              From bespoke architectural villas in Karen to high-yielding contemporary penthouses in Kilimani and commercial redevelopment plots.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/properties?status=For+Sale')}
                sx={{
                  bgcolor: '#0D9488',
                  color: '#FFFFFF',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#0F766E' },
                }}
              >
                Browse Properties
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/list')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                List Your Property
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Floating Filter Bar */}
      <Container maxWidth="lg" sx={{ mt: { xs: -7, md: -9 }, position: 'relative', zIndex: 10, mb: 7 }}>
        <PropertyFilterBar filter={filters} onFilterChange={setFilters} onSearch={handleSearch} />
      </Container>

      {/* Featured Properties Showcase */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography variant="overline" color="#0D9488" fontWeight="700">
              PRIME COLLECTION
            </Typography>
            <Typography variant="h4" fontWeight="800">
              Featured Properties For Sale & Rent
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/properties')}
            sx={{ color: '#0D9488', fontWeight: 700 }}
          >
            View All ({properties.length})
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {properties.slice(0, 6).map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Prime Suburbs Grid */}
      <Box sx={{ bgcolor: '#F1F5F9', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
            <Typography variant="overline" color="#0D9488" fontWeight="700">
              EXPLORE NAIROBI
            </Typography>
            <Typography variant="h4" fontWeight="800">
              Featured Suburbs & Enclaves
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {neighborhoods.map((n) => (
              <Grid item xs={12} sm={6} md={3} key={n.name}>
                <Card
                  onClick={() => navigate(`/properties?suburb=${encodeURIComponent(n.name)}`)}
                  sx={{
                    p: 3,
                    height: '100%',
                    bgcolor: '#FFFFFF',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#0D9488' },
                  }}
                >
                  <Typography variant="h6" fontWeight="700" color="#0D9488" gutterBottom>
                    {n.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {n.desc}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" color="primary">
                    {n.count} →
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trust & Due Diligence */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
          <Typography variant="overline" color="#0D9488" fontWeight="700">
            INVEST WITH ABSOLUTE CONFIDENCE
          </Typography>
          <Typography variant="h4" fontWeight="800">
            The BK Properties Standard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                <ShieldIcon />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Rigorous Title Due Diligence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We independently verify official Ministry of Lands searches, Ndung'u report clearance, and survey beacons before listing any property.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                <TrendingUpIcon />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                High Rental Yields
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our portfolio focuses on high capital growth corridors in Nairobi with average net rental yields between 8.5% and 12% p.a.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                <GavelIcon />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Conveyancing & Legal Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In-house panel advocates ensure smooth title deed transfer, escrow protection, and compliance with the Sectional Properties Act.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 1.5, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2, width: 'fit-content', mb: 2 }}>
                <HomeWorkIcon />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Turnkey Property Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From vetting high-caliber corporate tenants to service charge collection and maintenance, we offer end-to-end management for diaspora and local investors.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Schedule Consultation Banner */}
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
          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              Looking to Buy, Sell, or Invest in Real Estate?
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8' }}>
              Book a private advisory session with our senior property consultants or schedule a VIP site viewing across our prime developments.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => setModalOpen(true)}
            sx={{
              bgcolor: '#0D9488',
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#0F766E' },
            }}
          >
            Schedule Private Consultation
          </Button>
        </Box>
      </Container>

      {/* General Inquiry Modal */}
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Private Real Estate Advisory"
        inquiryType="property_inquiry"
        themeColor="#0D9488"
      />
    </Box>
  );
};
