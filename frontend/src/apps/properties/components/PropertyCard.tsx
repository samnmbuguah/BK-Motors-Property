import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LandscapeIcon from '@mui/icons-material/Landscape';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../../shared/types';
import { createWhatsAppLink } from '../../../shared/utils/formatters';
import { useCurrency } from '../../../shared/context/CurrencyContext';
import { useFavorites } from '../../../shared/context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();
  const { isPropertyFavorite, toggleFavoriteProperty } = useFavorites();

  const isFavorited = isPropertyFavorite(property.id);
  const isSale = property.listingStatus === 'For Sale';
  const isLand = property.propertyType === 'Land/Plot' || property.propertyType === ('Land' as any);

  const statusColor = isSale ? { bg: '#CCFBF1', text: '#0F766E' } : { bg: '#EFF6FF', text: '#1D4ED8' };

  const whatsAppMessage = `Hello BK Properties, I would like to inquire about "${property.title}" (${property.refNumber}) listed at ${formatAmount(property.price)}. Can I schedule a viewing?`;
  const whatsappUrl = createWhatsAppLink('+254711000000', whatsAppMessage);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Property Photo & Badges */}
      <Box sx={{ position: 'relative', height: 230, overflow: 'hidden', bgcolor: '#0F172A' }}>
        <CardMedia
          component="img"
          image={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'}
          alt={property.title}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
            '&:hover': { transform: 'scale(1.05)' },
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/property/${property.slug}`)}
        />

        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 0.8 }}>
          <Chip
            label={property.listingStatus}
            size="small"
            sx={{
              bgcolor: statusColor.bg,
              color: statusColor.text,
              fontWeight: 800,
              fontSize: '0.72rem',
              borderRadius: 1,
            }}
          />
          {property.featured && (
            <Chip
              label="PRIME"
              size="small"
              sx={{
                bgcolor: '#0D9488',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.72rem',
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteProperty(property.id);
          }}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            p: 0.8,
            '&:hover': { bgcolor: '#FFFFFF', transform: 'scale(1.1)' },
          }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: '#EF4444', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#64748B', fontSize: 20 }} />
          )}
        </IconButton>

        <Chip
          label={property.propertyType}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'rgba(15, 23, 42, 0.8)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0D9488', mb: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight="700">
            {property.location.suburb}, {property.location.county}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.35,
            mb: 1.2,
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: '#0D9488' },
          }}
          onClick={() => navigate(`/property/${property.slug}`)}
        >
          {property.title}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
          {formatAmount(property.price)}
          {!isSale && (
            <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
              / month
            </Typography>
          )}
        </Typography>

        {/* Dynamic Context-Aware Specs Pill Box */}
        {isLand ? (
          /* LAND SPECIFIC METRICS */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#F0FDF4',
              p: 1.2,
              borderRadius: 1.5,
              mb: 2,
              fontSize: '0.78rem',
              color: '#166534',
              border: '1px solid #DCFCE7',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <LandscapeIcon sx={{ fontSize: 17, color: '#0D9488' }} />
              <span>{property.plotDimensions || '0.75 Acre'}</span>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <VerifiedIcon sx={{ fontSize: 16, color: '#0D9488' }} />
              <span>{property.titleType || 'Freehold Title'}</span>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <BusinessIcon sx={{ fontSize: 16, color: '#0D9488' }} />
              <span>{property.zoning || 'Commercial'}</span>
            </Box>
          </Box>
        ) : (
          /* RESIDENTIAL / COMMERCIAL METRICS */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#F8FAFC',
              p: 1.2,
              borderRadius: 1.5,
              mb: 2,
              fontSize: '0.8rem',
              color: '#475569',
            }}
          >
            {property.bedrooms !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <BedIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <span>{property.bedrooms} Beds</span>
              </Box>
            )}

            {property.bathrooms !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <BathtubIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <span>{property.bathrooms} Baths</span>
              </Box>
            )}

            {property.areaSqFt !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <SquareFootIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <span>{property.areaSqFt.toLocaleString()} sq ft</span>
              </Box>
            )}
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 1.5 }} />
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => navigate(`/property/${property.slug}`)}
              sx={{
                borderColor: '#CBD5E1',
                color: '#0F172A',
                fontWeight: 600,
                '&:hover': { borderColor: '#0D9488', bgcolor: 'transparent' },
              }}
            >
              View Property
            </Button>
            <Button
              variant="contained"
              size="small"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: '#25D366',
                color: '#FFFFFF',
                px: 1.5,
                minWidth: 'auto',
                '&:hover': { bgcolor: '#1EBE5D' },
              }}
              title="Chat with Agent"
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
