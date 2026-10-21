import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PropertyFilterState } from '../../../shared/types';

interface PropertyFilterBarProps {
  filter: PropertyFilterState;
  onFilterChange: (newFilter: PropertyFilterState) => void;
  onSearch: () => void;
}

const PROPERTY_TYPES = ['All Types', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Land/Plot', 'Commercial'];
const SUBURBS = ['All Locations', 'Karen', 'Kilimani', 'Westlands', 'Kileleshwa', 'Lavington', 'Runda', 'Ngong Road'];
const BEDROOMS = ['Any Beds', '1', '2', '3', '4', '5+'];

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filter,
  onFilterChange,
  onSearch,
}) => {
  const currentTab = filter.listingStatus === 'For Rent' ? 1 : 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    onFilterChange({
      ...filter,
      listingStatus: newValue === 1 ? 'For Rent' : 'For Sale',
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          bgcolor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          '& .MuiTab-root': { fontWeight: 700, fontSize: '0.9rem', py: 1.8 },
          '& .Mui-selected': { color: '#0D9488' },
          '& .MuiTabs-indicator': { bgcolor: '#0D9488', height: 3 },
        }}
      >
        <Tab label="Properties For Sale" />
        <Tab label="Properties For Rent" />
      </Tabs>

      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.2fr 1fr 1fr 1fr auto' },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Keyword e.g. Pool, Penthouse..."
          value={filter.searchTerm || ''}
          onChange={(e) => onFilterChange({ ...filter, searchTerm: e.target.value })}
        />

        {/* Location / Suburb */}
        <FormControl size="small" fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            value={filter.suburb || 'All Locations'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                suburb: e.target.value === 'All Locations' ? undefined : e.target.value,
              })
            }
          >
            {SUBURBS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Property Type */}
        <FormControl size="small" fullWidth>
          <InputLabel>Property Type</InputLabel>
          <Select
            label="Property Type"
            value={filter.propertyType || 'All Types'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                propertyType: e.target.value === 'All Types' ? undefined : e.target.value,
              })
            }
          >
            {PROPERTY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bedrooms */}
        <FormControl size="small" fullWidth>
          <InputLabel>Bedrooms</InputLabel>
          <Select
            label="Bedrooms"
            value={filter.minBedrooms ? filter.minBedrooms.toString() : 'Any Beds'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                minBedrooms: e.target.value === 'Any Beds' ? undefined : Number(e.target.value.replace('+', '')),
              })
            }
          >
            {BEDROOMS.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit */}
        <Button
          variant="contained"
          onClick={onSearch}
          startIcon={<SearchIcon />}
          sx={{
            bgcolor: '#0D9488',
            color: '#FFFFFF',
            height: 40,
            px: 3,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#0F766E' },
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};
