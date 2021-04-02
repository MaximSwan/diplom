const express = require('express');
const router = express.Router();
const db = require('../model/db');
const isAuthenticated = require('../controllers/auth');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const config = require('config');

router.post(
  '/upload/art',
  isAuthenticated,
  multer().single(''),
  async (req, res, next) => {
    try {
      let filename = '';
      let { idArt } = req.body;
      if (!req.file) {
        return res.send({ error: { msg: 'Нет image' } });
      }
      fs.writeFile(
        `./data/images/art_${idArt}_${req.file.originalname}`,
        req.file.buffer,
        async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .send({ error: { msg: 'Не удалось сохранить фотографию!' } })
              .status(400);
          }
          let art = await db.Articles.findById(idArt);
          art.mainImage = `http://localhost:3000/images/art_${idArt}_${req.file.originalname}`;

          const resArt = await art.save();

          res.send(resArt);
        }
      );
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
