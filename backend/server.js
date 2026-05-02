const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Check if .env loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err))

app.get('/', (req, res) => {
  res.send('CampusHub JKUAT API Running')
})

// Only use routes that actually exist
app.use('/api/auth', require('./routes/auth'))
app.use('/api/payment', require('./routes/payment'))

// ADD THIS BLOCK NEXT - FIXES "NOT FOUND"
app.use(express.static(path.join(__dirname, 'frontend' 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontendcd' 'build', 'index.html'))
})

app.listen(10000, () => console.log('Server running on port 10000'))
