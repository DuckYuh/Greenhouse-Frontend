import React, { useState } from 'react';
import { Box, Typography, Divider, Breadcrumbs, Button, TextField, Stack, Alert, IconButton } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../../components/SideBar';// Assuming Sidebar is in the same directory
import CloseIcon from '@mui/icons-material/Close';

const Settings = () => {
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSave = () => {
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000); // Hide message after 3 seconds
    };

    return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', p: 3 }}
        >
        <Typography variant="h4" sx={{ mb: 2 }}>Settings</Typography>
        <Breadcrumbs sx={{}} aria-label="breadcrumb">
            <Typography color="inherit" sx={{ borderBottom: 3 }}>Settings</Typography>
        </Breadcrumbs>
        <Divider sx={{ mb: 3 }} color="#DDE1E6" />

        <Box sx={{ maxWidth: 600, mx: 'auto', backgroundColor: '#fff', p: 3, borderRadius: 2, boxShadow: 1 }}>
            {/* Profile Photo Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Profile Photo</Typography>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Box
                sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: '2rem',
                }}
            >
                🧑
            </Box>
            <Button variant="outlined" color="primary">
                Upload Photo
            </Button>
            <Box>
                <Typography variant="body2">Image requirements:</Typography>
                <Typography variant="body2">1. Min. 400 x 400px</Typography>
                <Typography variant="body2">2. Max 2MB</Typography>
                <Typography variant="body2">3. Your face or company logo</Typography>
            </Box>
            </Stack>

            {/* User Details Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>User Details</Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField fullWidth label="Username" variant="outlined" placeholder="Username" />
            <TextField fullWidth label="Email" variant="outlined" placeholder="Email" />
            <TextField fullWidth label="Phone Number" variant="outlined" placeholder="Phone Number" />
            <TextField fullWidth label="Password" variant="outlined" type="password" placeholder="Password" />
            </Stack>

            {/* Save Button */}
            <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>
            </Box>
        </Box>

        {/* Success Message */}
        {successMessage && (
            <Alert
            severity="success"
            sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccessMessage(false)}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            >
            Successfully Saved. Your profile settings have been saved!
            </Alert>
        )}
        </Box>
    </Box>
    );
};

export default Settings;