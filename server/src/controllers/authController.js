import passport from 'passport';
import { generateToken } from '../config/passport.js';
import { User } from '../models/User.js';

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

export const googleAuth = (req, res, next) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  if (!clientID || clientID === 'your_google_client_id_here') {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth is not configured on the server yet. Please fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env, or use the instant Developer / Demo Login option.',
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      return res.redirect(`${clientUrl}/?error=OAuthFailed`);
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/?token=${token}`);
  })(req, res, next);
};

// Developer / Local testing authentication endpoint
export const devLogin = async (req, res) => {
  try {
    const { email = 'demo.user@calendar.local', name = 'Demo User' } = req.body || {};
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: `dev_${Date.now()}`,
        email,
        name,
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        timezone: 'Asia/Kolkata',
      });
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Authenticated successfully',
    });
  } catch (error) {
    console.error('[Dev Login Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Developer authentication failed',
      error: error.message,
    });
  }
};
