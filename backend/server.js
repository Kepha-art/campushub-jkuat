require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Check if .env loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected:', mongoose.connection.host))
  .catch((err) => console.error('MongoDB Error:', err.message))

app.get('/', (req, res) => {
  res.send('CampusHub JKUAT API Running')
})

// Only use routes that actually exist
app.use('/api/auth', require('./routes/auth'))
app.use('/api/payment', require('./routes/payment'))

// Add these back later after you create the files
// app.use('/api/products', require('./routes/products'))
// app.use('/api/services', require('./routes/services'))
// app.use('/api/cart', require('./routes/cart'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
