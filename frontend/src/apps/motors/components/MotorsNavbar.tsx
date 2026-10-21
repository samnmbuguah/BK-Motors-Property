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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CurrencyToggle } from '../../../shared/components/CurrencyToggle';
import { ShortlistDrawer } from '../../../shared/components/ShortlistDrawer';
import { useFavorites } from '../../../shared/context/FavoritesContext';
import { useAuth } from '../../../shared/context/AuthContext';

export const MotorsNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const { favoriteCarIds } = useFavorites();
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

  const handleSellCarNavigation = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
    navigate('/sell');
  };

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
                <Tooltip title="View Saved Shortlist">
                  <IconButton onClick={() => setShortlistOpen(true)} sx={{ color: '#0F172A', ml: 0.5 }}>
                    <Badge badgeContent={favoriteCarIds.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#D97706' } }}>
                      <FavoriteIcon sx={{ color: favoriteCarIds.length > 0 ? '#D97706' : '#94A3B8' }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Authentication Menu / Button */}
                {isAuthenticated && user ? (
                  <>
                    <Button
                      onClick={handleUserMenuOpen}
                      startIcon={
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: '#D97706',
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
                          <DashboardIcon fontSize="small" sx={{ color: '#D97706' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <MenuItem onClick={() => { handleUserMenuClose(); setShortlistOpen(true); }}>
                        <ListItemIcon>
                          <FavoriteIcon fontSize="small" sx={{ color: '#D97706' }} />
                        </ListItemIcon>
                        <ListItemText primary={`Saved Shortlist (${favoriteCarIds.length})`} primaryTypographyProps={{ fontWeight: 600 }} />
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
                      '&:hover': { borderColor: '#D97706', bgcolor: 'transparent' },
                    }}
                  >
                    Sign In
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleSellCarNavigation}
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
        <Box sx={{ width: 280, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ bgcolor: '#D97706', color: '#FFFFFF', p: 0.6, borderRadius: 1.5 }}>
              <DirectionsCarIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0F172A' }}>
              BK MOTORS
            </Typography>
          </Box>

          {/* User Status in Mobile */}
          {isAuthenticated && user ? (
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Welcome</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user.username}</Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<DashboardIcon />}
                onClick={() => { setDrawerOpen(false); navigate('/dashboard'); }}
                sx={{ mt: 1, textTransform: 'none', fontWeight: 700, color: '#D97706', borderColor: '#D97706' }}
              >
                My Dashboard
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
                  handleSellCarNavigation();
                }}
                sx={{ bgcolor: '#D97706', color: '#FFFFFF', fontWeight: 700, textTransform: 'none' }}
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
