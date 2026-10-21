import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Slider,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useSearchParams } from 'react-router-dom';
import { Property, PropertyFilterState } from '../../../shared/types';
import { propertyService } from '../../../shared/services/strapi';
import { PropertyCard } from '../components/PropertyCard';
import { useCurrency } from '../../../shared/context/CurrencyContext';

const PROPERTY_TYPES = ['All Types', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Land/Plot', 'Commercial'];
const SUBURBS = ['All Locations', 'Karen', 'Kilimani', 'Westlands', 'Kileleshwa', 'Lavington', 'Runda', 'Ngong Road'];
const STATUSES = ['All Statuses', 'For Sale', 'For Rent'];
const TITLE_TYPES = ['All Titles', 'Freehold', 'Leasehold (99 Yrs)', 'Leasehold (50 Yrs)'];

export const PropertyListingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { formatAmount } = useCurrency();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initialType = searchParams.get('type') || undefined;
  const [filters, setFilters] = useState<PropertyFilterState>({
    searchTerm: searchParams.get('search') || '',
    listingStatus: searchParams.get('status') || undefined,
    propertyType: initialType,
    suburb: searchParams.get('suburb') || undefined,
    minBedrooms: searchParams.get('beds') ? Number(searchParams.get('beds')) : undefined,
    titleType: undefined,
    sortBy: 'newest',
  });

  const [priceRange, setPriceRange] = useState<number[]>([100000, 200000000]);

  useEffect(() => {
    propertyService.getAll().then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  const isLandSelected = filters.propertyType === 'Land/Plot' || filters.propertyType === 'Land';

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      listingStatus: undefined,
      propertyType: undefined,
      suburb: undefined,
      minBedrooms: undefined,
      titleType: undefined,
      sortBy: 'newest',
    });
    setPriceRange([100000, 200000000]);
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        if (filters.searchTerm) {
          const q = filters.searchTerm.toLowerCase();
          const match =
            prop.title.toLowerCase().includes(q) ||
            prop.location.suburb.toLowerCase().includes(q) ||
            prop.propertyType.toLowerCase().includes(q) ||
            prop.refNumber.toLowerCase().includes(q);
          if (!match) return false;
        }

        if (filters.listingStatus && filters.listingStatus !== 'All Statuses' && prop.listingStatus !== filters.listingStatus) {
          return false;
        }

        if (filters.propertyType && filters.propertyType !== 'All Types') {
          const isTargetLand = filters.propertyType === 'Land/Plot' || filters.propertyType === 'Land';
          const isPropLand = prop.propertyType === 'Land/Plot' || prop.propertyType === ('Land' as any);
          if (isTargetLand) {
            if (!isPropLand) return false;
          } else if (prop.propertyType !== filters.propertyType) {
            return false;
          }
        }

        if (filters.suburb && filters.suburb !== 'All Locations' && prop.location.suburb !== filters.suburb) {
          return false;
        }

        if (!isLandSelected && filters.minBedrooms !== undefined && (prop.bedrooms === undefined || prop.bedrooms < filters.minBedrooms)) {
          return false;
        }

        if (prop.price < priceRange[0] || prop.price > priceRange[1]) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [properties, filters, priceRange, isLandSelected]);

  const FilterSidebarContent = (
    <Card sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Filter Properties
        </Typography>
        <Button
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={resetFilters}
          sx={{ color: '#0D9488', fontSize: '0.78rem' }}
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Search */}
        <TextField
          size="small"
          label="Search Keywords"
          placeholder="e.g. Karen, Red Soil, Pool..."
          value={filters.searchTerm || ''}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />

        {/* Listing Status */}
        <FormControl size="small" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.listingStatus || 'All Statuses'}
            onChange={(e) =>
              setFilters({ ...filters, listingStatus: e.target.value === 'All Statuses' ? undefined : e.target.value })
            }
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Property Type */}
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={filters.propertyType || 'All Types'}
            onChange={(e) =>
              setFilters({ ...filters, propertyType: e.target.value === 'All Types' ? undefined : e.target.value })
            }
          >
            {PROPERTY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location / Suburb */}
        <FormControl size="small" fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            value={filters.suburb || 'All Locations'}
            onChange={(e) =>
              setFilters({ ...filters, suburb: e.target.value === 'All Locations' ? undefined : e.target.value })
            }
          >
            {SUBURBS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Context Filter: If Land Selected -> Show Title Type; Else Show Bedrooms */}
        {isLandSelected ? (
          <FormControl size="small" fullWidth>
            <InputLabel>Title Deed Type</InputLabel>
            <Select
              label="Title Deed Type"
              value={filters.titleType || 'All Titles'}
              onChange={(e) =>
                setFilters({ ...filters, titleType: e.target.value === 'All Titles' ? undefined : e.target.value })
              }
            >
              {TITLE_TYPES.map((tt) => (
                <MenuItem key={tt} value={tt}>
                  {tt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <FormControl size="small" fullWidth>
            <InputLabel>Min Bedrooms</InputLabel>
            <Select
              label="Min Bedrooms"
              value={filters.minBedrooms !== undefined ? filters.minBedrooms : 'Any'}
              onChange={(e) =>
                setFilters({ ...filters, minBedrooms: e.target.value === 'Any' ? undefined : Number(e.target.value) })
              }
            >
              <MenuItem value="Any">Any Beds</MenuItem>
              <MenuItem value={1}>1+ Bedrooms</MenuItem>
              <MenuItem value={2}>2+ Bedrooms</MenuItem>
              <MenuItem value={3}>3+ Bedrooms</MenuItem>
              <MenuItem value={4}>4+ Bedrooms</MenuItem>
              <MenuItem value={5}>5+ Bedrooms</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Price Slider */}
        <Box>
          <Typography variant="caption" fontWeight="600" color="text.secondary">
            Budget Range: {formatAmount(priceRange[0])} - {formatAmount(priceRange[1])}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, val) => setPriceRange(val as number[])}
            min={100000}
            max={200000000}
            step={1000000}
            sx={{ color: '#0D9488', mt: 1 }}
          />
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ py: 4, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="#0D9488" fontWeight="700">
            {isLandSelected ? 'LAND & DEVELOPMENT PLOTS' : 'PROPERTY DIRECTORY'}
          </Typography>
          <Typography variant="h4" fontWeight="800">
            {isLandSelected ? 'Commercial & Residential Land Catalog' : 'Current Property Portfolio'} ({filteredProperties.length})
          </Typography>
        </Box>

        {/* Top Controls Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            p: 2,
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            mb: 3,
          }}
        >
          {isMobile ? (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ borderColor: '#CBD5E1', color: '#0F172A' }}
            >
              Filter Options
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Displaying <strong>{filteredProperties.length}</strong> matching properties
            </Typography>
          )}

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={filters.sortBy || 'newest'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            >
              <MenuItem value="newest">Featured & Newest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Layout */}
        <Grid container spacing={3}>
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <Grid item md={3.5} lg={3}>
              {FilterSidebarContent}
            </Grid>
          )}

          {/* Property Cards */}
          <Grid item xs={12} md={8.5} lg={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : filteredProperties.length === 0 ? (
              <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  No properties matched your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try broadening your location selection or adjusting the price range.
                </Typography>
                <Button variant="contained" onClick={resetFilters} sx={{ bgcolor: '#0D9488' }}>
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {filteredProperties.map((prop) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={prop.id}>
                    <PropertyCard property={prop} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 300, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Filter Properties
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {FilterSidebarContent}
            <Button
              fullWidth
              variant="contained"
              onClick={() => setDrawerOpen(false)}
              sx={{ mt: 2, bgcolor: '#0D9488' }}
            >
              Apply Filters ({filteredProperties.length})
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};
