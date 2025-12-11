const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/Users');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          console.log('✅ Checking login for:', username);
          console.log('✅ User found:', user);
          console.log('✅ Password match:', isMatch);
          return done(null, false, { message: 'No user found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('✅ Checking login for:', username);
          console.log('✅ User found:', user);
          console.log('✅ Password match:', isMatch);
          return done(null, false, { message: 'Incorrect password' });
        }
        console.log('✅ Checking login for:', username);
        console.log('✅ User found:', user);
        console.log('✅ Password match:', isMatch);
        return done(null, user);
      } catch (err) {
        console.log('✅ Checking login for:', username);
        console.log('✅ User found:', user);
        console.log('✅ Password match:', isMatch);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};