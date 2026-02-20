/* eslint-disable semi */
import React from 'react'
import { TextField, Checkbox, FormControlLabel, Button, Typography, Divider, Box, Container, Grid, Paper,  IconButton, InputAdornment, Snackbar, Alert } from '@mui/material'
import { assets } from '../../assets/asset.js'
import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import { Link } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { login } from '../../apis/auth';
import { useNavigate } from 'react-router-dom';
import { loginUserAPI } from '../../redux/Slices/userSlice.js'
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required!');
      setLoading(false);
      return;
    }

    // const data = dispatch(loginUserAPI(loginUserAPI({email, password})));
    await toast.promise(login(email, password), {
      pending: 'Logging in...'
    }).then((res) => {
      // localStorage.setItem('token', data.access_token);
      Cookies.set('token', res.access_token, {
        expires: 7,
        // secure: true,
        sameSite: 'Lax'
      });
      Cookies.set('refreshToken', res.refresh_token, {
        expires: 7,
        // secure: true,
        sameSite: 'Lax'
      });

      navigate('/');
    }).catch((err) => {
      setError(err.message);
    }) .finally(() => {
      setLoading(false);
    })
  }
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Snackbar
        open={open}
        autoHideDuration={3000} // Tự động đóng sau 3 giây
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          This is a success message!
        </Alert>
      </Snackbar>
      <Paper
        stroke="black"
        sx={{
          p: 8,
          borderRadius: 12,
          width: '100%',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Welcome back!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom textAlign="center">
            Please log in to continue
        </Typography>


        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit} >
          {error && <Typography color="error" textAlign={'center'}>{error}</Typography>}
          {/* Username */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !email.trim()}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            placeholder="Enter your password"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Remember & Forgot Password */}
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember for 30 days"
            />
            <Typography component={Link} to="/verify" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Forgot password?
            </Typography>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color= "success"
            sx={{ mt: 2, py: 1.5, borderRadius: 12 }}
          >
              Login
          </Button>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3 }} color='black' ></Divider>

        {/* Sign Up Link */}
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don't have an account?{' '}
          <Typography
            component={Link} // Bọc Link trong Typography
            to="/Signup"
            color="primary"
            sx={{ fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
          >
                Sign up
          </Typography>
        </Typography>
      </Paper>
    </Container>
  )
}

export default LoginForm