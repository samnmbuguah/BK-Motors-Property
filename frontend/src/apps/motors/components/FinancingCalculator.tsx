import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  TextField,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { calculateMonthlyPayment } from '../../../shared/utils/formatters';
import { useCurrency } from '../../../shared/context/CurrencyContext';

interface FinancingCalculatorProps {
  initialPrice?: number;
  onApply?: () => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  initialPrice = 4500000,
  onApply,
}) => {
  const { formatAmount } = useCurrency();
  const [price, setPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(13.5);

  const result = calculateMonthlyPayment(price, downPaymentPercent, interestRate, tenureMonths);

  return (
    <Card sx={{ bgcolor: '#FFFFFF', p: { xs: 1, sm: 2 }, border: '1px solid #E2E8F0', borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ p: 1, bgcolor: '#FEF3C7', color: '#D97706', borderRadius: 2 }}>
            <CalculateIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Car Loan & Financing Calculator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimate your monthly payments with commercial bank asset financing
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 4, mt: 3 }}>
          {/* Controls */}
          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" fontWeight="600" color="text.secondary">
                Vehicle Price (KES)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" fontWeight="600" color="text.secondary">
                  Down Payment (Deposit): {downPaymentPercent}%
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="primary">
                  {formatAmount(result.downPaymentAmount)}
                </Typography>
              </Box>
              <Slider
                value={downPaymentPercent}
                onChange={(_, val) => setDownPaymentPercent(val as number)}
                min={10}
                max={60}
                step={5}
                valueLabelDisplay="auto"
                sx={{ color: '#D97706' }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" fontWeight="600" color="text.secondary">
                  Loan Duration: {tenureMonths / 12} Years ({tenureMonths} Months)
                </Typography>
              </Box>
              <Slider
                value={tenureMonths}
                onChange={(_, val) => setTenureMonths(val as number)}
                min={12}
                max={60}
                step={12}
                marks={[
                  { value: 12, label: '1 Yr' },
                  { value: 24, label: '2 Yrs' },
                  { value: 36, label: '3 Yrs' },
                  { value: 48, label: '4 Yrs' },
                  { value: 60, label: '5 Yrs' },
                ]}
                valueLabelDisplay="auto"
                sx={{ color: '#D97706' }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight="600" color="text.secondary">
                Annual Interest Rate (% p.a.)
              </Typography>
              <TextField
                size="small"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 1)}
                sx={{ mt: 0.5, width: 140 }}
                inputProps={{ step: 0.5 }}
              />
            </Box>
          </Stack>

          {/* Results Summary Box */}
          <Box
            sx={{
              bgcolor: '#0F172A',
              color: '#FFFFFF',
              p: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Monthly Installment
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#FBBF24', my: 1 }}>
                {formatAmount(result.monthlyPayment)}
                <Typography component="span" variant="body2" sx={{ color: '#94A3B8', ml: 1 }}>
                  / month
                </Typography>
              </Typography>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.15)' }} />

              <Stack spacing={1.2} sx={{ fontSize: '0.85rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Required Deposit:</span>
                  <strong style={{ color: '#FFFFFF' }}>{formatAmount(result.downPaymentAmount)}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Financed Amount:</span>
                  <strong style={{ color: '#FFFFFF' }}>{formatAmount(result.loanAmount)}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Estimated Total Interest:</span>
                  <strong style={{ color: '#FFFFFF' }}>{formatAmount(result.totalInterest)}</strong>
                </Box>
              </Stack>
            </Box>

            <Button
              variant="contained"
              fullWidth
              startIcon={<AccountBalanceIcon />}
              onClick={onApply}
              sx={{
                bgcolor: '#D97706',
                color: '#FFFFFF',
                mt: 3,
                py: 1.2,
                fontWeight: 700,
                '&:hover': { bgcolor: '#B45309' },
              }}
            >
              Apply for Bank Financing
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
