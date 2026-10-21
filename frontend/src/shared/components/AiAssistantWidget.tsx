import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/formatters';

interface AiAssistantWidgetProps {
  portal: 'motors' | 'properties';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedCards?: any[];
  timestamp: string;
}

const AI_API_URL =
  import.meta.env.VITE_AI_API_URL || 'https://bkai.169-58-102-217.sslip.io';

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({ portal }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const isMotors = portal === 'motors';
  const primaryColor = isMotors ? '#D97706' : '#059669';
  const brandTitle = isMotors ? 'BK Motors AI Concierge' : 'BK Properties AI Advisor';
  const consultantName = isMotors ? 'James Kamau (Motors)' : 'Sarah Wanjiku (Properties)';

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: isMotors
            ? `Hello! I am your BK Motors AI Concierge. I can help you search our live vehicle inventory, calculate commercial bank financing (at 13% APR), explain our 150-point inspection badge, or arrange a test drive along Ngong Road or Kiambu Road. How can I help you today?`
            : `Hello! I am your BK Properties AI Real Estate Advisor. I can guide you through prime Kenyan properties, land title deed due diligence (Freehold vs Leasehold), soil types, and 15-year mortgage calculations. What kind of home or plot are you searching for?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [portal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const starterChips = isMotors
    ? [
        '🔥 In-stock Toyota Prado TX-L',
        '💰 Calculate KES 4.5M loan repayment',
        '🛡️ What is 150-Point Inspection?',
        '🚗 Value my trade-in car',
      ]
    : [
        '🏡 Plots for sale under KES 20M',
        '📜 Freehold vs Leasehold Title Deeds',
        '📈 Karen vs Runda investment yields',
        '🏦 Estimate 15-year mortgage on KES 60M',
      ];

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch(`${AI_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          portal,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('AI service error');
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.response || 'I am ready to help you further with our listings.',
        recommendedCards: data.recommended_items || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      // Offline fallback response
      let fallbackText = '';
      if (isMotors) {
        fallbackText = `We currently have in-stock: 2020 Toyota Land Cruiser Prado TX-L (KES 7,850,000) and 2018 Subaru Forester XT (KES 3,150,000). Commercial bank asset financing is available from 13% APR with a 20% down payment over 48 months. Would you like our sales desk to contact you?`;
      } else {
        fallbackText = `At BK Properties, we offer luxury homes in Karen and Runda, plus ready-title 1/2-acre red soil plots in Ruiru (KES 18,500,000). Commercial mortgages are available over 15-20 years. Would you like to schedule a private walkthrough?`;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleWhatsAppForward = () => {
    const phone = isMotors ? '254700000000' : '254711000000';
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text || 'Inquiry';
    const text = encodeURIComponent(
      `Hello ${consultantName}, I was chatting with your BK AI Assistant regarding: "${lastUserMsg}". Could you assist me further?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Floating Action Launcher */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 85, md: 95 },
          right: { xs: 20, md: 28 },
          zIndex: 1150,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Fab
          variant="extended"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: primaryColor,
            color: '#FFFFFF',
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '0.9rem',
            px: 2.2,
            py: 1.2,
            boxShadow: `0 8px 24px ${primaryColor}66`,
            border: '2px solid rgba(255,255,255,0.3)',
            '&:hover': { bgcolor: primaryColor, opacity: 0.95, transform: 'scale(1.03)' },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <AutoAwesomeIcon sx={{ mr: 1, fontSize: 20 }} />
          {isMotors ? 'Ask Car AI' : 'Ask Property AI'}
        </Fab>
      </Box>

      {/* Slide-in Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 440 },
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            bgcolor: isMotors ? '#0F172A' : '#064E3B',
            color: '#FFFFFF',
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: primaryColor, width: 42, height: 42 }}>
              <AutoAwesomeIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {brandTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                Powered by LangGraph & NVIDIA NIM
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Clear Conversation">
              <IconButton size="small" onClick={handleClearChat} sx={{ color: '#94A3B8' }}>
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#94A3B8' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Quick Suggestion Chips */}
        <Box sx={{ p: 1.8, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {starterChips.map((chip, idx) => (
            <Chip
              key={idx}
              label={chip}
              size="small"
              onClick={() => handleSend(chip)}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F1F5F9', borderColor: primaryColor },
              }}
            />
          ))}
        </Box>

        {/* Messages Body */}
        <Box sx={{ flexGrow: 1, p: 2.5, overflowY: 'auto', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  maxWidth: '85%',
                  p: 1.8,
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  bgcolor: msg.sender === 'user' ? primaryColor : '#F1F5F9',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {msg.text}
              </Box>

              {/* Recommended Catalog Cards inside Chat */}
              {msg.recommendedCards && msg.recommendedCards.length > 0 && (
                <Box sx={{ mt: 1.5, width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                    Matched Recommendations:
                  </Typography>
                  {msg.recommendedCards.map((item: any, i: number) => (
                    <Card
                      key={i}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        bgcolor: '#F8FAFC',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 700 }}>
                          {formatPrice(item.price, currency)}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setOpen(false);
                          if (isMotors) {
                            navigate(`/vehicle/${item.slug || 'prado'}`);
                          } else {
                            navigate(`/property/${item.slug || 'villa'}`);
                          }
                        }}
                        sx={{
                          bgcolor: '#0F172A',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                      >
                        View
                      </Button>
                    </Card>
                  ))}
                </Box>
              )}

              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', mt: 0.5, px: 0.5 }}>
                {msg.timestamp}
              </Typography>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
              <CircularProgress size={18} sx={{ color: primaryColor }} />
              <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                Analyzing catalog and financing terms with LangGraph...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* WhatsApp Forward Bar */}
        <Box sx={{ px: 2, py: 1, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
            onClick={handleWhatsAppForward}
            sx={{ textTransform: 'none', color: '#334155', fontWeight: 600, fontSize: '0.8rem' }}
          >
            Forward to {consultantName} via WhatsApp
          </Button>
        </Box>

        {/* Input Bar */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          sx={{
            p: 2,
            bgcolor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={isMotors ? 'Ask about Prado, financing, trade-in...' : 'Ask about Karen villas, title deeds, mortgages...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '0.88rem',
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={!input.trim() || loading}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              '&:hover': { bgcolor: primaryColor, opacity: 0.9 },
              '&.Mui-disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};
