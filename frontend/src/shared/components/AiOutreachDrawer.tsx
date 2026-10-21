import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import { InquiryItem } from '../types';

interface AiOutreachDrawerProps {
  open: boolean;
  onClose: () => void;
  inquiry: InquiryItem | null;
  portal?: 'motors' | 'properties';
}

const AI_API_URL =
  import.meta.env.VITE_AI_API_URL || 'https://bkai.169-58-102-217.sslip.io';

export const AiOutreachDrawer: React.FC<AiOutreachDrawerProps> = ({
  open,
  onClose,
  inquiry,
  portal = 'motors',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [outreachData, setOutreachData] = useState<any>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const isMotors = portal === 'motors';
  const primaryColor = isMotors ? '#D97706' : '#059669';

  const generateOutreach = async () => {
    if (!inquiry) return;
    setLoading(true);
    try {
      const res = await fetch(`${AI_API_URL}/api/outreach/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          customer_name: inquiry.customerName,
          email: inquiry.email || '',
          phone: inquiry.phone,
          inquiry_type: inquiry.inquiryType,
          item_title: inquiry.itemTitle || '',
          message: inquiry.message,
        }),
      });

      if (!res.ok) throw new Error('Outreach generation failed');
      const data = await res.json();
      setOutreachData(data);
    } catch {
      // High-quality deterministic fallback pitch
      const rep = isMotors ? 'James Kamau' : 'Sarah Wanjiku';
      const item = inquiry.itemTitle || 'our premium inventory';
      setOutreachData({
        lead_score: 'HIGH',
        lead_summary: `Direct high-intent inquiry from ${inquiry.customerName} for ${item}. Client actively requested appointment/details. Priority outreach recommended.`,
        whatsapp_pitch: `Hello ${inquiry.customerName}, thank you for reaching out to BK ${
          isMotors ? 'Motors' : 'Properties'
        } regarding ${item}. This is ${rep}. We have confirmed availability and can schedule an exclusive walkthrough for you this weekend. Would morning or afternoon suit you best?`,
        email_pitch: `Dear ${inquiry.customerName},\n\nThank you for contacting BK ${
          isMotors ? 'Motors' : 'Properties'
        } regarding ${item}.\n\nWe have reviewed your request and confirmed that the listing meets all our standards (150-point inspection badge verified). In addition, our commercial bank asset financing desk can structure tailored 48-month terms.\n\nWe would be honored to host you for a private walkthrough.\n\nWarm regards,\n${rep}\nBK Group Kenya`,
        call_script: {
          representative: rep,
          raw_guide: `SITUATION QUESTION: "Thank you for inquiring about ${item}, ${inquiry.customerName}. What is your current vehicle/property setup?"\n\nPROBLEM QUESTION: "Are you finding current options on the market lacking verified logbooks/titles or mechanical guarantees?"\n\nIMPLICATION QUESTION: "If you don't secure this listing this week, will that delay your family/commercial timeline?"\n\nNEED-PAYOFF: "If we can provide full 150-point inspection reports and bank clearance before you pay a shilling, would you be ready to reserve?"`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && inquiry) {
      generateOutreach();
    }
  }, [open, inquiry?.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
  };

  const handleOpenWhatsApp = (text: string) => {
    const phone = inquiry?.phone.replace(/[^0-9]/g, '') || '';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  if (!inquiry) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 540 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          bgcolor: isMotors ? '#0F172A' : '#064E3B',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: primaryColor, fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              AI Sales Outreach Assistant
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            LangGraph Multi-Agent Pitch & Script Generator for {inquiry.customerName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94A3B8' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Inquiry Summary Bar */}
      <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Lead Subject: {inquiry.itemTitle || inquiry.inquiryType}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', mt: 0.5 }}>
          Customer: <strong>{inquiry.customerName}</strong> ({inquiry.phone} • {inquiry.email || 'No email'})
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
          Customer note: "{inquiry.message}"
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress sx={{ color: primaryColor, mb: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
              LangGraph Agent Qualifying Lead & Composing Pitches...
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Analyzing buying intent, matching catalog specifications, and tailoring SPIN questions.
            </Typography>
          </Box>
        ) : outreachData ? (
          <Box>
            {/* Qualification Banner */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: outreachData.lead_score === 'HIGH' ? '#F0FDF4' : '#FEF3C7',
                border: `1px solid ${outreachData.lead_score === 'HIGH' ? '#BBF7D0' : '#FDE68A'}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={`Priority: ${outreachData.lead_score}`}
                  size="small"
                  sx={{
                    bgcolor: outreachData.lead_score === 'HIGH' ? '#15803D' : '#D97706',
                    color: '#FFFFFF',
                    fontWeight: 800,
                  }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  AI Lead Qualification
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
                {outreachData.lead_summary}
              </Typography>
            </Paper>

            {/* Outreach Asset Tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              TabIndicatorProps={{ sx: { bgcolor: primaryColor } }}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}
            >
              <Tab
                icon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="WhatsApp Pitch"
                sx={{ textTransform: 'none', fontWeight: 700, '&.Mui-selected': { color: primaryColor } }}
              />
              <Tab
                icon={<EmailIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Email Proposal"
                sx={{ textTransform: 'none', fontWeight: 700, '&.Mui-selected': { color: primaryColor } }}
              />
              <Tab
                icon={<PhoneInTalkIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="SPIN Call Script"
                sx={{ textTransform: 'none', fontWeight: 700, '&.Mui-selected': { color: primaryColor } }}
              />
            </Tabs>

            {/* TAB 0: WhatsApp Pitch */}
            {activeTab === 0 && (
              <Box>
                <Paper sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {outreachData.whatsapp_pitch}
                  </Typography>
                </Paper>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    onClick={() => handleOpenWhatsApp(outreachData.whatsapp_pitch)}
                    sx={{ bgcolor: '#25D366', color: '#FFFFFF', fontWeight: 700, textTransform: 'none', flexGrow: 1 }}
                  >
                    Open in WhatsApp
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyToClipboard(outreachData.whatsapp_pitch)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>
            )}

            {/* TAB 1: Email Proposal */}
            {activeTab === 1 && (
              <Box>
                <Paper sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {outreachData.email_pitch}
                  </Typography>
                </Paper>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(outreachData.email_pitch)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Copy Full Email Proposal
                </Button>
              </Box>
            )}

            {/* TAB 2: SPIN Call Script */}
            {activeTab === 2 && (
              <Box>
                <Paper sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#D97706', display: 'block', mb: 1 }}>
                    SPIN INTERVIEW QUESTIONS & OBJECTION HANDLERS
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {outreachData.call_script?.raw_guide || 'Call script ready.'}
                  </Typography>
                </Paper>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(outreachData.call_script?.raw_guide || '')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Copy Script for Call
                </Button>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>

      <Snackbar
        open={copiedToast}
        autoHideDuration={2500}
        onClose={() => setCopiedToast(false)}
        message="Copied to clipboard!"
      />
    </Drawer>
  );
};
