import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Button } from '@mui/material';
import { useAuth, UserButton, useClerk } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              <span style={{ color: '#000' }}>Budget</span>
              <span style={{ color: '#1976d2' }}>Wise</span>
            </Typography>
          </Box>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" signOutCallback={handleSignOut} />
          ) : (
            <Button 
              variant="contained" 
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 