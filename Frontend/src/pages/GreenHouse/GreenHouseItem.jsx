import React, { useState } from 'react'
import {
  Card, CardContent, Typography, IconButton, Modal, Box, TextField, Button
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { sub2greenhouse } from '../../apis/user'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
}

export const GreenHouseItem = ({ id, name, location, onDelete, onUpdate }) => {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editLocation, setEditLocation] = useState(location)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleSave = () => {
    onUpdate(id, { name: editName, location: editLocation }).then(() => {
      handleCloseModal()
    })
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          position: 'relative',
          borderRadius: 2,
          boxShadow: 2,
          transition: '0.3s',
          '&:hover': {
            boxShadow: 6,
            cursor: 'pointer'
          }
        }}
        onClick={() => {
          navigate(`/greenhouse/${id}`)
          sub2greenhouse([id],true)
          localStorage.setItem('name', name)
          localStorage.setItem('gid', id)
        }}
      >
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {name}
          </Typography>
          <Typography color="textSecondary">ID: {id}</Typography>
          <Typography color="textSecondary">Vị trí: {location}</Typography>

          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
              zIndex: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton color="primary" size="small" onClick={handleOpenModal}>
              <Edit />
            </IconButton>
            <IconButton color="error" size="small" onClick={() => onDelete(id)}>
              <Delete />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Chỉnh sửa nhà kính
          </Typography>
          <TextField
            fullWidth
            label="Tên"
            variant="outlined"
            sx={{ mb: 2 }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Vị trí"
            variant="outlined"
            sx={{ mb: 2 }}
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
