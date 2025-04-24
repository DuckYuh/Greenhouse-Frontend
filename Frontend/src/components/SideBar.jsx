import React, { useState, useEffect } from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, TextField, InputAdornment, Box, Button, Popover } from '@mui/material'
import { Home, Storage, Devices, CalendarToday, History, Search } from '@mui/icons-material'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import { Badge } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../util/authen.js'
import { fetchUnreadNotifications } from '../apis/notification.js'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import GreenHouse from '../pages/GreenHouse/GreenHouse.jsx'


const drawerWidth = 240
const Sidebar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)

  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'notification-popover' : undefined

  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  // const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([])
  const menuItems = [
    {
      text: 'Home',
      icon: <Home sx={{ color: 'black' }} />,
      path: '/'
    },
    { text: 'Green House', icon: <Storage sx={{ color: 'black' }}/>, path: '/GreenHouse' }

  ]

  const filteredItems = menuItems.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
  const isAuthenticated = !!isLoggedIn()

  const loadNotifications = async () => {
      const eventSource = fetchUnreadNotifications(
      1,
    (res) => {
        console.log('Fetched notifications:', res)
        setNotifications(res)
      },
    (error) => {
        console.error('Error fetching notifications:', error)
        toast.error('Error fetching notifications')
      })
      return () => {
        eventSource.close()
      }

  }

  useEffect(() => {
    loadNotifications()
    // const interval = setInterval(loadNotifications, 10000);
    // return () => clearInterval(interval);
  }, [])

  const handleLogout = () => {
    Cookies.remove('token')
    navigate('/Login')
  }
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#84FB9D',
          color: 'black',
          padding: 2
        }
      }}
    >
      <Toolbar>
        <Typography variant='h5' sx={{ fontWeight: 'bold', width: '100%' }} textAlign={'center'}>
          Green House
        </Typography>
      </Toolbar>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 2 }}>
        <AccountCircleRoundedIcon sx={{ cursor: 'pointer' }} onClick={() => navigate('/') } ></AccountCircleRoundedIcon>
        <SettingsRoundedIcon sx={{ cursor: 'pointer' }} onClick ={() => navigate('/setting')}></SettingsRoundedIcon>
        <Box>
          <Badge variant="dot" color="error" invisible={notifications.length === 0}>
            <NotificationsActiveRoundedIcon
              sx={{ cursor: 'pointer' }}
              onClick={handleClick}
            />
          </Badge>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            sx={{ maxWidth: 300 }}
          >
            <List sx={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <ListItem key={item.NID} divider>
                    <ListItemText
                      primary={item.message}
                      secondary={new Date(item.dateCreated).toLocaleString()}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ p: 2 }}>No unread notifications</Typography>
              )}
            </List>
          </Popover>
        </Box>
      </Box>
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Search...'
        size='small'
        sx={{ marginBottom: 2, backgroundColor: 'white', borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          )
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ backgroundColor: location.pathname === item.path ? 'white' : 'transparent' }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {!isAuthenticated ?
        (
          <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            <Button variant='outlined' color='primary' fullWidth onClick={() => navigate('/Login')}>
              Log In
            </Button>
            <Button variant='contained' color='primary' fullWidth onClick={() => navigate('/Signup')}>
              Sign Up
            </Button>
          </Box>
        ):(
          <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            <Button variant='outlined' color='primary' fullWidth onClick={handleLogout}>
              Log out
            </Button>
          </Box>
        )
      }

    </Drawer>
  )
}

export default Sidebar
