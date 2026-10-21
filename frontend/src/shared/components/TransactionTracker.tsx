import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { PaymentTransaction } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/formatters';

interface TransactionTrackerProps {
  portal: 'motors' | 'properties';
}

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TX-901',
    reference: 'MPESA-QA98XYZ2026',
    dealTitle: '2020 Toyota Land Cruiser Prado TX-L',
    amount: 50000,
    currency: 'KES',
    type: 'booking_deposit',
    status: 'cleared',
    paymentMethod: 'M-PESA Paybill',
    payerName: 'David Mwangi (Buyer)',
    recipientName: 'BK Motors Escrow Account',
    timestamp: '2026-10-19 14:22:10',
    receiptRef: 'REC-BKM-2026-081',
  },
  {
    id: 'TX-902',
    reference: 'KCB-ESCROW-8841',
    dealTitle: '2020 Toyota Land Cruiser Prado TX-L',
    amount: 7800000,
    currency: 'KES',
    type: 'escrow_hold',
    status: 'held_in_escrow',
    paymentMethod: 'KCB Escrow',
    payerName: 'Stanbic Bank Kenya (Asset Finance)',
    recipientName: 'BK Motors Custody Escrow',
    timestamp: '2026-10-20 11:05:45',
    receiptRef: 'ESC-BKM-2026-042',
  },
  {
    id: 'TX-903',
    reference: 'RTGS-BK-PROP-112',
    dealTitle: 'Prime 1/2 Acre Red Soil Plot in Ruiru',
    amount: 1850000,
    currency: 'KES',
    type: 'booking_deposit',
    status: 'cleared',
    paymentMethod: 'RTGS Bank Wire',
    payerName: 'Grace Achieng (Buyer)',
    recipientName: 'BK Properties Escrow Trust',
    timestamp: '2026-10-18 16:40:22',
    receiptRef: 'REC-BKP-2026-119',
  },
  {
    id: 'TX-904',
    reference: 'WIRE-SELLER-PAYOUT-05',
    dealTitle: '2018 Subaru Forester XT Eyesight',
    amount: 2980000,
    currency: 'KES',
    type: 'seller_final_payout',
    status: 'disbursed',
    paymentMethod: 'RTGS Bank Wire',
    payerName: 'BK Motors Escrow',
    recipientName: 'James Kamau (Consignor / Dealer)',
    timestamp: '2026-10-17 09:15:30',
    receiptRef: 'PAY-BKM-2026-009',
  },
];

export const TransactionTracker: React.FC<TransactionTrackerProps> = ({ portal }) => {
  const [transactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const { currency } = useCurrency();

  const isMotors = portal === 'motors';
  const primaryColor = isMotors ? '#D97706' : '#059669';

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const inEscrow = transactions
    .filter((t) => t.status === 'held_in_escrow')
    .reduce((sum, t) => sum + t.amount, 0);
  const disbursed = transactions
    .filter((t) => t.status === 'disbursed' || t.status === 'cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusChip = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'held_in_escrow':
        return (
          <Chip
            size="small"
            icon={<LockIcon sx={{ fontSize: '13px !important' }} />}
            label="Held in Escrow"
            sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 800, fontSize: '0.75rem' }}
          />
        );
      case 'cleared':
        return (
          <Chip
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
            label="Cleared & Verified"
            sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.75rem' }}
          />
        );
      case 'disbursed':
        return (
          <Chip
            size="small"
            label="Disbursed to Seller"
            sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.75rem' }}
          />
        );
      default:
        return <Chip size="small" label="Pending" />;
    }
  };

  const getTypeBadge = (type: PaymentTransaction['type']) => {
    switch (type) {
      case 'booking_deposit':
        return <Chip size="small" label="Booking Deposit" sx={{ bgcolor: '#F1F5F9', fontWeight: 700 }} />;
      case 'escrow_hold':
        return <Chip size="small" label="Escrow Hold" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />;
      case 'seller_final_payout':
        return <Chip size="small" label="Dealer Payout" sx={{ bgcolor: '#F0FDF4', color: '#166534', fontWeight: 700 }} />;
      default:
        return <Chip size="small" label="Financing" />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Payment & Escrow Transaction Ledger
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Transparent escrow tracking for buyer deposits, bank asset finance disbursements, and dealer payout settlements.
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
              TOTAL TRANSACTION VOLUME
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
              {formatPrice(totalVolume, currency)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #FEF3C7', bgcolor: '#FFFBEB' }}>
            <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700 }}>
              CURRENTLY HELD IN ESCROW
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#92400E', mt: 0.5 }}>
              {formatPrice(inEscrow, currency)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #DCFCE7', bgcolor: '#F0FDF4' }}>
            <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 700 }}>
              CLEARED & SETTLED
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#166534', mt: 0.5 }}>
              {formatPrice(disbursed, currency)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2.5 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Deal / Subject</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Channel & Parties</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }} align="right">Receipt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell>{getTypeBadge(tx.type)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {tx.dealTitle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Ref: {tx.reference} • {tx.timestamp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: primaryColor }}>
                    {formatPrice(tx.amount, currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {tx.paymentMethod}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    {tx.payerName} $\rightarrow$ {tx.recipientName}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(tx.status)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Official Receipt">
                    <IconButton
                      size="small"
                      aria-label="View Official Receipt"
                      onClick={() => setSelectedReceipt(tx)}
                      sx={{ color: '#334155', bgcolor: '#F1F5F9' }}
                    >
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Official Receipt Dialog */}
      <Dialog
        open={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        {selectedReceipt && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Official Escrow Receipt
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  {selectedReceipt.receiptRef}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedReceipt(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ p: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', letterSpacing: '0.1em' }}>
                    BK GROUP KENYA FINANCIAL ESCROW
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: primaryColor, my: 1 }}>
                    {formatPrice(selectedReceipt.amount, currency)}
                  </Typography>
                  <Chip
                    label={selectedReceipt.status.toUpperCase().replace(/_/g, ' ')}
                    size="small"
                    sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Item Reference:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.dealTitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Transaction Ref:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.reference}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Payer:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.payerName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Recipient:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.recipientName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Payment Gateway:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.paymentMethod}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Date & Time:</Typography>
                    <Typography variant="caption" fontWeight="bold">{selectedReceipt.timestamp}</Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={{ bgcolor: '#0F172A', color: '#FFFFFF', fontWeight: 700, textTransform: 'none' }}
              >
                Print / Save PDF Receipt
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
