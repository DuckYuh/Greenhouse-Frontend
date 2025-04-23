import { useState, useEffect } from 'react'
import {
  Box, CssBaseline, Typography, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Pagination, Paper, Breadcrumbs, Divider, TextField
} from '@mui/material'
import { toast } from 'react-toastify'
import Sidebar from '../../components/SideBar'
import { getListGreenHouseAPI, deleteGreenHouseAPI, updateGreenHouseAPI, addGreenHouseAPI } from '../../apis/deviceApi'
import { GreenHouseItem } from './GreenHouseItem'

const GreenHouse = () => {
  const [listGreenHouse, setListGreenHouse] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [formData, setFormData] = useState({ id: '', name: '', location: '' })

  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => {
    setFormData({ id: '', name: '', location: '' })
    setOpenAdd(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddGreenHouse = async () => {
    if (!formData.id || !formData.name || !formData.location) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }
    // Có thể gọi API tại đây nếu cần
    const newGreenHouse = {
      GID: formData.id,
      name: formData.name,
      location: formData.location
    }
    await toast.promise(
      addGreenHouseAPI(newGreenHouse), {
        pending: 'Đang thêm nhà kính...',
        success: 'Thêm nhà kính thành công!'
      }
    ).then(() => {
      setListGreenHouse(prev => [newGreenHouse, ...prev])
      handleCloseAdd()
    })
  }

  const getListGreenHouse = async () => {
    await toast.promise(getListGreenHouseAPI(page, 10), {
      pending: 'Đang tải danh sách nhà kính...'
    }).then(res => {
      setListGreenHouse(res.data || [])
      setTotalPage(res.pagination.totalPages || 1)
    })
  }

  const handleDelete = async (id) => {
    await toast.promise(deleteGreenHouseAPI(id), {
      pending: 'Đang xoá nhà kính...',
      success: 'Xoá thành công!'
    }).then(() => {
      setListGreenHouse(prev => prev.filter(item => item.GID !== id))
      setSelectedId(null)
      setConfirmOpen(false)
    })
  }

  const handleConfirmDelete = (id) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }

  const handleConfirmClose = () => {
    setSelectedId(null)
    setConfirmOpen(false)
  }

  const handleUpdate = async (id, updatedData) => {
    await toast.promise(
      updateGreenHouseAPI(id, updatedData), {
        pending: 'Đang cập nhật nhà kính...',
        success: 'Cập nhật thành công!'
      }
    ).then(() => {
      setListGreenHouse(prev =>
        prev.map(item => (item.GID === id ? { ...item, ...updatedData } : item))
      )
    })
  }

  useEffect(() => {
    getListGreenHouse()
  }, [page])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', p: 3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h4'>Green Houses</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenAdd}>
             Add Green House
          </Button>
        </Box>

        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography color="inherit" sx={{ borderBottom: 3 }}>Green House</Typography>
        </Breadcrumbs>


        <Divider sx={{ mb: 3 }} color='#DDE1E6' ></Divider>

        <Grid container spacing={2}>
          {listGreenHouse.map((gh) => (
            <Grid item xs={12} sm={6} md={4} key={gh.GID}>
              <GreenHouseItem
                id={gh.GID}
                name={gh.name}
                location={gh.location}
                onDelete={handleConfirmDelete}
                onUpdate={handleUpdate}
              />
            </Grid>
          ))}
        </Grid>

        {/* Phân trang nằm dưới cùng */}
        <Box display="flex" justifyContent="center" mt={10}>
          <Pagination
            count={totalPage}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>

        {/* Dialog xác nhận xoá */}
        <Dialog open={confirmOpen} onClose={handleConfirmClose}>
          <DialogTitle>Xác nhận xoá</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xoá nhà kính này không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose}>Hủy</Button>
            <Button
              onClick={() => {
                handleDelete(selectedId)
              }}
              color="error"
              variant="contained"
            >
              Xoá
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth>
          <DialogTitle>Thêm Nhà Kính</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Tên Nhà Kính"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Địa Điểm"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd}>Huỷ</Button>
            <Button variant="contained" onClick={handleAddGreenHouse}>Thêm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default GreenHouse
