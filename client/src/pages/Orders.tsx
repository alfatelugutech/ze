import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Orders: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          Order History - Coming Soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Orders;
