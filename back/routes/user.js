const express = require('express');
const router = express.Router();
const db = require('../model/db');
const isAuthenticated = require('../controllers/auth');

router.get('/info/:id/', async (req, res, next) => {
  console.log('wefwf');
  try {
    let id;
    if (req.params.id !== '1') {
      id = req.params.id;
    } else {
      id = req.user.id;
    }
    if (!id) {
      return res.send({ error: { msg: 'Нет id!' } }).status(400);
    }
    const user = await db.User.find({ _id: id });
    let resUser;
    resUser = {
      _id: user[0]._id,
      email: user[0].email,
    };
    res.send({ resUser });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
