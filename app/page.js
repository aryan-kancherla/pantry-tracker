'use client'
import React, { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, getDoc, query, setDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      sx={{

        background : 'linear-gradient(135deg, #ADD8E6, #33FF57)'

      }}
      
      p={2}
      gap={2}
      overflow="auto"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        width="700px"
        height="115px"
        bgcolor="#2db434"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        borderRadius="12px"
        sx={{ boxShadow: 3 }}
        style={{ padding: 0, border: 'none' }}
        alignItems="center"
      >
        <Typography variant="h1" sx={{ color: "white", fontStyle: "normal" }}>Digital Pantry</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{ backgroundColor: '#2db434', color: 'white' }}
        onClick={handleOpen}
      >
        Add New Item
      </Button>

      <Stack
        width="1000px"
        spacing={2}
      >
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="100px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={2}
            borderRadius={2}
            boxShadow={1}
            sx={{ overflow: 'hidden' }}
          >
            <Typography
              variant="h3"
              color="#333"
              textAlign="left"
              sx={{ flexGrow: 1}}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Stack direction="row" spacing={2}>
            <Button
                variant="contained"
                width = "50px"
                height = "50px"
                onClick={() => removeItem(name)}
                sx={{ backgroundColor: '#ADD8E6', color: 'white', fontSize: "25px" }} 
              >
                -
              </Button>

            <Typography
              variant="h3"
              color="#333"
              textAlign="center"
              sx={{ minWidth: '75px' }} 
            >
              {quantity}
            </Typography>

              <Button
                variant="contained"
                onClick={() => addItem(name)}
                sx={{ backgroundColor: '#2db434', color: 'white', fontSize: "25px"}}
              >
                +
              </Button>

            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
