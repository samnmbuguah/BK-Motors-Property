import React from 'react';
import { Box, Container, Typography, Grid, Link, Stack, Divider } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link as RouterLink } from 'react-router-dom';

export const PropertyFooter: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#0F172A', color: '#94A3B8', pt: 7, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ bgcolor: '#0D9488', color: '#FFFFFF', p: 0.8, borderRadius: 2 }}>
                <ApartmentIcon />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                BK PROPERTIES KENYA
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 2.5 }}>
              Specialists in luxury real estate, off-plan residential developments, commercial investments, and prime land plots in Nairobi and the Kenyan coast.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Box
                component="a"
                href="https://wa.me/254711000000"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#25D366',
                  color: '#FFFFFF',
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </Box>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Properties
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/properties?status=For+Sale" color="inherit" underline="hover">
                Homes For Sale
              </Link>
              <Link component={RouterLink} to="/properties?status=For+Rent" color="inherit" underline="hover">
                Homes For Rent
              </Link>
              <Link component={RouterLink} to="/properties?type=Villa" color="inherit" underline="hover">
                Luxury Villas
              </Link>
              <Link component={RouterLink} to="/properties?type=Penthouse" color="inherit" underline="hover">
                Penthouses
              </Link>
              <Link component={RouterLink} to="/properties?type=Land%2FPlot" color="inherit" underline="hover">
                Development Land
              </Link>
            </Stack>
          </Grid>

          {/* Popular Locations */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Prime Suburbs
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/properties?suburb=Karen" color="inherit" underline="hover">
                Karen
              </Link>
              <Link component={RouterLink} to="/properties?suburb=Kilimani" color="inherit" underline="hover">
                Kilimani
              </Link>
              <Link component={RouterLink} to="/properties?suburb=Westlands" color="inherit" underline="hover">
                Westlands
              </Link>
              <Link component={RouterLink} to="/properties?suburb=Kileleshwa" color="inherit" underline="hover">
                Kileleshwa
              </Link>
              <Link component={RouterLink} to="/properties?suburb=Runda" color="inherit" underline="hover">
                Runda
              </Link>
            </Stack>
          </Grid>

          {/* Office Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Agency Office & Inquiries
            </Typography>
            <Stack spacing={1.5} sx={{ fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ color: '#0D9488', fontSize: 20, mt: 0.2 }} />
                <span>The Mirage Tower 2, 7th Floor, Chiromo Road, Westlands, Nairobi</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: '#0D9488', fontSize: 18 }} />
                <span>+254 (0) 711 000 000 / +254 (0) 733 000 000</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: '#0D9488', fontSize: 18 }} />
                <span>info@bkproperties.co.ke</span>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            gap: 1,
          }}
        >
          <span>&copy; {new Date().getFullYear()} BK Properties Kenya Ltd. Registered Real Estate Agent.</span>
          <span>Dual Portal Monorepo Architecture • cPanel Ready</span>
        </Box>
      </Container>
    </Box>
  );
};
