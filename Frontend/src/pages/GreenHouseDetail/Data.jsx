import { Card, CardContent, Typography, LinearProgress, Box, CssBaseline, Toolbar, Breadcrumbs, Link, Divider, Stack } from '@mui/material'
import { borderBottom, spacing, styled } from '@mui/system'
import Sidebar from '../../components/SideBar'
import Light from '../Data/Light'
import Humidity from '../Data/Humid'
import Temperature from '../Data/Temperature'
import Earth from '../Data/Earth'
import { useEffect, useState } from 'react'
import { subscribeGreenhouseData } from '../../apis/deviceApi'
import { useParams } from 'react-router-dom'
const Data = () => {
  const [humidityValue, setHumidityValue] = useState(null)
  const [lightValue, setLightValue] = useState(null)
  const [temperatureValue, setTemperatureValue] = useState(null)
  const [earthValue, setEarthValue] = useState(null)
  const [error, setError] = useState(null)
  const {GreenHouseId} = useParams()
  const greenhouseId = GreenHouseId

  const handleSensorData = (sensorData) => {
    sensorData.forEach(({ sensorType, value }) => {
      switch (sensorType) {
      case 'humidity':
        setHumidityValue(value)
        break
      case 'light':
        setLightValue(value)
        break
      case 'temperature':
        setTemperatureValue(value)
        break
      case 'earth':
        setEarthValue(value)
        break
      default:
        console.warn('Loại cảm biến không xác định:', sensorType)
      }
    })
  }

const handleSensorData_ele = (sensorData) => {
  console.log('Received data:', sensorData[0].sensorType)
  switch (sensorData[0].sensorType) {
    case 'humidity':
      setHumidityValue(sensorData[0].value)
      break
    case 'light':
      setLightValue(sensorData[0].value)
      break
    case 'temperature':
      setTemperatureValue(sensorData[0].value)
      break
    case 'earth':
      setEarthValue(sensorData[0].value)
      break
    default:
      console.warn('Loại cảm biến không xác định:', sensorData[0])
    }
}

  useEffect(() => {
    const eventSource = subscribeGreenhouseData(
      greenhouseId,
      (newData) => {
        console.log('Received data:', newData)
        
        if (Array.isArray(newData)) {
          handleSensorData(newData)
        }
        else {
          handleSensorData_ele(newData)
        }
      },
      (err) => setError('Không thể kết nối SSE')
    )
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <Stack direction="row" spacing={3} justifyContent="center" alignItems="stretch">
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Light achieved={lightValue !== null ? `${lightValue}` : '--'} total={100} />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Temperature achieved={temperatureValue !== null ? `${temperatureValue}` : '--'} total={100} />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Stack direction='column' spacing={2} justifyContent='center'>
          {/* <Box sx={{ flex: 1, textAlign: 'center' }}> */}
          <Humidity value={humidityValue !== null ? `${humidityValue}` : '--'} total={100} />
          {/* </Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}> */}
          <Earth value={earthValue !== null ? `${earthValue}` : '--'} total={100} />
          {/* </Box> */}
        </Stack>
      </Box>

    </Stack>
  )
}

export default Data