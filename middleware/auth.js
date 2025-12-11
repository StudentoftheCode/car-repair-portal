module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // If not logged in, redirect to admin login
    res.redirect('/admin');
  },

  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    // If already logged in, redirect to dashboard
    res.redirect('/admin/dashboard');
  },
};