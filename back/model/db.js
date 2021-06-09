const mongoose = require('mongoose');
const config = require('config');

mongoose.set('useCreateIndex', true);
mongoose
  .connect(`${config.get('mongoUri')}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successful connection');
  })
  .catch((err) => {
    console.error('Can t connect to db', err);
  });

const User = mongoose.model('User', {
  email: { type: String, require: true, unique: true },

  password: { type: String, require: true },

  articles: [{ type: String, ref: 'Article' }],
});

const Category = mongoose.model('Category', {
  title: { type: String, require: true },

  code: { type: String, require: true, unique: true },

  isRemoved: { type: Boolean, default: false },

  articles: [{ type: String, ref: 'Article' }],

  rate: Number,
});

const Articles = mongoose.model('Articles', {
  title: { type: String, require: true },

  // code: {type: String, require: true, unique: true},

  mainImage: { type: String },

  shortDescr: { type: String },

  descr: { type: String },

  owner: { type: String, ref: 'User' },

  category: { type: String, ref: 'Category' },

  isRemoved: { type: Boolean, default: false },

  likesCount: Number,

  usersLikes: Array,
});

module.exports = { User, Category, Articles };
