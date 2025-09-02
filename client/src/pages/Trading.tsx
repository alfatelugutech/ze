import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Trading: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Trading
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          Trading Interface - Coming Soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Trading;
