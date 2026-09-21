import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'google_calendar_clone_jwt_secret_key_2026';
  return jwt.sign(
    {
      id: user._id,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (!clientID || clientID === 'your_google_client_id_here') {
    console.warn('[OAuth] GOOGLE_CLIENT_ID not configured. Google OAuth endpoints will return notice/error until credentials are set in server/.env');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
          const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 'Google User';

          let user = await User.findOne({ googleId: profile.id });
          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (user) {
            user.googleId = profile.id;
            user.name = name || user.name;
            user.avatar = avatar || user.avatar;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              email,
              name,
              avatar,
              timezone: 'Asia/Kolkata',
            });
          }

          return done(null, user);
        } catch (error) {
          console.error('[Passport Strategy Error]', error);
          return done(error, null);
        }
      }
    )
  );
};
