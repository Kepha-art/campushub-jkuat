const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
const isSrvConnection = MONGODB_URI?.startsWith('mongodb+srv://');
console.log('MONGODB_URI:', MONGODB_URI ? 'Found' : 'Missing');

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.error('MongoDB Error:', err);
      if (isSrvConnection && err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
        console.error(
          'MongoDB SRV DNS lookup failed. This often means your network is blocking Atlas SRV DNS resolution.'
        );
        console.error(
          'Try using a standard mongodb:// connection string instead of mongodb+srv:// or adjust your network/DNS settings.'
        );
      }
    });
} else {
  console.warn('No MongoDB connection string was provided. Backend product CRUD will not be available until MONGODB_URI is set.');
}

app.get('/', (req, res) => {
  res.send('CampusHub JKUAT API Running')
})

// Only use routes that actually exist
app.use('/api/auth', require('./routes/auth'))
app.use('/api/payment', require('./routes/payment'))
app.use('/api/products', require('./routes/products'))

// ADD THIS BLOCK NEXT - FIXES "NOT FOUND"
app.use(express.static(path.join(__dirname, 'frontend', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
