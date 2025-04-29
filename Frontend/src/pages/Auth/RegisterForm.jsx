import React, { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../apis/auth'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Username, email, and password are required!')
      setLoading(false)
      return
    }

    await toast.promise(signup(username, email, password), {
      pending: 'Signing up...'
    }).then((res) => {
      Cookies.set('token', res.access_token, { expires: 7, sameSite: 'Lax' })
      Cookies.set('refreshToken', res.refresh_token, { expires: 7, sameSite: 'Lax' })
      navigate('/')
    }).catch((err) => {
      setError(err.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        sx={{
          p: 5,
          borderRadius: 12,
          width: '100%',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Sign Up Free
        </Typography>

        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
          {error && <Typography color="error" textAlign={'center'}>{error}</Typography>}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error && !username.trim()}
          />

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

          {/* Optional confirm password logic could be added here */}

          <FormControlLabel control={<Checkbox color="success" />} label="I agree to the Terms and Conditions" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }} />

          <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2, py: 1.5 }}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} color='black'></Divider>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Typography
            component={Link}
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
}

export default RegisterForm