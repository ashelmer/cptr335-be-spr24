const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const authService = require('./auth-service');
const userService = require('../Users/users-service');

passport.use(
  'local',
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, cb) => {
      return authService
        .authenticateUser(username, password)
        .then((user) => {
          if (!user) {
            return cb(null, false);
          }
          return cb(null, user);
        })
        .catch((err) => cb(err));
    }
  )
);
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  userService
    .getById(obj.clientId)
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => cb(err));
});
