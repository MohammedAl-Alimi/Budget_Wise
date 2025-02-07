import { SignIn, SignUp } from "@clerk/clerk-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from './Dashboard';
import ProtectedPage from './ProtectedPage';
import { Box } from '@mui/material';

function AppRoutes() {
  const navigate = useNavigate();

  const appearance = {
    layout: {
      socialButtonsPlacement: "bottom",
      socialButtonsVariant: "iconButton",
      privacyPageUrl: "https://clerk.com/privacy",
      termsPageUrl: "https://clerk.com/terms",
    },
    elements: {
      rootBox: {
        width: '450px',
        margin: '40px auto',
      },
      card: {
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      },
      headerTitle: {
        fontSize: '24px',
        fontWeight: 600,
      },
      formButtonPrimary: {
        backgroundColor: '#1976d2',
        fontSize: '16px',
      },
      socialButtonsIconButton: {
        width: '40px',
        height: '40px',
      },
    },
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5'
    }}>
      <Routes>
        <Route 
          path="/sign-in/*" 
          element={<SignIn 
            routing="path" 
            path="/sign-in" 
            appearance={appearance}
          />} 
        />
        <Route 
          path="/sign-up/*" 
          element={<SignUp 
            routing="path" 
            path="/sign-up" 
            appearance={appearance}
          />} 
        />
        <Route
          path="/"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />
      </Routes>
    </Box>
  );
}

export default AppRoutes; 