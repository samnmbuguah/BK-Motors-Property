import React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CarFilterState } from '../../../shared/types';

interface CarFilterBarProps {
  filter: CarFilterState;
  onFilterChange: (newFilter: CarFilterState) => void;
  onSearch: () => void;
}

const MAKES = ['All Makes', 'Toyota', 'Subaru', 'Mercedes-Benz', 'Mazda', 'Land Rover', 'Isuzu', 'Nissan', 'Honda'];
const BODY_TYPES = ['All Types', 'SUV', 'Sedan', 'Pickup', 'Hatchback', 'Station Wagon'];
const PRICE_RANGES = [
  { label: 'Any Price', max: undefined },
  { label: 'Under KES 2,000,000', max: 2000000 },
  { label: 'Under KES 4,000,000', max: 4000000 },
  { label: 'Under KES 6,000,000', max: 6000000 },
  { label: 'Under KES 10,000,000', max: 10000000 },
];

export const CarFilterBar: React.FC<CarFilterBarProps> = ({
  filter,
  onFilterChange,
  onSearch,
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        bgcolor: '#FFFFFF',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.2fr 1fr 1fr 1fr auto' },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search make, model, e.g. Prado..."
          value={filter.searchTerm || ''}
          onChange={(e) => onFilterChange({ ...filter, searchTerm: e.target.value })}
        />

        {/* Make */}
        <FormControl size="small" fullWidth>
          <InputLabel>Make</InputLabel>
          <Select
            label="Make"
            value={filter.make || 'All Makes'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                make: e.target.value === 'All Makes' ? undefined : e.target.value,
              })
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
            value={filter.bodyType || 'All Types'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                bodyType: e.target.value === 'All Types' ? undefined : e.target.value,
              })
            }
          >
            {BODY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Max Budget */}
        <FormControl size="small" fullWidth>
          <InputLabel>Max Budget</InputLabel>
          <Select
            label="Max Budget"
            value={filter.maxPrice !== undefined ? filter.maxPrice : 'Any Price'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                maxPrice: e.target.value === 'Any Price' ? undefined : Number(e.target.value),
              })
            }
          >
            {PRICE_RANGES.map((r) => (
              <MenuItem key={r.label} value={r.max !== undefined ? r.max : 'Any Price'}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={onSearch}
          startIcon={<SearchIcon />}
          sx={{
            bgcolor: '#D97706',
            color: '#FFFFFF',
            height: 40,
            px: 3,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#B45309' },
          }}
        >
          Find Cars
        </Button>
      </Box>
    </Paper>
  );
};
