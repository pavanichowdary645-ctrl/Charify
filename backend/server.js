const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/causes', require('./routes/causes'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/ngos', require('./routes/ngos'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
