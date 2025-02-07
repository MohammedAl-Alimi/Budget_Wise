import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container,
  Card, CardContent, Alert, CircularProgress
} from '@mui/material';
import axios from 'axios';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:5001${endpoint}`, {
        username,
        password
      });
      
      if (!isLogin) {
        setIsLogin(true);
        setUsername('');
        setPassword('');
        alert('Registration successful! Please login.');
        return;
      }
      
      localStorage.setItem('token', response.data.token);
      onLogin(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
          <span style={{ color: '#000' }}>Budget</span>
          <span style={{ color: '#1976d2' }}>Wise</span>
        </Typography>
        
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isLogin ? 'Login' : 'Register'
                )}
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                disabled={loading}
              >
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Auth; 