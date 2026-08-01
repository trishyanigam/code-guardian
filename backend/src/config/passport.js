import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import crypto from 'crypto';
import { User } from '../models/user.model.js';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your_github_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret';
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback';

/**
 * Configure GitHub Passport Strategy
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : `${profile.username}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          // Generate a secure placeholder password for OAuth users to satisfy schema validation
          const randomPassword = crypto.randomBytes(16).toString('hex');

          user = await User.create({
            name: profile.displayName || profile.username || 'GitHub User',
            email: email,
            password: randomPassword,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            role: 'user',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Serialize user into session
 */
passport.serializeUser((user, done) => {
  done(null, user.id || user._id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
