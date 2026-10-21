import React from 'react';
import { Box, Container, Typography, Grid, Link, Stack, Divider } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link as RouterLink } from 'react-router-dom';

export const MotorsFooter: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#0B132B', color: '#94A3B8', pt: 7, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ bgcolor: '#D97706', color: '#FFFFFF', p: 0.8, borderRadius: 2 }}>
                <DirectionsCarIcon />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                BK MOTORS KENYA
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 2.5 }}>
              Nairobi’s premier automotive dealership. Specializing in high-grade foreign used Japanese and European imports, verified clean local units, and customized vehicle financing.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Box
                component="a"
                href="https://wa.me/254700000000"
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
              Inventory
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/inventory" color="inherit" underline="hover">
                All Vehicles
              </Link>
              <Link component={RouterLink} to="/inventory?bodyType=SUV" color="inherit" underline="hover">
                SUVs & 4x4s
              </Link>
              <Link component={RouterLink} to="/inventory?bodyType=Sedan" color="inherit" underline="hover">
                Sedans & Saloons
              </Link>
              <Link component={RouterLink} to="/inventory?bodyType=Pickup" color="inherit" underline="hover">
                Pickups & Commercial
              </Link>
              <Link component={RouterLink} to="/inventory?condition=Foreign+Used" color="inherit" underline="hover">
                Foreign Imports
              </Link>
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Services
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/financing" color="inherit" underline="hover">
                Asset Financing
              </Link>
              <Link component={RouterLink} to="/sell" color="inherit" underline="hover">
                Sell Your Car
              </Link>
              <Link component={RouterLink} to="/sell" color="inherit" underline="hover">
                Trade-In Valuation
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                Import on Order
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                Vehicle Inspection
              </Link>
            </Stack>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Showrooms & Inquiries
            </Typography>
            <Stack spacing={1.5} sx={{ fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ color: '#D97706', fontSize: 20, mt: 0.2 }} />
                <span>Showroom 1: Ngong Road, opposite Adams Arcade, Nairobi</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ color: '#D97706', fontSize: 20, mt: 0.2 }} />
                <span>Showroom 2: Kiambu Road, near Ridgeview, Nairobi</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: '#D97706', fontSize: 18 }} />
                <span>+254 (0) 700 000 000 / +254 (0) 722 000 000</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: '#D97706', fontSize: 18 }} />
                <span>sales@bkmotors.co.ke</span>
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
          <span>&copy; {new Date().getFullYear()} BK Motors Limited. All rights reserved.</span>
          <span>Designed with TypeScript & MUI • cPanel Ready</span>
        </Box>
      </Container>
    </Box>
  );
};
