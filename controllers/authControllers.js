const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

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
};

exports.forgot = async (req, res) => {
  //1. check user
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    req.flash('error', 'there are no user with that email');
    res.redirect('/login');
  }
  //2. reset pass
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpired = Date.now() + 360000;
  await user.save();
  //3.send email for user with token
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Reset password',
    resetUrl
  });

  req.flash('success', `you have been emailed a password reset link`);
  res.redirect('/login')
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpired: {
      $gt: Date.now()
    }
  });
  if (!user) {
    req.flash('error', 'password is wrong or expired');
    return res.redirect('/login');
  }
  res.render('reset', {
    title: 'reset rassword'
  });
};

exports.confirmedPassword = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) {
    next();
    return;
  }
  req.flash('error', 'password do not mutch')
  res.redirect('back')
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpired: {
      $gt: Date.now()
    }
  });
  if (!user) {
    req.flash('error', 'password is wrong or expired');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordExpired = undefined;
  user.resetPasswordToken = undefined;
  const updateUser = await user.save();
  await req.login(updateUser);
  req.flash('success', 'your password changed and you are redirected');
  res.redirect('/');
};


