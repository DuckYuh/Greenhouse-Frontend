import React from 'react';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import Sidebar from '../../components/SideBar';
import { assets } from '../../assets/asset'

const drawerWidth = 240;

const Home = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh' }}
      >
        {/* Banner Section */}
        <Box
          sx={{
            backgroundImage: `url(${assets.backgroundAuth})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 300,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            sx ={{
              color: 'white',
              fontWeight: 'bold',
              width: '50%',
              pl: 10
            }} >
            <Typography variant="h4">Drive Business Growth</Typography>
            <Typography variant="body1" paragraph>
              Pellentesque convallis accumsan suscipit aliquet eu diam quis nulla turpis. In mus massa lectus
              laoreet sed semper bibendum id. iaculis purus malesuada porttitor aliquam pulvinar.
            </Typography>
          </Box>
        </Box>
        {/* Blog Section */}
        <Box
          sx ={{
            pt: 5,
            pr: 10,
            pb: 10,
            pl: 10
          }}
        >
          <Box
            sx ={{
              width: '100%',
              placeItems: 'center',
              pb: 5
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Read The Blog
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Pellentesque convallis accumsan suscipit aliquet eu diam quis nulla turpis. In mus massa lectus
            laoreet sed semper bibendum id. iaculis purus malesuada porttitor aliquam pulvinar.
          </Typography>
          <Typography variant="body1" paragraph>
            Pellentesque convallis accumsan suscipit aliquet eu diam quis nulla turpis. In mus massa lectus
            laoreet sed semper bibendum id. iaculis purus malesuada porttitor aliquam pulvinar.
          </Typography>
          <Typography variant="body1" paragraph>
            Pellentesque convallis accumsan suscipit aliquet eu diam quis nulla turpis. In mus massa lectus
            laoreet sed semper bibendum id. iaculis purus malesuada porttitor aliquam pulvinar.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
