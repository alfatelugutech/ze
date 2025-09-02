import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  ShowChart,
  Notifications,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const mockPortfolioValue = 125000;
  const mockDailyChange = 2500;
  const mockPositions = [
    { symbol: 'RELIANCE', quantity: 100, pnl: 1500, change: '+2.5%' },
    { symbol: 'TCS', quantity: 50, pnl: -200, change: '-0.8%' },
    { symbol: 'INFY', quantity: 75, pnl: 800, change: '+1.2%' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Portfolio Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Portfolio Value
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                ₹{mockPortfolioValue.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="success.main">
                +₹{mockDailyChange.toLocaleString()} (+2.0%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Cash
              </Typography>
              <Typography variant="h3" component="div" color="secondary">
                ₹25,000
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ready for trading
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<TrendingUp />}>
            Place Order
          </Button>
          <Button variant="outlined" startIcon={<ShowChart />}>
            Market Watch
          </Button>
          <Button variant="outlined" startIcon={<AccountBalance />}>
            View Portfolio
          </Button>
          <Button variant="outlined" startIcon={<Notifications />}>
            Alerts
          </Button>
        </Box>
      </Paper>

      {/* Recent Positions */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Positions
        </Typography>
        <Grid container spacing={2}>
          {mockPositions.map((position) => (
            <Grid item xs={12} sm={6} md={4} key={position.symbol}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {position.symbol}
                  </Typography>
                  <Typography color="textSecondary">
                    Qty: {position.quantity}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">
                      P&L: ₹{position.pnl.toLocaleString()}
                    </Typography>
                    <Chip
                      label={position.change}
                      color={position.pnl >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
