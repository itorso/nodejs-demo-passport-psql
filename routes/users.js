let router = require('express').Router(),
    passport = require('passport');

/**
 * Serve login page
 */
router.get('/login', (req, res, next) => {
  res.render('login');
});


/**
 * Serve registration page
 */
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Signup' });
});


/**
 * Passport sign-up handler
 */
router.post('/register', 
  passport.authenticate('local-signup', { 
    successRedirect: '/',
    failureRedirect: '/users/register',
    failureFlash: true
  }
));


/**
 * Passport sign-in handler
 */
router.post('/login', 
  passport.authenticate('local-signin', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
}));


/**
 * Logout user
 */
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


router.get('/profile', (req, res) => {
  if(req.user){
    res.render('profile');
  } else {
    res.redirect('/');
  }
});


module.exports = router;
