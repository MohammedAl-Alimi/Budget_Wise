import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ClerkProvider } from '@clerk/clerk-react';
import Routes from './components/Routes';
import Navbar from './components/Navbar';
import { theme } from './theme';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes />
        </ThemeProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
