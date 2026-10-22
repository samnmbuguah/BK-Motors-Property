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
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../shared/types';
import { formatMileage, createWhatsAppLink } from '../../../shared/utils/formatters';
import { useCurrency } from '../../../shared/context/CurrencyContext';
import { useFavorites } from '../../../shared/context/FavoritesContext';

interface VehicleCardProps {
  car: Car;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();
  const { isCarFavorite, toggleFavoriteCar } = useFavorites();
  const [photoIndex, setPhotoIndex] = React.useState(0);

  const images = car.images && car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'
  ];

  const isFavorited = isCarFavorite(car.id);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const conditionColors: Record<string, { bg: string; text: string }> = {
    'Foreign Used': { bg: '#EFF6FF', text: '#1D4ED8' },
    'Locally Used': { bg: '#F0FDF4', text: '#15803D' },
    'Brand New': { bg: '#FEF3C7', text: '#B45309' },
    'In Transit': { bg: '#FDF2F8', text: '#BE185D' },
  };

  const badge = conditionColors[car.condition] || { bg: '#F1F5F9', text: '#475569' };

  const whatsAppText = `Hello BK Motors, I am inquiring about the ${car.year} ${car.make} ${car.model} (Ref: ${car.refNumber}) listed at ${formatAmount(car.price)}. Is it still available?`;
  const whatsappUrl = createWhatsAppLink('+254700000000', whatsAppText);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Photo with Badges & Mini Carousel */}
      <Box
        sx={{
          position: 'relative',
          height: 210,
          overflow: 'hidden',
          bgcolor: '#0F172A',
          '&:hover .card-photo-nav': { opacity: 1 },
        }}
      >
        <CardMedia
          component="img"
          image={images[photoIndex] || images[0]}
          alt={car.title}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/vehicle/${car.slug}`)}
        />

        {/* Mini Carousel Navigation Chevrons */}
        {images.length > 1 && (
          <>
            <IconButton
              className="card-photo-nav"
              aria-label="Previous image"
              onClick={handlePrevPhoto}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 6,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                color: '#FFFFFF',
                p: 0.5,
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '&:hover': { bgcolor: '#D97706' },
                zIndex: 2,
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              className="card-photo-nav"
              aria-label="Next image"
              onClick={handleNextPhoto}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 6,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                color: '#FFFFFF',
                p: 0.5,
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '&:hover': { bgcolor: '#D97706' },
                zIndex: 2,
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Pagination Dots */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.6,
                zIndex: 2,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                px: 0.8,
                py: 0.4,
                borderRadius: 4,
                backdropFilter: 'blur(4px)',
              }}
            >
              {images.slice(0, 6).map((_, i) => (
                <Box
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(i);
                  }}
                  sx={{
                    width: photoIndex === i ? 14 : 6,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: photoIndex === i ? '#D97706' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>
          </>
        )}
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.8 }}>
          <Chip
            label={car.condition}
            size="small"
            sx={{
              bgcolor: badge.bg,
              color: badge.text,
              fontWeight: 700,
              fontSize: '0.72rem',
              borderRadius: 1,
            }}
          />
          {car.featured && (
            <Chip
              label="FEATURED"
              size="small"
              sx={{
                bgcolor: '#D97706',
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
          aria-label="Add to favorites"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteCar(car.id);
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
          label={car.bodyType}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            bgcolor: 'rgba(15, 23, 42, 0.75)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#D97706',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {car.refNumber} • {car.year}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.3,
            mt: 0.3,
            mb: 1,
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: '#D97706' },
          }}
          onClick={() => navigate(`/vehicle/${car.slug}`)}
        >
          {car.title}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>
          {formatAmount(car.price)}
        </Typography>

        {/* Specs Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            bgcolor: '#F8FAFC',
            p: 1.2,
            borderRadius: 1.5,
            mb: 1.5,
            fontSize: '0.78rem',
            color: '#475569',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <SpeedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <span>{formatMileage(car.mileage)}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <SettingsIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <span>{car.transmission}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <LocalGasStationIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <span>{car.fuelType} ({car.engineCC}cc)</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {car.location.split(' ')[0]}
            </span>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 1.5 }} />
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => navigate(`/vehicle/${car.slug}`)}
              sx={{
                borderColor: '#CBD5E1',
                color: '#0F172A',
                fontWeight: 600,
                '&:hover': { borderColor: '#D97706', bgcolor: 'transparent' },
              }}
            >
              Details
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
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
