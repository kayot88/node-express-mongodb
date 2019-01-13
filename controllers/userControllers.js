const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'login'
  });
};

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'register'
  });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'name cannot be empty').notEmpty();
  req.checkBody('email', 'email is incorrect').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'password cannot be empty').notEmpty();
  req.checkBody('password-confirm', 'oh!noo!').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(error => error.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.account = (req, res) => {
  res.render('account', {
    title: 'User account'
  });
};

exports.updateAccount = async (req, res) => {
  const update = {
    email: req.body.email,
    name: req.body.name,
  };
  const user = await User.findOneAndUpdate(
    {_id: req.user._id},
    {$set: update},
    {new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'your account was changed');
  res.redirect('/');
};

