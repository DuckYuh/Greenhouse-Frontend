import React from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';

const Humidity = ({ total = 100, value = 67 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white', // Light purple background
        padding: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        width: '100%'
      }}
    >
      <Stack direction="row" spacing={1} mb={2} alignItems='center'>
        <WaterDropOutlinedIcon sx={{ fontSize: 50, color: '#000' }} />
        <Stack direction="column" spacing={1} mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>
          Humidity
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

      {/* Vòng tròn tiến trình */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Vòng nền (Remaining) */}
        <CircularProgress
          variant="determinate"
          value={100} // Vòng nền
          size={200}
          thickness={5}
          sx={{
            color: '#e0e0e0',
            position: 'absolute',
            left: 0,
            transform: 'rotate(90deg)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {/* Vòng tiến trình (Achieved) */}
        <CircularProgress
          variant="determinate"
          value={value} // Giá trị phần trăm
          size={200}
          thickness={5}
          sx={{
            color: '#616161',
            transform: 'rotate(90deg)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            },
          }}
        />
        {/* Hiển thị phần trăm ở giữa */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" component="div" color="text.secondary">
            {value}%
          </Typography>
        </Box>
      </Box>

      
    </Box>
  );
};

export default Humidity;