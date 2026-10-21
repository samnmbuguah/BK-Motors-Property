import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Motors App
import { motorsTheme } from './apps/motors/theme';
import { MotorsNavbar } from './apps/motors/components/MotorsNavbar';
import { MotorsFooter } from './apps/motors/components/MotorsFooter';
import { MotorsHomePage } from './apps/motors/pages/MotorsHomePage';
import { MotorsInventoryPage } from './apps/motors/pages/MotorsInventoryPage';
import { MotorsDetailPage } from './apps/motors/pages/MotorsDetailPage';
import { MotorsSellCarPage } from './apps/motors/pages/MotorsSellCarPage';
import { MotorsContactPage } from './apps/motors/pages/MotorsContactPage';

// Properties App
import { propertyTheme } from './apps/properties/theme';
import { PropertyNavbar } from './apps/properties/components/PropertyNavbar';
import { PropertyFooter } from './apps/properties/components/PropertyFooter';
import { PropertyHomePage } from './apps/properties/pages/PropertyHomePage';
import { PropertyListingsPage } from './apps/properties/pages/PropertyListingsPage';
import { PropertyDetailPage } from './apps/properties/pages/PropertyDetailPage';
import { PropertyListPropertyPage } from './apps/properties/pages/PropertyListPropertyPage';
import { PropertyContactPage } from './apps/properties/pages/PropertyContactPage';

// Shared Components
import { PortalSwitcher } from './shared/components/PortalSwitcher';
import { WhatsAppButton } from './shared/components/WhatsAppButton';

export const App: React.FC = () => {
  // Determine target portal based on build flags, domain name, or local state
  const detectInitialPortal = (): 'motors' | 'properties' => {
    // 1. Build-time override
    if (typeof __BUILD_TARGET__ !== 'undefined') {
      if (__BUILD_TARGET__ === 'motors') return 'motors';
      if (__BUILD_TARGET__ === 'properties') return 'properties';
    }

    // 2. URL parameter override: ?portal=properties or ?portal=motors
    const searchParams = new URLSearchParams(window.location.search);
    const paramPortal = searchParams.get('portal');
    if (paramPortal === 'motors' || paramPortal === 'properties') {
      return paramPortal;
    }

    // 3. Domain detection
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('property') || hostname.includes('realestate')) {
      return 'properties';
    }
    if (hostname.includes('motor') || hostname.includes('car')) {
      return 'motors';
    }

    // 4. Stored preference or default to motors (Dealership)
    const stored = localStorage.getItem('bk_active_portal');
    if (stored === 'motors' || stored === 'properties') {
      return stored;
    }

    return 'motors';
  };

  const [activePortal, setActivePortal] = useState<'motors' | 'properties'>(detectInitialPortal);

  useEffect(() => {
    localStorage.setItem('bk_active_portal', activePortal);
    // Update document title dynamically
    if (activePortal === 'motors') {
      document.title = 'BK Motors | Premium Car Dealership Kenya';
    } else {
      document.title = 'BK Properties | Prime Real Estate & Homes Kenya';
    }
  }, [activePortal]);

  const handlePortalSwitch = (portal: 'motors' | 'properties') => {
    setActivePortal(portal);
  };

  const currentTheme = activePortal === 'motors' ? motorsTheme : propertyTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <PortalSwitcher currentPortal={activePortal} onSwitch={handlePortalSwitch} />

      <BrowserRouter>
        {activePortal === 'motors' ? (
          // BK MOTORS APP
          <div className="portal-motors" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <MotorsNavbar />
            <main style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<MotorsHomePage />} />
                <Route path="/inventory" element={<MotorsInventoryPage />} />
                <Route path="/vehicle/:slug" element={<MotorsDetailPage />} />
                <Route path="/sell" element={<MotorsSellCarPage />} />
                <Route path="/financing" element={<MotorsHomePage />} />
                <Route path="/contact" element={<MotorsContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <MotorsFooter />
            <WhatsAppButton
              phone="+254700000000"
              defaultMessage="Hello BK Motors Kenya, I would like to make an inquiry."
            />
          </div>
        ) : (
          // BK PROPERTIES APP
          <div className="portal-properties" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <PropertyNavbar />
            <main style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<PropertyHomePage />} />
                <Route path="/properties" element={<PropertyListingsPage />} />
                <Route path="/property/:slug" element={<PropertyDetailPage />} />
                <Route path="/list" element={<PropertyListPropertyPage />} />
                <Route path="/contact" element={<PropertyContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <PropertyFooter />
            <WhatsAppButton
              phone="+254711000000"
              defaultMessage="Hello BK Properties Kenya, I would like to inquire about real estate listings."
            />
          </div>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
