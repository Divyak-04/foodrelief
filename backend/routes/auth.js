const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Register = require('../models/register'); // Import Register model
const Login = require('../models/login');       // Import Login model
const router = express.Router();



// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    // Check if the user already exists in the 'register' collection
    const userExists = await Register.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists in registration' });
    }

    // Hash the password before storing it in the 'login' collection
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save registration details in the 'register' collection
    const newRegister = new Register({
      name,
      email,
      role,
      location,
    });
    await newRegister.save();

    // Save login details in the 'login' collection (only email and hashed password)
    const newLogin = new Login({
      email,
      password: hashedPassword,
    });
    await newLogin.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the 'login' collection
    let user = await Login.findOne({ email });
    if (!user) {
      // If the user is not found in the login collection, check the 'register' collection
      const registerUser = await Register.findOne({ email });
      if (!registerUser) {
        return res.status(400).json({ message: 'User not found in registration' });
      }

      // User found in the 'register' collection but not in 'login', so hash password and save it to 'login' collection
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Login({
        email,
        password: hashedPassword,
      });
      await user.save();
    }

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token as response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
