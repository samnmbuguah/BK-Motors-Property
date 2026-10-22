import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Chip,
  Dialog,
  Stack,
  Fade,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface MediaGalleryProps {
  images: string[];
  title: string;
  accentColor?: string;
  badgeText?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  images,
  title,
  accentColor = '#D97706',
  badgeText,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const safeImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ];

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [safeImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [safeImages.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Main Image Showcase Card */}
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 1.5,
          bgcolor: '#0F172A',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          '&:hover .gallery-nav-btn': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '&:hover .gallery-expand-hint': {
            opacity: 1,
          },
        }}
        onClick={() => openLightbox(currentIndex)}
      >
        <Box
          component="img"
          src={safeImages[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          sx={{
            width: '100%',
            height: { xs: 280, sm: 420, md: 460 },
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        />

        {/* Top Badges */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {badgeText && (
            <Chip
              label={badgeText}
              size="small"
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          )}
          <Chip
            icon={<PhotoCameraIcon sx={{ fontSize: 15, color: '#FFFFFF !important' }} />}
            label={`${currentIndex + 1} / ${safeImages.length}`}
            size="small"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Fullscreen Expand CTA Hint in Corner */}
        <Box
          className="gallery-expand-hint"
          sx={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            bgcolor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            px: 1.8,
            py: 0.8,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            fontSize: '0.82rem',
            fontWeight: 600,
            opacity: { xs: 1, sm: 0.9 },
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: accentColor,
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(currentIndex);
          }}
        >
          <FullscreenIcon sx={{ fontSize: 18 }} />
          <span>Click to view all {safeImages.length} photos</span>
        </Box>

        {/* Previous Button Overlay */}
        {safeImages.length > 1 && (
          <IconButton
            className="gallery-nav-btn"
            aria-label="Previous photo"
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 12,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              opacity: { xs: 0.9, sm: 0 },
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: accentColor,
                transform: 'translateY(-50%) scale(1.1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {/* Next Button Overlay */}
        {safeImages.length > 1 && (
          <IconButton
            className="gallery-nav-btn"
            aria-label="Next photo"
            onClick={handleNext}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              opacity: { xs: 0.9, sm: 0 },
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: accentColor,
                transform: 'translateY(-50%) scale(1.1)',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Card>

      {/* Thumbnail Strip Carousel */}
      {safeImages.length > 1 && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            overflowX: 'auto',
            pb: 1,
            pt: 0.5,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#CBD5E1',
              borderRadius: 3,
            },
          }}
        >
          {safeImages.map((img, idx) => {
            const isSelected = currentIndex === idx;
            return (
              <Box
                key={idx}
                component="img"
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: { xs: 75, sm: 95 },
                  height: { xs: 55, sm: 68 },
                  flexShrink: 0,
                  borderRadius: 2,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: isSelected
                    ? `3px solid ${accentColor}`
                    : '2px solid #E2E8F0',
                  boxShadow: isSelected
                    ? `0 0 12px ${accentColor}44`
                    : 'none',
                  opacity: isSelected ? 1 : 0.65,
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.04)',
                    borderColor: accentColor,
                  },
                }}
              />
            );
          })}
        </Stack>
      )}

      {/* Fullscreen Lightbox Modal */}
      <Dialog
        fullScreen
        open={isLightboxOpen}
        onClose={closeLightbox}
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 15, 30, 0.97)',
            backdropFilter: 'blur(16px)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 0,
          },
        }}
      >
        {/* Top Header Bar */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.95rem', sm: '1.15rem' },
                maxWidth: { xs: 200, sm: 500 },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography>
            <Chip
              label={`Photo ${currentIndex + 1} of ${safeImages.length}`}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={isZoomed ? 'Zoom Out (100%)' : 'Zoom In (150%)'}>
              <IconButton
                onClick={() => setIsZoomed(!isZoomed)}
                sx={{
                  color: '#FFFFFF',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
                aria-label="Toggle photo zoom"
              >
                {isZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Close Fullscreen (Esc)">
              <IconButton
                onClick={closeLightbox}
                sx={{
                  color: '#FFFFFF',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: '#EF4444' },
                }}
                aria-label="Close fullscreen gallery"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Central Stage with Large Image and Arrow Nav */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            px: { xs: 1, sm: 6 },
            py: 2,
            overflow: 'auto',
          }}
          onClick={(e) => {
            // Click outside the image to zoom or toggle
            if (e.target === e.currentTarget) {
              setIsZoomed(!isZoomed);
            }
          }}
        >
          {/* Previous Arrow Button */}
          {safeImages.length > 1 && (
            <IconButton
              onClick={handlePrev}
              aria-label="Previous photo in fullscreen"
              sx={{
                position: 'fixed',
                left: { xs: 10, sm: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                p: { xs: 1, sm: 1.8 },
                zIndex: 10,
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: accentColor,
                  transform: 'translateY(-50%) scale(1.1)',
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          )}

          {/* Large Main Image */}
          <Box
            component="img"
            src={safeImages[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            onClick={() => setIsZoomed(!isZoomed)}
            sx={{
              maxHeight: isZoomed ? 'none' : '75vh',
              maxWidth: isZoomed ? 'none' : '90vw',
              width: isZoomed ? '140%' : 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              transition: 'transform 0.3s ease, width 0.3s ease',
              userSelect: 'none',
            }}
          />

          {/* Next Arrow Button */}
          {safeImages.length > 1 && (
            <IconButton
              onClick={handleNext}
              aria-label="Next photo in fullscreen"
              sx={{
                position: 'fixed',
                right: { xs: 10, sm: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                p: { xs: 1, sm: 1.8 },
                zIndex: 10,
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: accentColor,
                  transform: 'translateY(-50%) scale(1.1)',
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          )}
        </Box>

        {/* Bottom Thumbnail Track */}
        {safeImages.length > 1 && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                overflowX: 'auto',
                maxWidth: '92vw',
                py: 0.5,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 5 },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                },
              }}
            >
              {safeImages.map((img, idx) => {
                const isSelected = currentIndex === idx;
                return (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`Fullscreen thumbnail ${idx + 1}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsZoomed(false);
                    }}
                    sx={{
                      width: { xs: 65, sm: 80 },
                      height: { xs: 45, sm: 55 },
                      borderRadius: 1.5,
                      flexShrink: 0,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: isSelected
                        ? `3px solid ${accentColor}`
                        : '2px solid transparent',
                      opacity: isSelected ? 1 : 0.5,
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.08)',
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
