import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Box, CssBaseline, Typography, Breadcrumbs,
  Divider, Tabs, Tab
} from '@mui/material'
import Sidebar from '../../components/SideBar'
import Devices from './Devices'
import Data from './Data'
import History from './History'
import GreenHouse from '../GreenHouse/GreenHouse'
import Schedule from './Schedule'

const tabComponents = {
  devices: <Devices />,
  data: <Data />,
  history: <History />,
  schedule: <Schedule />
}


const GreenHouseDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'data'
  const [tab, setTab] = useState(currentTab)

  useEffect(() => {
    setSearchParams({ tab })
  }, [tab])

  const handleTabChange = (_, newValue) => {
    setTab(newValue)
  }

  const name = localStorage.getItem('name')

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', p: 3 }}
      >
        <Typography variant='h4' sx={{ mb: 2 }}>{name ? name : GreenHouse}</Typography>
        <Divider color='#DDE1E6' />
        {/* Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Data" value="data" />
            <Tab label="Devices" value="devices" />
            <Tab label="History" value="history" />
            <Tab label="Schedule" value="schedule" />
          </Tabs>
        </Box>
        {tabComponents[tab]}
      </Box>
    </Box>
  )
}

export default GreenHouseDetail
