// models/register.js (for registration details)
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  location: String,
});

module.exports = mongoose.model('Register', registerSchema, 'register');
