import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { carService, propertyService } from '../services/strapi';
import { Car, Property } from '../types';
import { createWhatsAppLink } from '../utils/formatters';

interface ShortlistDrawerProps {
  open: boolean;
  onClose: () => void;
  portal: 'motors' | 'properties';
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({ open, onClose, portal }) => {
  const navigate = useNavigate();
  const { favoriteCarIds, favoritePropertyIds, toggleFavoriteCar, toggleFavoriteProperty } = useFavorites();
  const { formatAmount } = useCurrency();

  const [savedCars, setSavedCars] = useState<Car[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (portal === 'motors') {
      carService.getAll().then((all) => {
        setSavedCars(all.filter((c) => favoriteCarIds.includes(c.id)));
      });
    } else {
      propertyService.getAll().then((all) => {
        setSavedProperties(all.filter((p) => favoritePropertyIds.includes(p.id)));
      });
    }
  }, [open, favoriteCarIds, favoritePropertyIds, portal]);

  const items = portal === 'motors' ? savedCars : savedProperties;
  const themeColor = portal === 'motors' ? '#D97706' : '#0D9488';

  const bulkWhatsAppText =
    portal === 'motors'
      ? `Hello BK Motors, I have shortlisted ${savedCars.length} vehicles: ${savedCars.map((c) => `${c.title} (Ref: ${c.refNumber})`).join(', ')}. Are they available for viewing?`
      : `Hello BK Properties, I have shortlisted ${savedProperties.length} properties: ${savedProperties.map((p) => `${p.title} (Ref: ${p.refNumber})`).join(', ')}. Can I arrange site visits?`;

  const whatsappUrl = createWhatsAppLink(portal === 'motors' ? '+254700000000' : '+254711000000', bulkWhatsAppText);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              My Saved {portal === 'motors' ? 'Vehicles' : 'Properties'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {items.length} item{items.length === 1 ? '' : 's'} in your shortlist
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {items.length === 0 ? (
          <Box sx={{ my: 'auto', textAlign: 'center', py: 6 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No {portal === 'motors' ? 'vehicles' : 'properties'} saved yet.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                onClose();
                navigate(portal === 'motors' ? '/inventory' : '/properties');
              }}
              sx={{ borderColor: themeColor, color: themeColor }}
            >
              Browse Catalog
            </Button>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ overflowY: 'auto', flexGrow: 1, pr: 0.5 }}>
            {portal === 'motors'
              ? savedCars.map((car) => (
                  <Card key={car.id} sx={{ display: 'flex', p: 1.2, gap: 1.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      image={car.images[0]}
                      alt={car.title}
                      sx={{ width: 85, height: 70, borderRadius: 1.5, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: '0 !important', flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2, fontSize: '0.85rem' }}>
                        {car.title}
                      </Typography>
                      <Typography variant="body2" fontWeight="800" sx={{ color: themeColor, mt: 0.5 }}>
                        {formatAmount(car.price)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.8 }}>
                        <Button
                          size="small"
                          endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                          onClick={() => {
                            onClose();
                            navigate(`/vehicle/${car.slug}`);
                          }}
                          sx={{ p: 0, fontSize: '0.75rem', color: '#0F172A', fontWeight: 600 }}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavoriteCar(car.id)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              : savedProperties.map((prop) => (
                  <Card key={prop.id} sx={{ display: 'flex', p: 1.2, gap: 1.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      image={prop.images[0]}
                      alt={prop.title}
                      sx={{ width: 85, height: 70, borderRadius: 1.5, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: '0 !important', flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2, fontSize: '0.85rem' }}>
                        {prop.title}
                      </Typography>
                      <Typography variant="body2" fontWeight="800" sx={{ color: themeColor, mt: 0.5 }}>
                        {formatAmount(prop.price)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.8 }}>
                        <Button
                          size="small"
                          endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                          onClick={() => {
                            onClose();
                            navigate(`/property/${prop.slug}`);
                          }}
                          sx={{ p: 0, fontSize: '0.75rem', color: '#0F172A', fontWeight: 600 }}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavoriteProperty(prop.id)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
          </Stack>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              sx={{ bgcolor: '#25D366', color: '#FFFFFF', fontWeight: 700, py: 1.2, '&:hover': { bgcolor: '#1EBE5D' } }}
            >
              Inquire All on WhatsApp
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
