import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableHead, TableRow, TableContainer, TableCell, InputBase, IconButton, Box, Typography, Pagination, PaginationItem, CssBaseline, Divider, Breadcrumbs } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../../components/SideBar';
import {jwtDecode} from 'jwt-decode';
import { getSensorRecords } from '../../apis/deviceApi';
import { fetchSensors } from '../../apis/deviceApi';



const HistoryTable = () => {
  const [sensorDatas, setSensorDatas] = useState([]);
  const [deviceType, setdeviceType] = useState("humidity");
  const [deviceId, setdeviceId] = useState(1);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  
  useEffect(() => {
    const getSensorIdByType = async () => {
      try {
        const response = await fetchSensors(1) // page = 1, greenhouseId mặc định là 1
        const sensors = response.data
        const matchedSensor = sensors.find(sensor => sensor.sensorType === deviceType)
        if (matchedSensor) {
          setdeviceId(matchedSensor.SID) // hoặc matchedSensor.SID nếu bạn dùng SID là sensor ID
        } else {
          console.warn(`No sensor found with type: ${deviceType}`)
        }
      } catch (error) {
        console.error('Error fetching sensors list:', error)
      }
    }
  
    getSensorIdByType()
  }, [deviceType])

  useEffect(() => {
    const limit = 10;
    const getSensorDatas = async () => {
      try {
        const response = await getSensorRecords(deviceId,page,limit)
        setSensorDatas(response.data)
        console.log('Sensor Data:', response.data)
        setTotalPages(response.pagination.totalPages)
      } catch (error) {
        console.error('Error fetching Sensor Data:', error)
      }
    };
    getSensorDatas()
  }, [page,deviceId])

  const handlePageChange = (event, value) => {
    setPage(value)
  }
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', p: 3 }}>
        <Typography variant='h4' sx={{ mb: 2 }}>History</Typography>
        <Breadcrumbs sx={{}} aria-label="breadcrumb">
          <Typography color="inherit" onClick={() => setdeviceType("humidity")} style={{ cursor: "pointer", borderBottom: deviceType === "humidity" ? "3px solid black" : "none" }}>Humidity</Typography>
          <Typography color="inherit" onClick={() => setdeviceType("light")} style={{ cursor: "pointer", borderBottom: deviceType === "light" ? "3px solid black" : "none" }}>Light</Typography>
          <Typography color="inherit" onClick={() => setdeviceType("temperature")} style={{ cursor: "pointer", borderBottom: deviceType === "temperature" ? "3px solid black" : "none" }}>Temperature</Typography>
          <Typography color="inherit" onClick={() => setdeviceType("earth")} style={{ cursor: "pointer", borderBottom: deviceType === "earth" ? "3px solid black" : "none" }}>Earth</Typography>
        </Breadcrumbs>

        <Divider sx={{ mb: 1 }} color='#DDE1E6' ></Divider>

        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            <Paper
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 300,
                border: '1px solid #ccc'
              }}
              >
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="yyyy-mm-dd" />
              <IconButton type="submit" sx={{ p: '10px' }}>
              <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="device table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2">Date</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Data</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensorDatas.map((sensorData) => (
                  <TableRow key={sensorData.CID}>
                    <TableCell>{sensorData.dateCreated}</TableCell>
                    <TableCell>{sensorData.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIosIcon,
                    next: ArrowForwardIosIcon,
                  }}
                  {...item}
                />
              )}
            />
          </Box>

        </Box>   
      </Box>

    </Box>
  );
};

export default HistoryTable;