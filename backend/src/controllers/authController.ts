import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';
import { generateOTP, sendOTPEmail } from '../utils/emailService';
import { generateToken } from '../utils/generateToken';

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Send OTP to user's email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received sendOTP request with body:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log('Email is required but was not provided');
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    console.log(`Processing OTP request for email: ${email}`);

    // Generate a new OTP
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);
    
    // Set OTP expiry (10 minutes from now)
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY || '10');
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
    console.log(`OTP will expire at: ${expiry}`);

    // Find user by email or create a new one
    let user = await User.findOne({ email });

    if (user) {
      console.log(`Existing user found with email: ${email}, updating OTP data`);
      // Update existing user with new OTP
      user.otpData = { otp, expiry };
      await user.save();
    } else {
      console.log(`No user found with email: ${email}, creating new temporary user`);
      // Create a temporary user with OTP data
      user = new User({
        email,
        otpData: { otp, expiry },
        name: '', // Will be filled during verification
      });
      await user.save();
      console.log(`Temporary user created with id: ${user._id}`);
    }

    // Send OTP via email
    console.log(`Sending OTP email to: ${email}`);
    const emailSent = await sendOTPEmail(email, otp);

    if (emailSent) {
      console.log(`OTP email sent successfully to: ${email}`);
      res.status(200).json({
        message: `OTP sent to ${email}. Valid for ${expiryMinutes} minutes.`,
        success: true
      });
    } else {
      console.error(`Failed to send OTP email to: ${email}`);
      // Remove the user we just created if email fails
      if (user && user._id) {
        try {
          await User.findByIdAndDelete(user._id);
          console.log(`Removed temporary user ${user._id} due to email failure`);
        } catch (deleteError) {
          console.error('Error deleting temporary user:', deleteError);
        }
      }
      res.status(500).json({ 
        message: 'Failed to send OTP. Please check your email address and try again.',
        success: false
      });
    }
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP and complete signup
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received verifyOTP request with body:', req.body);
    const { email, otp, name, dob } = req.body;

    if (!email || !otp) {
      console.log('Missing required fields:', { email: !!email, otp: !!otp });
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    console.log(`Verifying OTP for email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      res.status(400).json({ message: 'User not found' });
      return;
    }

    console.log(`User found: ${user._id}, checking OTP validity`);
    console.log(`User OTP data:`, user.otpData ? {
      storedOtp: user.otpData.otp,
      expiry: user.otpData.expiry,
      receivedOtp: otp,
      isExpired: new Date() > new Date(user.otpData.expiry)
    } : 'No OTP data found');

    // Check if OTP exists and is valid
    if (
      !user.otpData ||
      user.otpData.otp !== otp ||
      new Date() > new Date(user.otpData.expiry)
    ) {
      const reason = !user.otpData 
        ? 'No OTP data found' 
        : user.otpData.otp !== otp 
          ? 'OTP mismatch' 
          : 'OTP expired';
          
      console.log(`OTP verification failed: ${reason}`);
      res.status(400).json({ 
        message: 'Invalid or expired OTP', 
        expired: user.otpData ? new Date() > new Date(user.otpData.expiry) : true,
        reason
      });
      return;
    }

    console.log(`OTP verified successfully for user: ${user._id}`);

    // If this is a new user completing registration
    if (!user.name && name) {
      console.log(`Setting name for new user: ${name}`);
      user.name = name;
    }

    if (dob) {
      user.dob = new Date(dob);
    }

    // Clear the OTP data
    user.otpData = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: 'Invalid Google token' });
      return;
    }

    const { email, name, picture, sub } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = new User({
        name,
        email,
        googleId: sub,
        profilePicture: picture,
      });
      await user.save();
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = sub;
        user.profilePicture = picture || user.profilePicture;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password -otpData');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
