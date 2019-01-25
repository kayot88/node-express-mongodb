const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');



const storeSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name'
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: "Enter the coordinates"
    }],
    address: {
      type: String,
      required: "Enter the address"
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Yoy must supply the author'
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
});


storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storeWithSlug = await this.constructor.find({
    slug: slugRegExp
  });
  if (storeWithSlug.length) {
    this.slug = `${this.slug}-${storeWithSlug.length + 1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([{
      $unwind: '$tags'
    },
    {
      $group: {
        _id: '$tags',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);
};

storeSchema.statics.getTop = function () {
  return this.aggregate([{
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'store',
        as: 'reviews'
      }
    },
    {
      $match: {
        'reviews.1': {
          $exists: true
        }
      }
    },
    {
      $addFields: {
          averageRating: {
            $avg: '$reviews.rating'
          }
        }
    },
    { $sort: {averageRating: -1}},
    {$limit: 5}
  ]);
};

storeSchema.index({
  name: 'text',
  description: 'text'
});

storeSchema.index({
  location: "2dsphere"
});

storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store'
});

function autopopulate(next) {
  this.populate('reviews');
  next();
};

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);