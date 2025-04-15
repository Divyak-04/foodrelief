const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');



// Initialize dotenv
dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON data
app.use(cors());         // Enable CORS

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Sample Route
app.get('/', (req, res) => res.send('FoodRelief API is running...'));

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
