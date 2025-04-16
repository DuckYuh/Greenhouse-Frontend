import React from 'react'
import { TextField, Checkbox, FormControlLabel, Button, Typography, Divider, Box, Container, Grid, Paper,  IconButton, InputAdornment, Snackbar, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { assets } from '../../assets/asset'

const NewPassForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                stroke="black"
                sx={{
                p: 5,
                borderRadius: 12,
                width: '100%',
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                        New Password
                </Typography>

                <Box component="form" noValidate sx={{ mt: 2 }} >
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        placeholder="Enter your new password"
                        slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                    />  

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        variant="outlined"
                        margin="normal"
                        placeholder="Confirm your new password"
                        slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                    />      


                    <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2, py: 1.5 }}>
                        Confirm
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} color='black' ></Divider>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                        Already have an account?{' '}
                <Typography
                    component={Link} // Bọc Link trong Typography
                    to="/Login"
                    color="primary"
                    sx={{ fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
                >
                    Login
                </Typography>
                </Typography>

            </Paper>            
        </Container>
    )
};

export default NewPassForm;