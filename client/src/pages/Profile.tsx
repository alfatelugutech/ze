import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          User Profile - Coming Soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
