const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Only use routes that actually exist
app.use('/api/auth', require('./routes/auth'))
app.use('/api/payment', require('./routes/payment'))

// SERVE REACT BUILD - THIS FIXES "NOT FOUND"
app.use(express.static(path.join(__dirname, 'frontend', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

// USE RENDER'S PORT - THIS FIXES STATUS 1 CRASH
const PORT = process.env.PORT || 10000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))