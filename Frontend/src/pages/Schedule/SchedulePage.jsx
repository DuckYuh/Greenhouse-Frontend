import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Breadcrumbs, Button, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Modal, CircularProgress, Alert, IconButton, Pagination } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../../components/SideBar'; // Assuming Sidebar is in the same directory
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchSchedules } from '../../apis/schedule'; // Adjust the import path as necessary\
import { fetchGreenhouses } from '../../apis/greenhousse'; // Adjust the import path as necessary

const Schedule = () => {
  const [greenhouseId, setGreenhouseId] = useState(() => localStorage.getItem('selectedGreenhouse') || '');
  const [schedules, setSchedules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 100; // Matches API limit

  // Mock greenhouse list (replace with API call if available)
//   const greenhouses = [
//     { id: '1', name: 'Greenhouse 1' },
//     { id: '2', name: 'Greenhouse 2' },
//     { id: '3', name: 'Greenhouse 3' },
//   ];

  const [greenhouses, setGreenhouses] = useState([]);

    useEffect(() => {
        const fetchgreenhouses = async () => {
            try {
            const response = await fetchGreenhouses()
            console.log(response)
            if (!response.ok) throw new Error('Failed to fetch greenhouses');
            setGreenhouses(response.data);
        } catch (err) {
            setError(err.message);
            setGreenhouses([]);
        }

        };
        fetchgreenhouses();
    }, []);

  // Fetch schedules when greenhouse or page changes
  useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchSchedulesData = async () => {
          try {
            const response = await fetchSchedules(greenhouseId);
            console.log('Fetched schedules:', response.data); // Log the fetched schedules
            if (!response.ok) throw new Error('Failed to fetch schedules');
            const data = await response.json();
            setSchedules(data.schedules || []);
            setTotalPages(Math.ceil(data.totalCount / limit)); // Calculate total pages based on total count
            setLoading(false);
            } catch (err) {
            setError(err.message);
            setSchedules([]);
            setLoading(false);
            } finally {
            setLoading(false);
            }
        };
        fetchSchedulesData();
  }, [greenhouseId]);

  // Persist greenhouse selection and reset page
  useEffect(() => {
    if (greenhouseId) {
      setCurrentPage(1); // Reset to first page when greenhouse changes
    } else {
      setSchedules([]);
    }
  }, [greenhouseId]);

  // Fetch devices for a selected schedule
  const fetchDevices = async (scheduleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8088/scheduler/controller/${scheduleId}`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      const data = await response.json();
      setDevices(data || []);
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    fetchDevices(schedule.SID);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', p: 3 }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>Schedule</Typography>
        <Breadcrumbs sx={{}} aria-label="breadcrumb">
          <Typography color="inherit" sx={{ borderBottom: 3 }}>Schedule</Typography>
        </Breadcrumbs>
        <Divider sx={{ mb: 3 }} color="#DDE1E6" />

        <Box sx={{ maxWidth: 800, mx: 'auto', backgroundColor: '#fff', p: 3, borderRadius: 2, boxShadow: 1 }}>
          {/* Greenhouse Selection */}
          <Typography variant="h6" sx={{ mb: 2 }}>Select Greenhouse</Typography>
          <Select
            value={greenhouseId}
            onChange={(e) => setGreenhouseId(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 3 }}
          >
            <MenuItem value="" disabled>Select a greenhouse</MenuItem>
            {greenhouses.map((gh) => (
              <MenuItem key={gh.GID} value={gh.GID}>{gh.name}</MenuItem>
            ))}
          </Select>

          {/* Schedules Table */}
          {greenhouseId && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Schedules for Selected Greenhouse</Typography>
              {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
              ) : schedules.length > 0 ? (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Schedule ID</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Duration (mins)</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Recurrence</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.SID}>
                          <TableCell>{schedule.SID}</TableCell>
                          <TableCell>{formatDateTime(schedule.timeStart)}</TableCell>
                          <TableCell>{schedule.duration}</TableCell>
                          <TableCell>{schedule.value}</TableCell>
                          <TableCell>{schedule.recurrenceRule}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleViewDetails(schedule)}
                              disabled={loading}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                  />
                </>
              ) : (
                <Typography>No schedules found for this greenhouse.</Typography>
              )}
            </>
          )}
        </Box>

        {/* Devices Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Devices for Schedule ID: {selectedSchedule?.SID}
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : devices.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((item) => (
                    <TableRow key={item.device.CID}>
                      <TableCell>{item.device.CID}</TableCell>
                      <TableCell>{item.device.controllerType}</TableCell>
                      <TableCell>{item.device.status === 1 ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>{item.device.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>No devices found for this schedule.</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(false)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        {/* Error Message */}
        {/* {error && (
          <Alert
            severity="error"
            sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )} */}
      </Box>
    </Box>
  );
};

export default Schedule;