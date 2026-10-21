import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CurrencyToggle } from '../../../shared/components/CurrencyToggle';
import { ShortlistDrawer } from '../../../shared/components/ShortlistDrawer';
import { useFavorites } from '../../../shared/context/FavoritesContext';

export const PropertyNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const { favoritePropertyIds } = useFavorites();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties For Sale', path: '/properties?status=For+Sale' },
    { label: 'Properties For Rent', path: '/properties?status=For+Rent' },
    { label: 'Land & Plots', path: '/properties?type=Land%2FPlot' },
    { label: 'List Property', path: '/list' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <Box sx={{ bgcolor: '#0F172A', color: '#94A3B8', py: 0.75, fontSize: '0.78rem' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 15, color: '#0D9488' }} />
              <span>Westlands & Karen, Nairobi, Kenya</span>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <span>Mon - Sat: 8:30 AM - 5:30 PM</span>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CurrencyToggle size="small" />
            <Box
              component="a"
              href="tel:+254711000000"
              sx={{ color: '#E2E8F0', textDecoration: 'none', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}
            >
              <PhoneIcon sx={{ fontSize: 14, color: '#0D9488' }} />
              <span>+254 711 000 000</span>
            </Box>
            <Box
              component="a"
              href="https://wa.me/254711000000"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#25D366',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 600,
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 15 }} />
              <span>WhatsApp Agency</span>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: '#FFFFFF', color: '#0F172A', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 74 }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                textDecoration: 'none',
                color: '#0F172A',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#0D9488',
                  color: '#FFFFFF',
                  p: 0.9,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ApartmentIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  BK PROPERTIES
                </Typography>
                <Typography variant="caption" sx={{ color: '#0D9488', fontWeight: 700, letterSpacing: '0.12em' }}>
                  PRIME REAL ESTATE KENYA
                </Typography>
              </Box>
            </Box>

            {/* Desktop Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#334155',
                      fontWeight: 600,
                      px: 1.8,
                      py: 1,
                      '&:hover': { color: '#0D9488', bgcolor: 'transparent' },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {/* Shortlist Icon Button */}
                <IconButton onClick={() => setShortlistOpen(true)} sx={{ color: '#0F172A', ml: 0.5 }}>
                  <Badge badgeContent={favoritePropertyIds.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#0D9488' } }}>
                    <FavoriteIcon sx={{ color: favoritePropertyIds.length > 0 ? '#0D9488' : '#94A3B8' }} />
                  </Badge>
                </IconButton>

                <Button
                  variant="contained"
                  onClick={() => navigate('/list')}
                  sx={{
                    bgcolor: '#0F172A',
                    color: '#FFFFFF',
                    ml: 1.5,
                    px: 2.5,
                    '&:hover': { bgcolor: '#1E293B' },
                  }}
                >
                  List Property
                </Button>
              </Box>
            )}

            {/* Mobile Actions */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton onClick={() => setShortlistOpen(true)} size="small">
                  <Badge badgeContent={favoritePropertyIds.length} color="primary">
                    <FavoriteIcon sx={{ fontSize: 22, color: favoritePropertyIds.length > 0 ? '#0D9488' : '#64748B' }} />
                  </Badge>
                </IconButton>
                <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Shortlist Drawer */}
      <ShortlistDrawer open={shortlistOpen} onClose={() => setShortlistOpen(false)} portal="properties" />

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 270, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#0D9488' }}>
            BK PROPERTIES
          </Typography>
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                component={RouterLink}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{ textDecoration: 'none', color: '#0F172A' }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <ListItem sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/list');
                }}
                sx={{ bgcolor: '#0D9488', color: '#FFFFFF' }}
              >
                List Your Property
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
