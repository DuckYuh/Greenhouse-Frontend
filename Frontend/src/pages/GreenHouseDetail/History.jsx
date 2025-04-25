import React, { useState, useEffect } from 'react'
import { Paper, Table, TableBody, TableHead, TableRow, TableContainer, TableCell, InputBase, IconButton, Box, Typography, Pagination, PaginationItem, CssBaseline, Divider, Breadcrumbs,
  MenuItem, Select, FormControl, InputLabel, TextField
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Sidebar from '../../components/SideBar'
import { jwtDecode } from 'jwt-decode'
import { getSensorRecords, getListSensorAPI } from '../../apis/deviceApi'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'


const History = () => {
  const [sensorDatas, setSensorDatas] = useState([])
  const [deviceId, setdeviceId] = useState()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [searchDate, setSearchDate] = useState('')
  const [listSensor, setListSensor] = useState([])

  const param = useParams()
  const id = param.GreenHouseId


  const getListSensor = async (id, page) => {
    toast.promise(getListSensorAPI(id, page), { })
      .then((response) => {
        setListSensor(response.data)
        console.log('List Sensor:', response.data)
      })
  }

  const getSensorDatas = async () => {
    await toast.promise(getSensorRecords(deviceId, page), { })
      .then((response) => {
        setSensorDatas(response.data)
        console.log('Sensor Data:', response.data)
        setTotalPages(response.pagination.totalPages)
      })
  }

  useEffect(() => {
    getListSensor(id, page)
  }, [page, id])

  useEffect(() => {
    getSensorDatas()
  }, [deviceId, page])


  const handlePageChange = (event, value) => {
    setPage(value)
  }


  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="sensor-select-label">Chọn cảm biến</InputLabel>
          <Select
            labelId="sensor-select-label"
            value={deviceId}
            label="Chọn cảm biến"
            onChange={(e) => setdeviceId(e.target.value)}
          >
            {listSensor.map((sensor) => (
              <MenuItem key={sensor.SID} value={sensor.SID}>
                {sensor.sensorType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 300,
            border: '1px solid #ccc'
          }}
        >
          <TextField
            type="date"
            size="small"
            sx={{ ml: 1, flex: 1 }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
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
            {sensorDatas.map((sensorData) => {
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
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          renderItem={(item) => (
            <PaginationItem
              components={{
                previous: ArrowBackIosIcon,
                next: ArrowForwardIosIcon
              }}
              {...item}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default History