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
  CardContent,
  Slider,
  Button,
  Chip,
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
import { Car, CarFilterState } from '../../../shared/types';
import { carService } from '../../../shared/services/strapi';
import { VehicleCard } from '../components/VehicleCard';
import { formatPrice } from '../../../shared/utils/formatters';

const MAKES = ['All Makes', 'Toyota', 'Subaru', 'Mercedes-Benz', 'Mazda', 'Land Rover', 'Isuzu', 'Nissan', 'Honda'];
const BODY_TYPES = ['All Types', 'SUV', 'Sedan', 'Pickup', 'Hatchback', 'Station Wagon'];
const CONDITIONS = ['All Conditions', 'Foreign Used', 'Locally Used', 'Brand New', 'In Transit'];
const FUEL_TYPES = ['All Fuels', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS = ['All Transmissions', 'Automatic', 'Manual'];

export const MotorsInventoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<CarFilterState>({
    searchTerm: searchParams.get('search') || '',
    make: searchParams.get('make') || undefined,
    bodyType: searchParams.get('bodyType') || undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: 'newest',
  });

  const [priceRange, setPriceRange] = useState<number[]>([1000000, 15000000]);

  useEffect(() => {
    carService.getAll().then((data) => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      make: undefined,
      bodyType: undefined,
      condition: undefined,
      fuelType: undefined,
      transmission: undefined,
      sortBy: 'newest',
    });
    setPriceRange([1000000, 15000000]);
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.searchTerm) {
        const query = filters.searchTerm.toLowerCase();
        const matches =
          car.title.toLowerCase().includes(query) ||
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.refNumber.toLowerCase().includes(query);
        if (!matches) return false;
      }
      if (filters.make && filters.make !== 'All Makes' && car.make !== filters.make) return false;
      if (filters.bodyType && filters.bodyType !== 'All Types' && car.bodyType !== filters.bodyType) return false;
      if (filters.condition && filters.condition !== 'All Conditions' && car.condition !== filters.condition) return false;
      if (filters.fuelType && filters.fuelType !== 'All Fuels' && car.fuelType !== filters.fuelType) return false;
      if (filters.transmission && filters.transmission !== 'All Transmissions' && car.transmission !== filters.transmission) return false;

      // Price slider
      if (car.price < priceRange[0] || car.price > priceRange[1]) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'year_desc') return b.year - a.year;
      if (filters.sortBy === 'mileage_asc') return a.mileage - b.mileage;
      return 0; // default newest
    });
  }, [cars, filters, priceRange]);

  const FilterSidebarContent = (
    <Card sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Filters
        </Typography>
        <Button
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={resetFilters}
          sx={{ color: '#D97706', fontSize: '0.78rem' }}
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Search */}
        <TextField
          size="small"
          label="Keyword Search"
          placeholder="Model, make, trim..."
          value={filters.searchTerm || ''}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />

        {/* Make */}
        <FormControl size="small" fullWidth>
          <InputLabel>Make</InputLabel>
          <Select
            label="Make"
            value={filters.make || 'All Makes'}
            onChange={(e) =>
              setFilters({ ...filters, make: e.target.value === 'All Makes' ? undefined : e.target.value })
            }
          >
            {MAKES.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Body Type */}
        <FormControl size="small" fullWidth>
          <InputLabel>Body Type</InputLabel>
          <Select
            label="Body Type"
            value={filters.bodyType || 'All Types'}
            onChange={(e) =>
              setFilters({ ...filters, bodyType: e.target.value === 'All Types' ? undefined : e.target.value })
            }
          >
            {BODY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Condition */}
        <FormControl size="small" fullWidth>
          <InputLabel>Condition</InputLabel>
          <Select
            label="Condition"
            value={filters.condition || 'All Conditions'}
            onChange={(e) =>
              setFilters({ ...filters, condition: e.target.value === 'All Conditions' ? undefined : e.target.value })
            }
          >
            {CONDITIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Slider */}
        <Box>
          <Typography variant="caption" fontWeight="600" color="text.secondary">
            Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, val) => setPriceRange(val as number[])}
            min={1000000}
            max={15000000}
            step={250000}
            sx={{ color: '#D97706', mt: 1 }}
          />
        </Box>

        {/* Fuel Type */}
        <FormControl size="small" fullWidth>
          <InputLabel>Fuel Type</InputLabel>
          <Select
            label="Fuel Type"
            value={filters.fuelType || 'All Fuels'}
            onChange={(e) =>
              setFilters({ ...filters, fuelType: e.target.value === 'All Fuels' ? undefined : e.target.value })
            }
          >
            {FUEL_TYPES.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Transmission */}
        <FormControl size="small" fullWidth>
          <InputLabel>Transmission</InputLabel>
          <Select
            label="Transmission"
            value={filters.transmission || 'All Transmissions'}
            onChange={(e) =>
              setFilters({
                ...filters,
                transmission: e.target.value === 'All Transmissions' ? undefined : e.target.value,
              })
            }
          >
            {TRANSMISSIONS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ py: 4, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumb & Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="#D97706" fontWeight="700">
            INVENTORY SHOWCASE
          </Typography>
          <Typography variant="h4" fontWeight="800">
            Available Vehicle Stock ({filteredCars.length})
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
              Showing <strong>{filteredCars.length}</strong> vehicles matching your criteria
            </Typography>
          )}

          {/* Sort By Dropdown */}
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
              <MenuItem value="year_desc">Year: Newest First</MenuItem>
              <MenuItem value="mileage_asc">Mileage: Lowest First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Main Content Layout */}
        <Grid container spacing={3}>
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <Grid item md={3.5} lg={3}>
              {FilterSidebarContent}
            </Grid>
          )}

          {/* Vehicle Cards Grid */}
          <Grid item xs={12} md={8.5} lg={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : filteredCars.length === 0 ? (
              <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  No vehicles found matching criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try relaxing your price filters or searching with different keywords.
                </Typography>
                <Button variant="contained" onClick={resetFilters} sx={{ bgcolor: '#D97706' }}>
                  Reset All Filters
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {filteredCars.map((car) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={car.id}>
                    <VehicleCard car={car} />
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
                Filter Vehicles
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
              sx={{ mt: 2, bgcolor: '#D97706' }}
            >
              Apply Filters ({filteredCars.length})
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};
