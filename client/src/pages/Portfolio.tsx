import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip } from '@mui/material';

const Portfolio: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          Portfolio Overview - Coming Soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Portfolio;
