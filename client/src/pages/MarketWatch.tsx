import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MarketWatch: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Market Watch
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          Market Watch - Coming Soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default MarketWatch;
