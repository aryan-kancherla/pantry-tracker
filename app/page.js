'use client'
import React, { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, getDoc, query, setDoc } from 'firebase/firestore'
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
        width= {{xs:350, lg:700}} // so basically this is a responsive design, the width of the box will be 350px on small screens and 700px on large screens
        height={{xs:60, lg:115}} // same as above
        bgcolor="#50C878"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        borderRadius="12px"
        sx={{ boxShadow: 3 }}
        style={{ padding: 0, border: 'none' }}
        alignItems="center"
      >
       {/* The sx prop allows direct interaction with a component's CSS, while the Typography component defines the HTML tag (h1, h3) and adjusts its font size responsively based on tag choosen using xs and lg values. */}
        <Typography sx={{typography:{lg:"h1", xs:"h3"}, color: "white", fontStyle: "normal" }}>Digital Pantry</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{ backgroundColor: '#50C878', color: 'white' }}
        onClick={handleOpen}
      >
        Add New Item
      </Button>            
        
      <Box
        sx = {{
          position: "relative", 
          bottom: {lg: "150px", xs: "0px"},
          left: {lg: "600px", xs: "0px"},
          width: {lg: "200px", xs: "250px"}
        }}

      >

          <TextField
            variant = "outlined"
            label = "Search"
            onChange = {(e) => setSearchTerm(e.target.value)}

            sx={{borderColor: "white"}}
                
          >
            
            </TextField> 
    
      </Box>

      <Stack
        width={{xs:350, lg:1000}} //here
        spacing={2}
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="80px"
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
              color="#333"
              textAlign="left"
              sx={{typography:{lg:"h3", xs:"h4"},flexgeow:1}} //here
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    height: {
                      xs: 50,
                      lg: 70
                    },
                    width: {
                      xs: 50,
                      lg: 70
                    }, //here
                    backgroundColor: '#ADD8E6',
                    color: 'white',
                    fontSize: '25px'
                  }}
                >
                  -
                </Button>

                <Typography
                  color="#333"
                  textAlign="center"
                  sx={{
                    minWidth: {
                      sm: '40px',
                      lg: '70px'
                    },
                    fontSize: {
                      xs: '35px',
                      lg: '50px'
                    }
                  }} //here
                >
                  {quantity}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{
                    height: {
                      xs: 50,
                      lg: 70
                    },
                    width: {
                      xs: 50,
                      lg: 70
                    },//here 
                    backgroundColor: '#50C878',
                    color: 'white',
                    fontSize: '22px'
                  }}
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
