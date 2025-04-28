import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  PaginationItem,
  CssBaseline,
  Divider,
  Breadcrumbs,
  Switch,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../../components/SideBar';
import {fetchDevices} from '../../apis/deviceApi';
import {sendDataToDevice} from '../../apis/deviceApi';
import { addController } from '../../apis/deviceApi';
import { addSensor } from '../../apis/deviceApi';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

const Devices = () => {
  const [devices, setDevices] = useState([])
  
    // State for pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const sliderRef = useRef();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDevices, setFilteredDevices] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [deviceType, setDeviceType] = useState('Controller');
  const [formData, setFormData] = useState({
    topic: '',
    deviceType: '',
    controllerType: '',
    sensorType: '',
    value: 0,
    maxValue: 100,
    status: 0,
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      const gid = localStorage.getItem('gid')
  
      const commonData = {
        topic: formData.topic,
        deviceType: formData.deviceType,
        greenHouseId: gid, // Tùy theo logic app bạn
        userId: userId,
      };
  
      if (deviceType === 'Controller') {
        await addController({
          ...commonData,
          controllerType: formData.controllerType,
          value: Number(formData.value),
          status: Number(formData.status),
        });
      } else {
        await addSensor({
          ...commonData,
          sensorType: formData.sensorType,
          maxValue: Number(formData.maxValue),
        });
      }
  
      handleCloseDialog();
      setPage(1); // Refresh lại trang đầu
    } catch (error) {
      console.error("Failed to add device", error);
    }
  };
  
    useEffect(() => {
      const getDevices = async () => {
        try {
          const gid = localStorage.getItem('gid')
          const response = await fetchDevices(page,gid)
          setDevices(response.data);
          setFilteredDevices(response.data); // Ban đầu hiện tất cả
          setTotalPages(response.totalPages);
          console.log('Devices:', devices)
        } catch (error) {
          console.error('Error fetching devices:', error)
        }
      };
      getDevices()
    }, [page])
  
    // Handle checkbox toggle
    const sendDataToDeviceAsync = useCallback(async (cid, status, value, userId) => {
      try {
        await sendDataToDevice(cid, status, value, userId)
      } catch (error) {
        console.error('Không thể cập nhật thiết bị:', error)
        // Rollback về trạng thái ngược lại nếu API thất bại
        setFilteredDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.CID === cid ? { ...device, status: status === 1 ? 0 : 1 } : device
          )
        )
      }
    }, [])
  
    const handleCheckboxChange = useCallback((cid, currentStatus) => {
      const newStatus = currentStatus > 0 ? 1 : 0
      const newValue = currentStatus
  
      // Kiểm tra trạng thái trước và sau khi cập nhật
      console.log(`Trước: CID=${cid}, status=${currentStatus}, sẽ thành ${newStatus}`)
  
      // Cập nhật trạng thái ngay lập tức
      setFilteredDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.CID === cid ? { ...device, status: newStatus, value: newValue } : device
        )
      )
  
      // Gửi API ở background
      const token = Cookies.get('token')
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.sub
  
      if (!userId) {
        console.error('Thiếu ID người dùng!')
        return
      }
  
      sendDataToDeviceAsync(cid, newStatus, newValue, userId)
    }, [sendDataToDeviceAsync])
  
  
    // Handle page change
    const handlePageChange = (event, value) => {
      setPage(value)
    }

    const handleSearchChange = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
    
      const filtered = devices.filter(device => {
        const type = device.controllerType || device.sensorType || '';
        return type.toLowerCase().includes(term);
      });
    
      setFilteredDevices(filtered);
    };

  return (
    <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    New Device
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper
                    component="form"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: 300,
                      border: '1px solid #ccc'
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search by type"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }}>
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Box>
              </Box>
              {/* Table Section */}
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="device table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">On</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Author</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Type</Typography>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.CID}>
                        <TableCell>
                          <Slider
                            value={device.value}
                            step={1}
                            min={0}
                            max={100}
                            onChange={(_, newValue) => {
                              // Cập nhật UI tạm thời khi kéo slider
                              setFilteredDevices((prevDevices) =>
                                prevDevices.map((d) =>
                                  d.CID === device.CID ? { ...d, value: newValue } : d
                                )
                              );
                            }}
                            onChangeCommitted={(_, newValue) => {
                              // Khi thả chuột mới gửi API
                              const token = Cookies.get('token');
                              const decodedToken = jwtDecode(token);
                              const userId = decodedToken.sub;
                              sendDataToDeviceAsync(device.CID, 1, newValue, userId);
                            }}
                          />
                        </TableCell>
                          <TableCell>{device.topic}</TableCell>
                          <TableCell>{device.controllerType}</TableCell>
                          <TableCell align="right">
                            <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                              Change
                            </Button>
                            <IconButton>
                              <ClearIcon />
                            </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination Section */}
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

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <Select value={deviceType} 
                  onChange={(e) => { 
                    const selectedType = e.target.value;
                    setDeviceType(e.target.value);
                    setFormData((prevData) => ({
                      ...prevData,
                      deviceType: selectedType === 'Controller' ? 'controller' : 'sensor',
                    }));
                    }}
                  >
                    <MenuItem value="Controller">Controller</MenuItem>
                    <MenuItem value="Sensor">Sensor</MenuItem>
                  </Select>

                  <TextField name="deviceType" label="Device Type" value={formData.deviceType} onChange={handleChange} disabled/>
                  <TextField name="topic" label="Topic" value={formData.topic} onChange={handleChange} />

                  {deviceType === 'Controller' && (
                    <>
                      <TextField name="controllerType" label="Controller Type" value={formData.controllerType} onChange={handleChange} />
                      <TextField name="value" label="Value" type="number" value={formData.value} onChange={handleChange} />
                      <TextField name="status" label="Status (0/1)" type="number" value={formData.status} onChange={handleChange} />
                    </>
                  )}

                  {deviceType === 'Sensor' && (
                    <>
                      <Select
                        name="sensorType"
                        value={formData.sensorType}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select Sensor Type</MenuItem>
                        <MenuItem value="humidity">Humidity</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="earth">Earth</MenuItem>
                        <MenuItem value="temperature">Temperature</MenuItem>
                      </Select>
                      <TextField name="maxValue" label="Max Value" type="number" value={formData.maxValue} onChange={handleChange} />
                    </>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleSubmit} variant="contained">Submit</Button>
                </DialogActions>
              </Dialog>

            </Box>
  )
}

export default Devices