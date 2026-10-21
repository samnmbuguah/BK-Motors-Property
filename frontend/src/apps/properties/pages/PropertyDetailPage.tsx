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
  Slider,
  IconButton,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import LandscapeIcon from '@mui/icons-material/Landscape';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Property } from '../../../shared/types';
import { propertyService } from '../../../shared/services/strapi';
import { createWhatsAppLink, calculateMonthlyPayment } from '../../../shared/utils/formatters';
import { useCurrency } from '../../../shared/context/CurrencyContext';
import { useFavorites } from '../../../shared/context/FavoritesContext';
import { InquiryModal } from '../../../shared/components/InquiryModal';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();
  const { isPropertyFavorite, toggleFavoriteProperty } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Mortgage Calculator State
  const [downPercent, setDownPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const interestRate = 12.5;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      propertyService.getBySlug(slug).then((data) => {
        setProperty(data || null);
        setActiveImageIndex(0);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#0D9488' }} />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Property Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This property listing may have expired, sold, or is currently under contract.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/properties')} sx={{ bgcolor: '#0D9488' }}>
          Back to Property Catalog
        </Button>
      </Container>
    );
  }

  const isFavorited = isPropertyFavorite(property.id);
  const isSale = property.listingStatus === 'For Sale';
  const isLand = property.propertyType === 'Land/Plot' || property.propertyType === ('Land' as any);
  const mortgageResult = calculateMonthlyPayment(property.price, downPercent, interestRate, loanTenureYears * 12);

  const whatsAppMessage = `Hello BK Properties, I would like to schedule a private viewing for "${property.title}" (Ref: ${property.refNumber}).`;
  const whatsappUrl = createWhatsAppLink('+254711000000', whatsAppMessage);

  return (
    <Box sx={{ py: 4, minHeight: '90vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/properties" underline="hover" color="inherit">
              Properties
            </Link>
            <Typography color="text.primary" fontWeight="600">
              {property.title}
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
            <Chip
              label={property.listingStatus}
              size="small"
              sx={{ bgcolor: isSale ? '#CCFBF1' : '#EFF6FF', color: isSale ? '#0F766E' : '#1D4ED8', fontWeight: 800 }}
            />
            <Chip label={property.propertyType} variant="outlined" size="small" />
            <Chip label={`Ref: ${property.refNumber}`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569' }} />
            {isLand && (
              <Chip label="Clean Title Deed" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 700 }} />
            )}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight="800">
                {property.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <Typography variant="body2">
                  {property.location.address}, {property.location.suburb}, {property.location.county}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => toggleFavoriteProperty(property.id)}
              sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' }, p: 1.2 }}
            >
              {isFavorited ? <FavoriteIcon sx={{ color: '#EF4444' }} /> : <FavoriteBorderIcon sx={{ color: '#64748B' }} />}
            </IconButton>
          </Box>
        </Box>

        {/* Gallery & Sidebar Grid */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Main Gallery */}
          <Grid item xs={12} md={7.5}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 2, bgcolor: '#0F172A' }}>
              <Box
                component="img"
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                sx={{
                  width: '100%',
                  height: { xs: 280, sm: 440 },
                  objectFit: 'cover',
                }}
              />
            </Card>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
                {property.images.map((img, idx) => (
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
                      border: activeImageIndex === idx ? '3px solid #0D9488' : '2px solid transparent',
                      opacity: activeImageIndex === idx ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': { opacity: 1 },
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Context-Aware Key Specs Row */}
            {isLand ? (
              /* LAND SPECIFIC SUMMARY */
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                  gap: 2,
                  bgcolor: '#F0FDF4',
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid #DCFCE7',
                  mt: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LandscapeIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Plot Area</Typography>
                    <Typography variant="subtitle2" fontWeight="700">0.75 Acre / 32,670 sq ft</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Title Deed</Typography>
                    <Typography variant="subtitle2" fontWeight="700">Clean Freehold</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Zoning</Typography>
                    <Typography variant="subtitle2" fontWeight="700">Commercial High-Rise</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ color: '#0D9488' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Road Frontage</Typography>
                    <Typography variant="subtitle2" fontWeight="700">45m Highway Front</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              /* RESIDENTIAL / COMMERCIAL SUMMARY */
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
                {property.bedrooms !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BedIcon sx={{ color: '#0D9488' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                      <Typography variant="subtitle2" fontWeight="700">{property.bedrooms} Beds</Typography>
                    </Box>
                  </Box>
                )}

                {property.bathrooms !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BathtubIcon sx={{ color: '#0D9488' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                      <Typography variant="subtitle2" fontWeight="700">{property.bathrooms} Baths</Typography>
                    </Box>
                  </Box>
                )}

                {property.areaSqFt !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SquareFootIcon sx={{ color: '#0D9488' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Floor Area</Typography>
                      <Typography variant="subtitle2" fontWeight="700">{property.areaSqFt.toLocaleString()} sq ft</Typography>
                    </Box>
                  </Box>
                )}

                {property.parkingSpaces !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalParkingIcon sx={{ color: '#0D9488' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Parking</Typography>
                      <Typography variant="subtitle2" fontWeight="700">{property.parkingSpaces} Cars</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* Pricing & Booking Sidebar */}
          <Grid item xs={12} md={4.5}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', position: 'sticky', top: 90 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isSale ? 'Guide Price' : 'Monthly Rental'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
                {formatAmount(property.price)}
                {!isSale && (
                  <Typography component="span" variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>
                    / month
                  </Typography>
                )}
              </Typography>

              {!isSale && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  * Service Charge: Inclusive | Furnished: Ready Turnkey
                </Typography>
              )}

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setModalOpen(true)}
                  startIcon={<CalendarMonthIcon />}
                  sx={{
                    bgcolor: '#0D9488',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    py: 1.3,
                    '&:hover': { bgcolor: '#0F766E' },
                  }}
                >
                  {isLand ? 'Schedule Land Site Visit' : 'Schedule Private Viewing'}
                </Button>

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
                  WhatsApp Property Agent
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Verified Clean Title Deed (Ministry of Lands)</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Ready for immediate conveyance / transfer</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#0D9488' }} />
                  <span>Bank financing & diaspora escrow approved</span>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Description & Land / Property Specs Table */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            {/* Description */}
            <Card sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Property Description & Highlights
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8 }}>
                {property.description}
              </Typography>
            </Card>

            {/* Context Specifications Table */}
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {isLand ? 'Land Due Diligence & Zoning Facts' : 'Property Architectural Details'}
              </Typography>
              <Table size="small">
                <TableBody>
                  {isLand ? (
                    <>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Property Category</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Prime Development Land</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Plot Size</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>0.75 Acre (32,670 sq ft)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Title Deed Registry</TableCell>
                        <TableCell>Nairobi Lands Registry (Freehold)</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Zoning Approval</TableCell>
                        <TableCell>Commercial / Mixed-Use High Rise</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Topography</TableCell>
                        <TableCell>Flat Red Soil Ground</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Road Access</TableCell>
                        <TableCell>Direct Dual Carriageway Highway</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Utilities On Site</TableCell>
                        <TableCell>3-Phase KPLC Power & Municipal Sewer</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Beacons / Survey</TableCell>
                        <TableCell>Deed Plan & Survey Beacons Intact</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Property Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{property.propertyType}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Listing Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{property.listingStatus}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Bedrooms</TableCell>
                        <TableCell>{property.bedrooms || 'Studio / Commercial'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Bathrooms</TableCell>
                        <TableCell>{property.bathrooms || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Internal Area</TableCell>
                        <TableCell>{property.areaSqFt ? `${property.areaSqFt.toLocaleString()} sq ft` : 'Custom'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Parking Capacity</TableCell>
                        <TableCell>{property.parkingSpaces ? `${property.parkingSpaces} Reserved Slots` : 'Ample'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Occupation Status</TableCell>
                        <TableCell>{property.readyStatus}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>County / Suburb</TableCell>
                        <TableCell>{property.location.suburb}, {property.location.county}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Amenities Grid */}
            {property.amenities.length > 0 && (
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {isLand ? 'Infrastructure & Utilities' : 'Amenities & Facilities'}
                </Typography>
                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  {property.amenities.map((amenity) => (
                    <Grid item xs={12} sm={6} key={amenity}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#0D9488', fontSize: 18 }} />
                        <Typography variant="body2">{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}
          </Grid>

          {/* Mortgage Estimator (Only for houses/apartments for sale) */}
          {isSale && !isLand && (
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 1, bgcolor: '#CCFBF1', color: '#0D9488', borderRadius: 2 }}>
                    <CalculateIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Mortgage Repayment Estimator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commercial bank mortgage calculation (at {interestRate}% p.a.)
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        Down Payment: {downPercent}%
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: '#0D9488' }}>
                        {formatAmount(mortgageResult.downPaymentAmount)}
                      </Typography>
                    </Box>
                    <Slider
                      value={downPercent}
                      onChange={(_, val) => setDownPercent(val as number)}
                      min={10}
                      max={50}
                      step={5}
                      valueLabelDisplay="auto"
                      sx={{ color: '#0D9488' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        Mortgage Term: {loanTenureYears} Years
                      </Typography>
                    </Box>
                    <Slider
                      value={loanTenureYears}
                      onChange={(_, val) => setLoanTenureYears(val as number)}
                      min={5}
                      max={25}
                      step={5}
                      marks={[
                        { value: 5, label: '5 Yrs' },
                        { value: 15, label: '15 Yrs' },
                        { value: 25, label: '25 Yrs' },
                      ]}
                      sx={{ color: '#0D9488' }}
                    />
                  </Box>

                  <Box sx={{ bgcolor: '#0F172A', color: '#FFFFFF', p: 2.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Estimated Monthly Repayment
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2DD4BF', my: 0.5 }}>
                      {formatAmount(mortgageResult.monthlyPayment)}
                      <Typography component="span" variant="caption" sx={{ color: '#94A3B8', ml: 1 }}>
                        / month
                      </Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 1 }}>
                      Loan Principal: {formatAmount(mortgageResult.loanAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Schedule Viewing Modal */}
        <InquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isLand ? 'Schedule Land Site Visit & Beacon Verification' : 'Schedule Private Property Tour'}
          inquiryType="property_viewing"
          itemId={property.id}
          itemTitle={property.title}
          themeColor="#0D9488"
        />
      </Container>
    </Box>
  );
};
