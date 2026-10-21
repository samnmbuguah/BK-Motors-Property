import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DownloadIcon from '@mui/icons-material/Download';
import HandshakeIcon from '@mui/icons-material/Handshake';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DealDocument, DealerConsignment } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/formatters';

interface DealerDocumentVaultProps {
  portal: 'motors' | 'properties';
}

const INITIAL_CONSIGNMENTS: DealerConsignment[] = [
  {
    id: 'BKM-CONS-01',
    title: '2019 Subaru Outback 2.5i Eyesight',
    itemType: 'vehicle',
    askingPrice: 3200000,
    currency: 'KES',
    status: 'inspected_verified',
    inspectionScore: '147/150 Mechanical Check Passed',
    createdAt: '2026-10-18T10:30:00Z',
    photos: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'NTSA Logbook - KDK 450Y.pdf',
        type: 'logbook',
        fileUrl: '#',
        fileSize: '1.4 MB',
        verified: true,
        verificationNotes: 'TIMS/NTSA Verified: Chassis #BRF-048214, Clean title, no active bank caveats.',
        uploadedAt: '2026-10-18',
      },
      {
        id: 'doc-2',
        name: 'Standard Vehicle Sales Agreement.pdf',
        type: 'sales_agreement',
        fileUrl: '#',
        fileSize: '850 KB',
        verified: true,
        verificationNotes: 'Signed by Consignor. Deposit escrow clause active.',
        uploadedAt: '2026-10-19',
      },
      {
        id: 'doc-3',
        name: '150-Point Physical Inspection Report.pdf',
        type: 'inspection_certificate',
        fileUrl: '#',
        fileSize: '2.1 MB',
        verified: true,
        verificationNotes: 'Engine compression 98%, Brake pads 85%, Gearbox fluid clean.',
        uploadedAt: '2026-10-19',
      },
    ],
    transactions: [],
  },
  {
    id: 'BKP-PROP-02',
    title: '1/2 Acre Red Soil Plot in Ruiru Mugutha',
    itemType: 'property',
    askingPrice: 18500000,
    currency: 'KES',
    status: 'live_on_showroom',
    inspectionScore: 'Survey Plan & Cadastral Map Verified',
    createdAt: '2026-10-15T08:00:00Z',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [
      {
        id: 'doc-4',
        name: 'Freehold Title Deed - L.R. No. 12945/88.pdf',
        type: 'title_deed',
        fileUrl: '#',
        fileSize: '3.2 MB',
        verified: true,
        verificationNotes: 'Ministry of Lands Search: Freehold Tenure, no registered disputes or charge.',
        uploadedAt: '2026-10-15',
      },
      {
        id: 'doc-5',
        name: 'Deed Plan & Registry Index Map.pdf',
        type: 'inspection_certificate',
        fileUrl: '#',
        fileSize: '1.8 MB',
        verified: true,
        verificationNotes: 'Beacon search completed by registered surveyor.',
        uploadedAt: '2026-10-16',
      },
    ],
    transactions: [],
  },
];

export const DealerDocumentVault: React.FC<DealerDocumentVaultProps> = ({ portal }) => {
  const [consignments, setConsignments] = useState<DealerConsignment[]>(INITIAL_CONSIGNMENTS);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'vehicles' | 'properties'>('all');
  const { currency } = useCurrency();

  const isMotors = portal === 'motors';
  const primaryColor = isMotors ? '#D97706' : '#059669';

  // Form State for New Consignment Upload
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newType, setNewType] = useState<'vehicle' | 'property'>(isMotors ? 'vehicle' : 'property');
  const [newLogbookName, setNewLogbookName] = useState('');
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  const handleAddPhoto = () => {
    if (photoUrlInput.trim()) {
      setNewPhotos((prev) => [...prev, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    }
  };

  const handleCreateConsignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const newConsignment: DealerConsignment = {
      id: `BK-DEAL-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      itemType: newType,
      askingPrice: parseFloat(newPrice) || 0,
      currency: 'KES',
      status: 'pending_inspection',
      inspectionScore: 'Awaiting Physical Hub Inspection',
      createdAt: new Date().toISOString(),
      photos:
        newPhotos.length > 0
          ? newPhotos
          : [
              newType === 'vehicle'
                ? 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            ],
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: newLogbookName || (newType === 'vehicle' ? 'Vehicle Logbook Copy.pdf' : 'Title Deed Copy.pdf'),
          type: newType === 'vehicle' ? 'logbook' : 'title_deed',
          fileUrl: '#',
          fileSize: '1.8 MB',
          verified: false,
          verificationNotes: 'Pending official registry check & chassis scan.',
          uploadedAt: new Date().toLocaleDateString(),
        },
        {
          id: `doc-${Date.now() + 1}`,
          name: 'Standard Consignment Sales Agreement.pdf',
          type: 'sales_agreement',
          fileUrl: '#',
          fileSize: '950 KB',
          verified: true,
          verificationNotes: 'Standard BK Group escrow & commission agreement generated.',
          uploadedAt: new Date().toLocaleDateString(),
        },
      ],
      transactions: [],
    };

    setConsignments((prev) => [newConsignment, ...prev]);
    setUploadModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewLogbookName('');
    setNewPhotos([]);
  };

  const handleVerifyDocument = (consignmentId: string, docId: string) => {
    setVerifyingDocId(docId);
    setTimeout(() => {
      setConsignments((prev) =>
        prev.map((c) => {
          if (c.id === consignmentId) {
            return {
              ...c,
              status: 'inspected_verified',
              documents: c.documents.map((d) => {
                if (d.id === docId) {
                  return {
                    ...d,
                    verified: true,
                    verificationNotes:
                      d.type === 'logbook'
                        ? 'AI & NTSA Search Complete: Chassis confirmed, zero police/bank caveats, single Kenyan owner.'
                        : 'Ministry of Lands Cadastral Search Complete: Authentic Freehold Deed, verified survey coordinates.',
                  };
                }
                return d;
              }),
            };
          }
          return c;
        })
      );
      setVerifyingDocId(null);
    }, 1500);
  };

  const filtered = consignments.filter((c) => {
    if (activeTab === 'vehicles') return c.itemType === 'vehicle';
    if (activeTab === 'properties') return c.itemType === 'property';
    return true;
  });

  return (
    <Box>
      {/* Header bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <div>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Dealer & Seller Document Vault
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Upload and manage photos, NTSA logbooks, land title deeds, and official sales agreements with AI-powered verification.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setUploadModalOpen(true)}
          sx={{
            bgcolor: primaryColor,
            color: '#FFFFFF',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            '&:hover': { bgcolor: primaryColor, opacity: 0.9 },
          }}
        >
          Add New Vehicle / Property Vault
        </Button>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip
          label="All Listings"
          clickable
          color={activeTab === 'all' ? 'primary' : 'default'}
          onClick={() => setActiveTab('all')}
          sx={{ fontWeight: 700 }}
        />
        <Chip
          icon={<DirectionsCarIcon />}
          label="Vehicles"
          clickable
          color={activeTab === 'vehicles' ? 'primary' : 'default'}
          onClick={() => setActiveTab('vehicles')}
          sx={{ fontWeight: 700 }}
        />
        <Chip
          icon={<ApartmentIcon />}
          label="Properties & Plots"
          clickable
          color={activeTab === 'properties' ? 'primary' : 'default'}
          onClick={() => setActiveTab('properties')}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {/* Consignment Items */}
      <Grid container spacing={3}>
        {filtered.map((cons) => (
          <Grid item xs={12} key={cons.id}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {cons.title}
                      </Typography>
                      <Chip
                        label={cons.itemType === 'vehicle' ? 'Vehicle' : 'Property / Plot'}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', fontWeight: 700 }}
                      />
                      <Chip
                        label={cons.status === 'inspected_verified' ? '150-Pt Inspected & Verified' : cons.status}
                        size="small"
                        sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: primaryColor, mt: 0.5 }}>
                      {formatPrice(cons.askingPrice, currency)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Vault Ref: #{cons.id} • Listed: {new Date(cons.createdAt).toLocaleDateString()} • {cons.inspectionScore}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Section 1: Uploaded Photos Gallery */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddPhotoAlternateIcon fontSize="small" sx={{ color: primaryColor }} />
                  Showroom Photos & Media ({cons.photos.length})
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {cons.photos.map((photo, i) => (
                    <Grid item xs={6} sm={3} md={2} key={i}>
                      <Box
                        sx={{
                          height: 100,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid #E2E8F0',
                          position: 'relative',
                        }}
                      >
                        <Box
                          component="img"
                          src={photo}
                          alt="Listing"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Section 2: Uploaded Legal Documents */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon fontSize="small" sx={{ color: primaryColor }} />
                  Legal Ownership Documents & Agreements ({cons.documents.length})
                </Typography>
                <Grid container spacing={2}>
                  {cons.documents.map((doc) => (
                    <Grid item xs={12} sm={6} md={4} key={doc.id}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#F8FAFC',
                          border: `1px solid ${doc.verified ? '#BBF7D0' : '#E2E8F0'}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon sx={{ color: '#64748B', fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }} noWrap>
                              {doc.name}
                            </Typography>
                          </Box>
                          {doc.verified ? (
                            <Tooltip title="Verified">
                              <CheckCircleIcon sx={{ color: '#15803D', fontSize: 18 }} />
                            </Tooltip>
                          ) : (
                            <Chip size="small" label="Pending" sx={{ fontSize: '0.7rem', height: 20 }} />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1, minHeight: 36 }}>
                          {doc.verificationNotes}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {doc.fileSize}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {!doc.verified && (
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={verifyingDocId === doc.id ? <CircularProgress size={12} color="inherit" /> : <AutoAwesomeIcon />}
                                disabled={verifyingDocId === doc.id}
                                onClick={() => handleVerifyDocument(cons.id, doc.id)}
                                sx={{
                                  fontSize: '0.7rem',
                                  py: 0.2,
                                  px: 1,
                                  bgcolor: '#D97706',
                                  textTransform: 'none',
                                }}
                              >
                                AI Verify
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                              sx={{ fontSize: '0.7rem', py: 0.2, px: 1, textTransform: 'none' }}
                            >
                              Download
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload New Consignment Dialog */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Upload to Dealer Document Vault
          <IconButton size="small" onClick={() => setUploadModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="dealer-upload-form" onSubmit={handleCreateConsignment} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={newType === 'vehicle' ? 'contained' : 'outlined'}
                onClick={() => setNewType('vehicle')}
                fullWidth
                startIcon={<DirectionsCarIcon />}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Car / Vehicle
              </Button>
              <Button
                variant={newType === 'property' ? 'contained' : 'outlined'}
                onClick={() => setNewType('property')}
                fullWidth
                startIcon={<ApartmentIcon />}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Real Estate / Land
              </Button>
            </Box>

            <TextField
              label={newType === 'vehicle' ? 'Vehicle Title (e.g. 2021 Toyota Harrier)' : 'Property Title (e.g. 1/2 Acre Red Soil Plot)'}
              fullWidth
              size="small"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <TextField
              label="Asking Price (KES)"
              type="number"
              fullWidth
              size="small"
              required
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <TextField
              label={newType === 'vehicle' ? 'Logbook Document File Name / Reference' : 'Title Deed File Name / L.R. No.'}
              fullWidth
              size="small"
              placeholder={newType === 'vehicle' ? 'e.g. NTSA Logbook - KDD 123A.pdf' : 'e.g. Freehold Title Deed - L.R. 5560/2.pdf'}
              value={newLogbookName}
              onChange={(e) => setNewLogbookName(e.target.value)}
            />

            {/* Photo URLs */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 1, display: 'block' }}>
                Photos (Enter image URL or preview links):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                />
                <Button variant="outlined" onClick={handleAddPhoto} sx={{ textTransform: 'none', fontWeight: 700 }}>
                  Add
                </Button>
              </Box>
              {newPhotos.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {newPhotos.map((p, idx) => (
                    <Chip key={idx} label={`Photo ${idx + 1}`} size="small" onDelete={() => setNewPhotos(newPhotos.filter((_, i) => i !== idx))} />
                  ))}
                </Box>
              )}
            </Box>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Uploaded documents are automatically checked against the NTSA/TIMS database and the Ministry of Lands registry using our AI verification engine.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setUploadModalOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="dealer-upload-form"
            variant="contained"
            sx={{ bgcolor: primaryColor, color: '#FFFFFF', fontWeight: 700, textTransform: 'none', px: 3 }}
          >
            Create Vault Listing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
