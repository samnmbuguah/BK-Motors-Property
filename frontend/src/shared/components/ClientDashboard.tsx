import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/formatters';
import { MOCK_CARS, MOCK_PROPERTIES } from '../services/mockData';
import { Car, Property, InquiryItem } from '../types';
import { AiOutreachDrawer } from './AiOutreachDrawer';
import { DealerDocumentVault } from './DealerDocumentVault';
import { TransactionTracker } from './TransactionTracker';

interface ClientDashboardProps {
  portal: 'motors' | 'properties';
  defaultTab?: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ portal, defaultTab }) => {
  const { user, logout, inquiries, openAuthModal, isAuthenticated } = useAuth();
  const { favoriteCarIds, favoritePropertyIds, toggleFavoriteCar, toggleFavoriteProperty } = useFavorites();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabIndexFromParam = (tabName: string | null): number => {
    switch (tabName) {
      case 'inquiries':
      case 'bookings':
        return 0;
      case 'saved':
      case 'shortlist':
        return 1;
      case 'consignments':
      case 'listings':
        return 2;
      case 'vault':
      case 'documents':
      case 'dealer':
        return 3;
      case 'payments':
      case 'transactions':
      case 'escrow':
        return 4;
      case 'account':
      case 'preferences':
      case 'settings':
        return 5;
      default:
        return 0;
    }
  };

  const initialTab = defaultTab
    ? getTabIndexFromParam(defaultTab)
    : getTabIndexFromParam(searchParams.get('tab'));

  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [selectedInquiryForAi, setSelectedInquiryForAi] = useState<InquiryItem | null>(null);

  // Sync tab with URL search parameter if changed externally
  React.useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(getTabIndexFromParam(tabParam));
    }
  }, [searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setActiveTab(newIndex);
    const tabNames = ['inquiries', 'saved', 'consignments', 'vault', 'payments', 'account'];
    setSearchParams({ tab: tabNames[newIndex] }, { replace: true });
  };

  const isMotors = portal === 'motors';
  const primaryColor = isMotors ? '#D97706' : '#059669';
  const headerBg = isMotors ? '#0F172A' : '#064E3B';

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Card sx={{ p: 5, borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <Avatar sx={{ bgcolor: primaryColor, width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <VerifiedUserIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Sign In to Access Your Client Portal
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 500, mx: 'auto', mb: 4 }}>
            Track your scheduled test drives, property private viewings, saved inventory, and vehicle
            consignment updates in one centralized dashboard.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => openAuthModal('login')}
            sx={{
              bgcolor: primaryColor,
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: primaryColor, opacity: 0.9 },
            }}
          >
            Sign In / Register
          </Button>
        </Card>
      </Container>
    );
  }

  // Get favorite car and property objects
  const savedCars = MOCK_CARS.filter((car: Car) => favoriteCarIds.includes(car.id.toString()));
  const savedProperties = MOCK_PROPERTIES.filter((p: Property) => favoritePropertyIds.includes(p.id.toString()));

  // Inquiries classification
  const testDrives = inquiries.filter((i) => i.inquiryType === 'test_drive');
  const viewings = inquiries.filter((i) => i.inquiryType === 'property_viewing');
  const consignments = inquiries.filter((i) => i.inquiryType === 'sell_car');

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'contacted':
        return (
          <Chip
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
            label="Agent Assigned & Confirmed"
            sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.75rem' }}
          />
        );
      case 'in_progress':
        return (
          <Chip
            size="small"
            icon={<PendingActionsIcon sx={{ fontSize: '14px !important' }} />}
            label="Scheduling In Progress"
            sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.75rem' }}
          />
        );
      case 'closed':
        return (
          <Chip
            size="small"
            label="Completed"
            sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}
          />
        );
      default:
        return (
          <Chip
            size="small"
            label="Received - Awaiting Confirmation"
            sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 700, fontSize: '0.75rem' }}
          />
        );
    }
  };

  const getInquiryTypeBadge = (type: string) => {
    switch (type) {
      case 'test_drive':
        return (
          <Chip
            size="small"
            icon={<DirectionsCarIcon sx={{ fontSize: '14px !important' }} />}
            label="Test Drive"
            sx={{ bgcolor: '#F8FAFC', color: '#334155', fontWeight: 600, border: '1px solid #E2E8F0' }}
          />
        );
      case 'property_viewing':
        return (
          <Chip
            size="small"
            icon={<HomeWorkIcon sx={{ fontSize: '14px !important' }} />}
            label="Private Tour"
            sx={{ bgcolor: '#F8FAFC', color: '#334155', fontWeight: 600, border: '1px solid #E2E8F0' }}
          />
        );
      case 'sell_car':
        return (
          <Chip
            size="small"
            label="Consignment / Sale"
            sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}
          />
        );
      default:
        return (
          <Chip
            size="small"
            label="Sales Inquiry"
            sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
          />
        );
    }
  };

  const handleWhatsAppAgent = (itemTitle?: string, type?: string) => {
    const phone = isMotors ? '254700000000' : '254711000000';
    const message = encodeURIComponent(
      `Hello BK ${isMotors ? 'Motors' : 'Properties'}, I am following up on my ${type || 'inquiry'} for: ${
        itemTitle || 'my account activity'
      }. Client: ${user.username} (${user.email}).`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '85vh', pb: 10 }}>
      {/* Dashboard Top Header */}
      <Box sx={{ bgcolor: headerBg, color: '#FFFFFF', pt: 6, pb: 7 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: primaryColor,
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    border: '3px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                      Welcome, {user.username}
                    </Typography>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#FFFFFF !important' }} />}
                      label="Verified Client"
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                    {user.email} • Client ID #{user.id} • Portal: {isMotors ? 'BK Motors' : 'BK Properties'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.25)',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>

          {/* Quick Metrics Cards */}
          <Grid container spacing={2.5} sx={{ mt: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Active Inquiries & Bookings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 0.5 }}>
                  {inquiries.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Saved Vehicles & Plots
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 0.5 }}>
                  {favoriteCarIds.length + favoritePropertyIds.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Consignments In Progress
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 0.5 }}>
                  {consignments.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Dedicated Consultant
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFFFFF', mt: 0.5 }}>
                  {isMotors ? 'James Kamau' : 'Sarah Wanjiku'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Dashboard Navigation Tabs */}
      <Container maxWidth="lg" sx={{ mt: -3 }}>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ sx: { bgcolor: primaryColor, height: 3 } }}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: '#FFFFFF' }}
          >
            <Tab
              icon={<CalendarMonthIcon fontSize="small" />}
              iconPosition="start"
              label={`Inquiries & Bookings (${inquiries.length})`}
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
            <Tab
              icon={<BookmarkIcon fontSize="small" />}
              iconPosition="start"
              label={`Saved Shortlist (${favoriteCarIds.length + favoritePropertyIds.length})`}
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
            <Tab
              icon={<DirectionsCarIcon fontSize="small" />}
              iconPosition="start"
              label={`Consignments & Listings (${consignments.length})`}
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
            <Tab
              icon={<DescriptionIcon fontSize="small" />}
              iconPosition="start"
              label="Dealer Document Vault"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
            <Tab
              icon={<AccountBalanceWalletIcon fontSize="small" />}
              iconPosition="start"
              label="Escrow & Transactions"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
            <Tab
              icon={<SupportAgentIcon fontSize="small" />}
              iconPosition="start"
              label="Account & Preferences"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2, '&.Mui-selected': { color: primaryColor } }}
            />
          </Tabs>

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            {/* TAB 0: INQUIRIES & BOOKINGS */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      My Test Drives & Viewing Appointments
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Real-time status updates from our dealership hub and property sales desk.
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(isMotors ? '/inventory' : '/properties')}
                    sx={{
                      bgcolor: primaryColor,
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      '&:hover': { bgcolor: primaryColor, opacity: 0.9 },
                    }}
                  >
                    Browse More Listings
                  </Button>
                </Box>

                {inquiries.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    You have not submitted any inquiries or test drive bookings yet. Browse our inventory to book an
                    appointment!
                  </Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Listing / Subject</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Submitted</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#334155' }} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inquiries.map((inq) => (
                          <TableRow key={inq.id} hover>
                            <TableCell>{getInquiryTypeBadge(inq.inquiryType)}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                                {inq.itemTitle || 'General Inquiry'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', maxWidth: 360 }} noWrap>
                                "{inq.message}"
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                              {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-GB') : 'Recent'}
                            </TableCell>
                            <TableCell>{getStatusChip(inq.status)}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                <Tooltip title="AI Sales Outreach & Call Script">
                                  <IconButton
                                    size="small"
                                    onClick={() => setSelectedInquiryForAi(inq)}
                                    sx={{ color: '#D97706', bgcolor: '#FEF3C7', '&:hover': { bgcolor: '#FDE68A' } }}
                                  >
                                    <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Direct WhatsApp Follow-up">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleWhatsAppAgent(inq.itemTitle, inq.inquiryType)}
                                    sx={{ color: '#25D366' }}
                                  >
                                    <WhatsAppIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* TAB 1: SAVED SHORTLIST */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Saved Vehicles & Properties
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Review your shortlisted vehicles and properties or compare pricing.
                    </Typography>
                  </div>
                </Box>

                {savedCars.length === 0 && savedProperties.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Your shortlist is empty. Click the heart icon on any vehicle or property card to save it here for
                    easy comparison!
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {/* Saved Cars */}
                    {savedCars.map((car: Car) => (
                      <Grid item xs={12} sm={6} md={4} key={`car-${car.id}`}>
                        <Card sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                          <Box sx={{ position: 'relative', height: 180, bgcolor: '#0F172A' }}>
                            <Box
                              component="img"
                              src={car.images[0]}
                              alt={car.title}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Chip
                              label={car.condition}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                bgcolor: '#D97706',
                                color: '#FFFFFF',
                                fontWeight: 700,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleFavoriteCar(car.id.toString())}
                              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
                            >
                              <DeleteOutlineIcon fontSize="small" color="error" />
                            </IconButton>
                          </Box>
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                              {car.title}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#D97706', my: 0.5 }}>
                              {formatPrice(car.price, currency)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                              {car.mileage.toLocaleString()} km • {car.transmission} • {car.location}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={() => navigate(`/vehicle/${car.slug}`)}
                                sx={{ bgcolor: '#0F172A', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
                              >
                                View Car
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleWhatsAppAgent(car.title, 'Vehicle Test Drive')}
                                sx={{ bgcolor: '#25D366', color: '#FFFFFF', '&:hover': { bgcolor: '#20BA5A' } }}
                              >
                                <WhatsAppIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}

                    {/* Saved Properties */}
                    {savedProperties.map((prop: Property) => (
                      <Grid item xs={12} sm={6} md={4} key={`prop-${prop.id}`}>
                        <Card sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                          <Box sx={{ position: 'relative', height: 180, bgcolor: '#064E3B' }}>
                            <Box
                              component="img"
                              src={prop.images[0]}
                              alt={prop.title}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Chip
                              label={prop.listingStatus}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                bgcolor: '#059669',
                                color: '#FFFFFF',
                                fontWeight: 700,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleFavoriteProperty(prop.id.toString())}
                              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
                            >
                              <DeleteOutlineIcon fontSize="small" color="error" />
                            </IconButton>
                          </Box>
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                              {prop.title}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', my: 0.5 }}>
                              {formatPrice(prop.price, currency)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                              {prop.propertyType} • {prop.location.suburb}, {prop.location.county}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={() => navigate(`/property/${prop.slug}`)}
                                sx={{ bgcolor: '#064E3B', color: '#FFFFFF', textTransform: 'none', fontWeight: 700 }}
                              >
                                View Property
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleWhatsAppAgent(prop.title, 'Property Walkthrough')}
                                sx={{ bgcolor: '#25D366', color: '#FFFFFF', '&:hover': { bgcolor: '#20BA5A' } }}
                              >
                                <WhatsAppIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* TAB 2: CONSIGNMENTS & SELL REQUESTS */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Consignment & Sale Submissions
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Track vehicle inspections, property valuations, and listing status on BK Showrooms.
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate(isMotors ? '/sell' : '/list')}
                    sx={{
                      bgcolor: primaryColor,
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    {isMotors ? 'Submit Car for Sale' : 'List a Property'}
                  </Button>
                </Box>

                {consignments.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    You have not listed any cars or properties on consignment yet. Click "Submit Car for Sale" to have
                    our team inspect and market your vehicle.
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {consignments.map((cons) => (
                      <Grid item xs={12} key={cons.id}>
                        <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                                {cons.itemTitle || 'Consignment Item'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                                Notes: {cons.message}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 1 }}>
                                Submitted on: {cons.createdAt ? new Date(cons.createdAt).toLocaleDateString() : 'Recent'}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              {getStatusChip(cons.status)}
                              <Box sx={{ mt: 1.5 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                                  onClick={() => handleWhatsAppAgent(cons.itemTitle, 'Consignment Valuation')}
                                  sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#CBD5E1' }}
                                >
                                  Chat with Valuation Desk
                                </Button>
                              </Box>
                            </Box>
                          </Box>

                          {/* Progression steps */}
                          <Divider sx={{ my: 2.5 }} />
                          <Grid container spacing={2}>
                            {[
                              { label: '1. Details Submitted', done: true },
                              { label: '2. 150-Pt Physical Inspection', done: cons.status !== 'new' },
                              { label: '3. Valuation & Price Agreed', done: cons.status === 'contacted' || cons.status === 'closed' },
                              { label: '4. Live Showroom Marketing', done: cons.status === 'closed' },
                            ].map((step, idx) => (
                              <Grid item xs={6} sm={3} key={idx}>
                                <Box
                                  sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: step.done ? '#F0FDF4' : '#F8FAFC',
                                    border: `1px solid ${step.done ? '#BBF7D0' : '#E2E8F0'}`,
                                    textAlign: 'center',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 700,
                                      color: step.done ? '#15803D' : '#94A3B8',
                                      display: 'block',
                                    }}
                                  >
                                    {step.label}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* TAB 3: DEALER DOCUMENT VAULT */}
            {activeTab === 3 && (
              <Box>
                <DealerDocumentVault portal={portal} />
              </Box>
            )}

            {/* TAB 4: ESCROW & TRANSACTIONS */}
            {activeTab === 4 && (
              <Box>
                <TransactionTracker portal={portal} />
              </Box>
            )}

            {/* TAB 5: ACCOUNT & PREFERENCES */}
            {activeTab === 5 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Account Profile & Portal Preferences
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                  Manage your display currency, contact channels, and authenticated security settings.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                        Client Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: '#64748B' }}>Username</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.username}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: '#64748B' }}>Email Address</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.email}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: '#64748B' }}>Account Status</Typography>
                          <Chip size="small" label="Active & Verified" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }} />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                        Currency Preference
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                        Choose your default price display across vehicle and property listings:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant={currency === 'KES' ? 'contained' : 'outlined'}
                          onClick={() => setCurrency('KES')}
                          sx={{
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: currency === 'KES' ? primaryColor : 'transparent',
                            color: currency === 'KES' ? '#FFFFFF' : '#334155',
                          }}
                        >
                          KES (Kenya Shillings)
                        </Button>
                        <Button
                          variant={currency === 'USD' ? 'contained' : 'outlined'}
                          onClick={() => setCurrency('USD')}
                          sx={{
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: currency === 'USD' ? primaryColor : 'transparent',
                            color: currency === 'USD' ? '#FFFFFF' : '#334155',
                          }}
                        >
                          USD ($ Dollar)
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* AI Sales Outreach & Pitch Drawer */}
      <AiOutreachDrawer
        open={Boolean(selectedInquiryForAi)}
        onClose={() => setSelectedInquiryForAi(null)}
        inquiry={selectedInquiryForAi}
        portal={portal}
      />
    </Box>
  );
};
