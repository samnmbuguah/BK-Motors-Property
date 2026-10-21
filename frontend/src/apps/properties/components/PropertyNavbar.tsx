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
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CurrencyToggle } from '../../../shared/components/CurrencyToggle';
import { ShortlistDrawer } from '../../../shared/components/ShortlistDrawer';
import { useFavorites } from '../../../shared/context/FavoritesContext';
import { useAuth } from '../../../shared/context/AuthContext';

export const PropertyNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const { favoritePropertyIds } = useFavorites();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigateDashboard = () => {
    handleUserMenuClose();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const handleListPropertyNavigation = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
    navigate('/list');
  };

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
                <Tooltip title="View Saved Real Estate">
                  <IconButton onClick={() => setShortlistOpen(true)} sx={{ color: '#0F172A', ml: 0.5 }}>
                    <Badge badgeContent={favoritePropertyIds.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#0D9488' } }}>
                      <FavoriteIcon sx={{ color: favoritePropertyIds.length > 0 ? '#0D9488' : '#94A3B8' }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Auth Menu / Button */}
                {isAuthenticated && user ? (
                  <>
                    <Button
                      onClick={handleUserMenuOpen}
                      startIcon={
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: '#0D9488',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        color: '#0F172A',
                        ml: 1,
                        px: 1.5,
                        borderRadius: 2,
                        border: '1px solid #E2E8F0',
                        '&:hover': { bgcolor: '#F8FAFC' },
                      }}
                    >
                      {user.username}
                    </Button>
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          width: 220,
                          borderRadius: 2,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                          Signed in as
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }} noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleNavigateDashboard}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" sx={{ color: '#0D9488' }} />
                        </ListItemIcon>
                        <ListItemText primary="Client Portal" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <MenuItem onClick={() => { handleUserMenuClose(); navigate('/dashboard?tab=vault'); }}>
                        <ListItemIcon>
                          <DescriptionIcon fontSize="small" sx={{ color: '#0D9488' }} />
                        </ListItemIcon>
                        <ListItemText primary="Title Deeds & Vault" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <MenuItem onClick={() => { handleUserMenuClose(); navigate('/dashboard?tab=payments'); }}>
                        <ListItemIcon>
                          <AccountBalanceWalletIcon fontSize="small" sx={{ color: '#0D9488' }} />
                        </ListItemIcon>
                        <ListItemText primary="Escrow & Transactions" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <MenuItem onClick={() => { handleUserMenuClose(); setShortlistOpen(true); }}>
                        <ListItemIcon>
                          <FavoriteIcon fontSize="small" sx={{ color: '#0D9488' }} />
                        </ListItemIcon>
                        <ListItemText primary={`Saved Listings (${favoritePropertyIds.length})`} primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" sx={{ color: '#EF4444' }} />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<AccountCircleIcon />}
                    onClick={() => openAuthModal('login')}
                    sx={{
                      ml: 1,
                      borderColor: '#E2E8F0',
                      color: '#0F172A',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': { borderColor: '#0D9488', bgcolor: 'transparent' },
                    }}
                  >
                    Sign In
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleListPropertyNavigation}
                  sx={{
                    bgcolor: '#0F172A',
                    color: '#FFFFFF',
                    ml: 1,
                    px: 2.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
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
        <Box sx={{ width: 280, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ bgcolor: '#0D9488', color: '#FFFFFF', p: 0.6, borderRadius: 1.5 }}>
              <ApartmentIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0F172A' }}>
              BK PROPERTIES
            </Typography>
          </Box>

          {/* User Status in Mobile */}
          {isAuthenticated && user ? (
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Client Portal</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user.username}</Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<DashboardIcon />}
                onClick={() => { setDrawerOpen(false); navigate('/dashboard'); }}
                sx={{ mt: 1, textTransform: 'none', fontWeight: 700, color: '#0D9488', borderColor: '#0D9488' }}
              >
                My Account
              </Button>
              <Button
                variant="text"
                size="small"
                fullWidth
                startIcon={<DescriptionIcon />}
                onClick={() => { setDrawerOpen(false); navigate('/dashboard?tab=vault'); }}
                sx={{ mt: 0.5, textTransform: 'none', fontWeight: 600, color: '#0F172A', justifyContent: 'flex-start' }}
              >
                Title Deeds & Vault
              </Button>
              <Button
                variant="text"
                size="small"
                fullWidth
                startIcon={<AccountBalanceWalletIcon />}
                onClick={() => { setDrawerOpen(false); navigate('/dashboard?tab=payments'); }}
                sx={{ mt: 0.5, textTransform: 'none', fontWeight: 600, color: '#0F172A', justifyContent: 'flex-start' }}
              >
                Escrow & Transactions
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              startIcon={<AccountCircleIcon />}
              onClick={() => { setDrawerOpen(false); openAuthModal('login'); }}
              sx={{ mb: 2, bgcolor: '#0F172A', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
            >
              Sign In / Register
            </Button>
          )}

          <Divider sx={{ mb: 1.5 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                component={RouterLink}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{ textDecoration: 'none', color: '#0F172A', py: 1 }}
              >
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            ))}

            {isAuthenticated && (
              <ListItem
                onClick={() => { setDrawerOpen(false); logout(); }}
                sx={{ color: '#EF4444', py: 1, cursor: 'pointer' }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LogoutIcon fontSize="small" sx={{ color: '#EF4444' }} />
                </ListItemIcon>
                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            )}

            <ListItem sx={{ mt: 2, px: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setDrawerOpen(false);
                  handleListPropertyNavigation();
                }}
                sx={{ bgcolor: '#0D9488', color: '#FFFFFF', fontWeight: 700, textTransform: 'none' }}
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
