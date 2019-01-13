const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Passport or login is incorrect',
  successRedirect: '/',
  successFlash: 'Wellcome'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'you are logged out 💩');
  res.redirect('/');
};


exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'you must be loogin 🐩');
  res.redirect('/login');
}