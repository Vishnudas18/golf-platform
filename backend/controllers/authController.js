const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Charity = require('../models/Charity');
const stripe = require('../config/stripe');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create Stripe customer
  let stripeCustomerId = null;
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    stripeCustomerId = customer.id;
  } catch (stripeError) {
    console.warn('Stripe customer creation failed. Check API keys:', stripeError.message);
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    stripeCustomerId,
  });

  if (user) {
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB without triggering pre-save hooks (prevents double hashing)
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    successResponse(res, 201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    }, 'User registered successfully');
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Login Attempt] Email: ${email}`);

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const normalizedEmail = email.toLowerCase();
  
  // 1. Database Check
  let user;
  try {
    user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    console.log(`[Login Debug] User found: ${!!user}`);
  } catch (dbError) {
    console.error('[Login Error] Database failure:', dbError);
    res.status(500);
    throw new Error(`Database connection failed: ${dbError.message}`);
  }

  if (user && (await user.matchPassword(password))) {
    console.log('[Login Debug] Password matched successfully');

    // 2. Environment Variables Check
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('[Login Error] Missing JWT configuration');
      res.status(500);
      throw new Error('Server configuration error: JWT secrets missing');
    }

    // 3. Token Generation
    let accessToken, refreshToken;
    try {
      accessToken = generateAccessToken(user._id, user.role);
      refreshToken = generateRefreshToken(user._id);
      console.log('[Login Debug] Tokens generated successfully');
    } catch (tokenError) {
      console.error('[Login Error] Token generation failed:', tokenError);
      res.status(500);
      throw new Error(`Token generation failed: ${tokenError.message}`);
    }

    // 4. Update User with Refresh Token
    try {
      await User.findByIdAndUpdate(user._id, { refreshToken });
    } catch (updateError) {
      console.error('[Login Error] Failed to update user with refresh token:', updateError);
      res.status(500);
      throw new Error('Authentication failed during token update');
    }

    // 5. Response
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, 200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    }, 'Logged in successfully');
  } else {
    console.log('[Login Debug] Invalid credentials');
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Log out user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      // Clear refresh token without triggering hooks
      await User.findByIdAndUpdate(user._id, { refreshToken: null });
    }
  }

  res.clearCookie('refreshToken');
  successResponse(res, 200, null, 'Logged out successfully');
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token missing');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403);
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    successResponse(res, 200, { accessToken }, 'Token refreshed');
  } catch (error) {
    res.status(403);
    throw new Error('Invalid refresh token');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    successResponse(res, 200, user, 'Profile fetched successfully');
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (charity selection)
// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, charityId, charityPercent } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name) user.name = name;
  if (charityId) {
    const charity = await Charity.findById(charityId);
    if (!charity) {
      res.status(404);
      throw new Error('Charity not found');
    }
    user.charityId = charityId;
  }
  if (charityPercent !== undefined) {
    if (charityPercent < 10 || charityPercent > 100) {
      res.status(400);
      throw new Error('Charity percentage must be between 10 and 100');
    }
    user.charityPercent = charityPercent;
  }

  await user.save();
  successResponse(res, 200, user, 'Profile updated successfully');
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
};
