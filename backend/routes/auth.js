const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Validation
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Mobile, Password, and Role).',
      });
    }

    // Check if user already exists with same mobile or email
    const existingUser = await User.findOne({
      $or: [
        { mobile: mobile },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this mobile number or email.',
      });
    }

    // Validate role
    const validRoles = ['Patient', 'Asha Worker', 'PHC Doctor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: Patient, Asha Worker, PHC Doctor',
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email || undefined,
      mobile,
      password,
      role,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Account created successfully. You will be notified once approved.',
      user: userResponse,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    // Validation - user can sign in with either email or mobile
    if (!password || (!email && !mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/mobile and password.',
      });
    }

    // Find user by email or mobile
    const query = email 
      ? { email: email.toLowerCase() }
      : { mobile: mobile };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/mobile and password.',
      });
    }

    // Check if user is approved (if approval system is enabled)
    // For now, we'll allow all users to sign in
    // if (!user.isApproved) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Your account is pending approval. Please wait for admin approval.',
    //   });
    // }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/mobile and password.',
      });
    }

    // Return user without password
    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error signing in. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get user by ID (for profile, etc.)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;

