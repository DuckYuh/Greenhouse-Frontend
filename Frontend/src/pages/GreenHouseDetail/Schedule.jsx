import React, { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Pagination
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { getListSchedulesAPI, addScheduleAPI, deleteScheduleAPI, updateScheduleAPI, getDetailScheduleAPI } from '../../apis/deviceApi'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

const recurrenceOptions = [
  { value: 'NOT_REPEAT', label: 'Không lặp' },
  { value: 'DAILY', label: 'Hằng ngày' },
  { value: 'WEEKLY', label: 'Hằng tuần' },
  { value: 'MONTHLY', label: 'Hằng tháng' }
]

const Schedule = () => {
  const [schedules, setSchedules] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailData, setDetailData] = useState(null)

  const handleRowClick = async (SID) => {
    toast.promise(getDetailScheduleAPI(SID), {
      pending: 'Đang tải chi tiết'
    }).then((res) => {
      setDetailData(res[0])
      setDetailDialogOpen(true)
    })
  }

  const param = useParams()
  const id = param.GreenHouseId

  const [form, setForm] = useState({
    timeStart: '',
    duration: '',
    value: '',
    options: 'NOT_REPEAT',
    deviceId: []
  })


  const fetchSchedules = async () => {
    console.log(id)
    toast.promise(getListSchedulesAPI(id, page), {
      pending: 'Đang tải lịch'
    })
      .then((res) => {
        setSchedules(res.data)
        setTotalPages(res.pagination.totalPages)
      })
  }

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule)
      setForm({
        timeStart: schedule.timeStart?.slice(0, 16),
        duration: schedule.duration,
        value: schedule.value,
        SchedulerOptions: schedule.SchedulerOptions,
        recurrenceEnd: schedule.recurrenceEnd?.slice(0, 16) || '',
        deviceId: Array.isArray(schedule.deviceId) ? schedule.deviceId : []
      })
    } else {
      setEditingSchedule(null)
      setForm({ timeStart: '', duration: '', value: '' })
    }
    setOpenDialog(true)
  }

  const handleClose = () => setOpenDialog(false)

  const handleSubmit = async () => {
    console.log('Form data:', form)
    if (editingSchedule) {
      toast.promise(updateScheduleAPI(editingSchedule.SID, form), {
        pending: 'Đang cập nhật lịch',
        success: 'Cập nhật lịch thành công'
      }).then(() => {
        handleClose()
        fetchSchedules()
      })
    } else {
      toast.promise(addScheduleAPI(form), {
        pending: 'Đang thêm lịch',
        success: 'Thêm lịch thành công'
      }).then(() => {
        handleClose()
        fetchSchedules()
      })
    }
  }

  const handleDelete = async (SID) => {
    toast.promise(deleteScheduleAPI(SID), {
      pending: 'Đang xóa lịch',
      success: 'Xóa lịch thành công'
    })
      .then(() => {
        fetchSchedules()
      })
  }

  useEffect(() => {
    fetchSchedules()
  }, [id, page])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Lịch hoạt động thiết bị</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Thêm lịch</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thời gian bắt đầu</TableCell>
              <TableCell>Thời lượng (giây)</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Lặp lại</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((item) => (
              <TableRow key={item.SID} onClick={() => handleRowClick(item.SID)} hover sx={{ cursor: 'pointer' }}>
                <TableCell>{new Date(item.timeStart).toLocaleString()}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.recurrenceRule}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpen(item)
                    }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.SID)
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingSchedule ? 'Chỉnh sửa lịch' : 'Thêm lịch mới'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Thời gian bắt đầu"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={form.timeStart}
            onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Thời lượng (phút)"
            type="number"
            fullWidth
            margin="normal"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <TextField
            label="Giá trị"
            type="number"
            fullWidth
            margin="normal"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <TextField
            select
            label="Lặp lại"
            fullWidth
            margin="normal"
            value={form.SchedulerOptions}
            onChange={(e) => setForm({ ...form, options: e.target.value })}
          >
            {recurrenceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Danh sách thiết bị (ID, phân cách bằng dấu phẩy)"
            fullWidth
            margin="normal"
            value={(form.deviceId || []).join(',')} // <-- tránh undefined
            onChange={(e) =>
              setForm({
                ...form,
                deviceId: e.target.value
                  .split(',')
                  .map((id) => parseInt(id.trim()))
                  .filter((id) => !isNaN(id))
              })
            }
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chi tiết thiết bị</DialogTitle>
        <DialogContent dividers>
          {detailData ? (
            <>
              <Typography><strong>Serial:</strong> {detailData.device.CID}</Typography>
              <Typography><strong>Loại thiết bị:</strong> {detailData.device.deviceType}</Typography>
              <Typography><strong>Loại điều khiển:</strong> {detailData.device.controllerType}</Typography>
              <Typography><strong>Trạng thái:</strong> {detailData.device.status ? 'Bật' : 'Tắt'}</Typography>
              <Typography><strong>Giá trị:</strong> {detailData.device.value}</Typography>
              <Typography><strong>Topic:</strong> {detailData.device.topic}</Typography>
            </>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default Schedule
