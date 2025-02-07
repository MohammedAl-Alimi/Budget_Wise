import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, TextField, Paper, Grid,
  Card, CardContent, IconButton, Divider, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  AccountBalance as AccountIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');

  const fetchBalance = async () => {
    try {
      const token = await getToken();
      console.log('Using token:', token); // For debugging
      const response = await axios.get('http://localhost:5001/api/users/balance', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      setBalance(response.data.balance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    // Add function to fetch transaction history
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = await getToken();
        console.log('Token for initialization:', token);
        
        // First create/verify user account
        await axios.post(
          'http://localhost:5001/api/users/create-account',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Then fetch balance
        fetchBalance();
      } catch (error) {
        console.error('Error initializing:', error);
      }
    };

    if (user) {
      initializeUser();
    }
  }, [user]);

  const handleTransaction = async () => {
    try {
      const token = await getToken();
      console.log('Using token:', token); // For debugging
      const response = await axios.post(
        `http://localhost:5001/api/users/${transactionType}`,
        { amount: Number(amount) },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      console.log('Transaction response:', response.data);
      fetchBalance();
      setAmount('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Full error:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color, mr: 1 }} />
          <Typography color="textSecondary" variant="h6">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          ${value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              Welcome back, {user.firstName || user.username}!
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Current Balance"
            value={balance}
            icon={AccountIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Income"
            value="0"
            icon={IncomeIcon}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Expenses"
            value="0"
            icon={ExpenseIcon}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setTransactionType('deposit');
                      setOpenDialog(true);
                    }}
                  >
                    New Deposit
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setTransactionType('withdraw');
                      setOpenDialog(true);
                    }}
                  >
                    New Withdrawal
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <Box sx={{ height: 400, overflow: 'auto' }}>
                {transactions.length === 0 ? (
                  <Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
                    No transactions yet
                  </Typography>
                ) : (
                  transactions.map((transaction) => (
                    <Box key={transaction._id}>
                      {/* Transaction item */}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {transactionType === 'deposit' ? 'Make a Deposit' : 'Make a Withdrawal'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleTransaction} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 