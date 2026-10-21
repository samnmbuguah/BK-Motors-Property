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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CurrencyToggle } from '../../../shared/components/CurrencyToggle';
import { ShortlistDrawer } from '../../../shared/components/ShortlistDrawer';
import { useFavorites } from '../../../shared/context/FavoritesContext';

export const MotorsNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const { favoriteCarIds } = useFavorites();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Sell Your Car', path: '/sell' },
    { label: 'Financing', path: '/financing' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar (Motifiti Style) */}
      <Box sx={{ bgcolor: '#0F172A', color: '#94A3B8', py: 0.75, fontSize: '0.78rem' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 15, color: '#D97706' }} />
              <span>Ngong Road & Kiambu Road, Nairobi</span>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CurrencyToggle size="small" />
            <Box
              component="a"
              href="tel:+254700000000"
              sx={{ color: '#E2E8F0', textDecoration: 'none', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}
            >
              <PhoneIcon sx={{ fontSize: 14, color: '#D97706' }} />
              <span>+254 700 000 000</span>
            </Box>
            <Box
              component="a"
              href="https://wa.me/254700000000"
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
              <span>WhatsApp Us</span>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: '#FFFFFF', color: '#0F172A', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 72 }}>
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
                  bgcolor: '#D97706',
                  color: '#FFFFFF',
                  p: 0.8,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  BK MOTORS
                </Typography>
                <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700, letterSpacing: '0.1em' }}>
                  PREMIUM DEALERSHIP
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
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
                      px: 2,
                      py: 1,
                      '&:hover': { color: '#D97706', bgcolor: 'transparent' },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {/* Shortlist Icon Button */}
                <IconButton onClick={() => setShortlistOpen(true)} sx={{ color: '#0F172A', ml: 0.5 }}>
                  <Badge badgeContent={favoriteCarIds.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#D97706' } }}>
                    <FavoriteIcon sx={{ color: favoriteCarIds.length > 0 ? '#D97706' : '#94A3B8' }} />
                  </Badge>
                </IconButton>

                <Button
                  variant="contained"
                  onClick={() => navigate('/sell')}
                  sx={{
                    bgcolor: '#0F172A',
                    color: '#FFFFFF',
                    ml: 1.5,
                    px: 2.5,
                    '&:hover': { bgcolor: '#1E293B' },
                  }}
                >
                  Sell Your Car
                </Button>
              </Box>
            )}

            {/* Mobile Menu Icon */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton onClick={() => setShortlistOpen(true)} size="small">
                  <Badge badgeContent={favoriteCarIds.length} color="primary">
                    <FavoriteIcon sx={{ fontSize: 22, color: favoriteCarIds.length > 0 ? '#D97706' : '#64748B' }} />
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
      <ShortlistDrawer open={shortlistOpen} onClose={() => setShortlistOpen(false)} portal="motors" />

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#D97706' }}>
            BK MOTORS
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
                  navigate('/sell');
                }}
                sx={{ bgcolor: '#D97706', color: '#FFFFFF' }}
              >
                Sell Your Car
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
