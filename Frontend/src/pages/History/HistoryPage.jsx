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
  const [filterDate, setFilterDate] = useState('');
  
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

  const filteredSensorDatas = sensorDatas.filter((sensorData) => {
    if (!filterDate) return true;
    const date = new Date(sensorData.dateCreated).toISOString().split('T')[0];
    return date === filterDate;
  });

  const effectiveTotalPages = filterDate
    ? Math.ceil(filteredSensorDatas.length / 10)
    : totalPages;

  const paginatedSensorDatas = filterDate
    ? filteredSensorDatas.slice((page - 1) * 10, page * 10)
    : filteredSensorDatas;
  

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
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1); // reset về page 1 khi filter
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 300,
                border: '1px solid #ccc'
              }}
              >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Date: yyyy-mm-dd"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
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
                    <Typography variant="subtitle2">Time</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Value</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSensorDatas.map((sensorData) => {
                  const date = new Date(sensorData.dateCreated);
                  const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd
                  const formattedTime = date.toTimeString().split(' ')[0]; // hh:mm:ss

                  return (
                    <TableRow key={sensorData.CID}>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{formattedTime}</TableCell>
                      <TableCell>{sensorData.value}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={effectiveTotalPages}
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