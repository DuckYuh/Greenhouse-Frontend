import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import Thermostat from '@mui/icons-material/Thermostat';

const Temperature = ({ total = 420, achieved = 1000 }) => {
  // Hardcoding the value for now (you can make this dynamic with props)
  const progress = (achieved / total) * 100; // Calculate the progress percentage


  return (
    <Box
      sx={{
        width: '100%',
        height: '100%', 
        backgroundColor: 'white', // Light purple background
        borderRadius: '20px', // Rounded corners
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #e0e0e0',
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow for depth
      }}
    >
      <Stack direction="row" spacing={1} mb={2} alignItems='center'>
        <Thermostat sx={{ fontSize: 50, color: '#000' }} />
        <Stack direction="column" spacing={1} mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>
          Temperature
        </Typography>
        <Stack direction="row" spacing={2} mb={2}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#616161', // Dark gray for "Achieved"
            }}
          />
          <Typography variant="caption">Achieved</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#bdbdbd', // Light gray for "Remaining"
            }}
          />
          <Typography variant="caption">Remaining</Typography>
        </Stack>
      </Stack>
        </Stack>   
      </Stack>

      {/* Achieved/Remaining Indicators */}
      {/* Total Value (420) */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        {achieved}°C
      </Typography>

      {/* Custom Progress Bar */}
      <Box
      sx={{
        backgroundColor: '#f3e5f5', // Background màu #f3e5f5 cho container bao quanh
        padding: '40px', // Khoảng cách giữa thanh tiến độ và container
        borderRadius: '20px', // Rounded corners
        display: 'inline-flex', // Đảm bảo container ôm sát nội dung
      }}
    >
      {/* Custom Progress Bar */}
      <Box
        sx={{
          width: '40px', // Narrow width for the vertical bar
          height: '350px', // Height of the progress bar
          backgroundColor: '#e0e0e0', // Light gray for the "Remaining" part
          borderRadius: '20px', // Rounded ends
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: `${progress}%`, // Dynamic height based on progress
            backgroundColor: '#616161', // Dark gray for the "Achieved" part
            borderRadius: '20px',
            position: 'absolute',
            bottom: 0, // Start from the bottom
          }}
        />
      </Box>
    </Box>

      
    </Box>
  );
};

export default Temperature;