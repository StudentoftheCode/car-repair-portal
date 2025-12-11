const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin/authController');
const adminDashController = require('../controllers/admin/repairController');
const adminNotesController = require('../controllers/admin/notesController');
const notesController = require('../controllers/admin/notesController');
const dashboardController = require('../controllers/admin/repairController');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const passport = require('passport');

// =================
// AUTH ROUTES
// =================

// Login page
router.get('/', ensureGuest, adminAuthController.getIndex);

// Login POST handler
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin',
    failureFlash: true,
  })
);

// Logout
router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('info', 'You have been logged out.');
    res.redirect('/login');
  });
});

// =================
// DASHBOARD ROUTES
// =================

// Dashboard (protected)
router.get('/dashboard', ensureAuth, adminDashController.getIndex);

// Add Job
router.post('/add-job', ensureAuth, adminDashController.postAddJob);

// Update Job Status
router.post('/job/:id/update', ensureAuth, adminDashController.updateJobStatus);

// Notes JSON fetch route (used by dashboard modal)
router.get('/job/:id/notes/json', ensureAuth, adminDashController.getNotesJSON);

// Search Jobs
router.get('/search', ensureAuth, adminDashController.searchJobs);

// Notes
router.post('/job/:id/notes', notesController.addNote);
router.delete('/job/:id/notes/:noteId', notesController.deleteNote);
router.put('/job/:id/notes/:noteId', notesController.updateNote);

// Print View
router.get('/job/:id/print', ensureAuth, dashboardController.printJob);

module.exports = router;