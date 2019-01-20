const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const User = require('../models/User');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: 'File is incorrect'
      }, false);
    }
  }
};

exports.addStore = (req, res) => {
  res.render('editStore')
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', {
    title: 'stores',
    stores
  });
};



exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, file, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extention = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extention}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await (new Store(req.body).save());
  req.flash('success', `stop ${store.name}`)
  res.redirect(`/store/${store.slug}`);
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You are not owner')
  }
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({
    _id: req.params.id
  });
  confirmOwner(store, req.user);
  // res.send(store)
  res.render('editStore', {
    title: `edit ${store.name}`,
    store
  })
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `secceccfully updated <strong>${store.name}</strong>. 
  <a href="/stores/${store.slug}">View store ➡️</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug
  }).populate('author');
  // console.log(store);
  if (!store) {
    return next()
  }

  res.render('store', {
    store,
    title: store.name
  });
};

exports.getStoreByTag = async (req, res) => {
  const tag = req.params.tag
  const tagQuery = tag || {
    $exists: true
  }
  const tragsPromise = Store.getTagsList();
  const storesPromise = Store.find({
    tags: tagQuery
  });
  // const result = await Promise.all([tragsPromise, storesPromise])
  const [trags, stores] = await Promise.all([tragsPromise, storesPromise])
  res.render('tag', {
    trags,
    title: 'tagsList',
    tag,
    stores
  })
  // res.json(result)
};

exports.searchStores = async (req, res) => {
  const stores = await Store
    .find({
      $text: {
        $search: req.query.q,
      }
    }, {
      score: {
        $meta: 'textScore'
      }
    })
    .sort({
      score: {
        $meta: 'textScore'
      }
    })
    .limit(5);
  res.json(stores);
};

  exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        // $maxDistance: 1
      }
    }
  };
  const stores = await Store.find(q).select('name slug location description').limit(10)
  res.json(stores);
};

exports.mapPage = (req, res) => {
  res.render('map', {
    title: 'MAP'
  });
};

exports.heartStore = async (req, res) => {
   const hearts = req.user.hearts.map(obj => obj.toString());
   const operator = hearts.includes(req.params.id) ? '$pull': '$addToSet';
   const user = await User
   .findByIdAndUpdate(req.user._id, 
   {[operator] : {hearts: req.params.id}},
   {new: true} 
    )
   res.json(user)
};

