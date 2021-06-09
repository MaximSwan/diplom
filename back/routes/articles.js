const express = require('express');
const router = express.Router();
const db = require('../model/db');
const isAuthenticated = require('../controllers/auth');
const multer = require('multer');
const fs = require('fs');

router.post('/add', isAuthenticated, async (req, res, next) => {
  try {
    console.log(req.file);
    const reg = /^[a-zA-Z\s]+$/;
    const { title, descr, shortDescr, mainImage } = req.body;

    if (title && descr) {
      // if (reg.test(code)) {
      if (title && title.length < 3) {
        return res.send({ error: { msg: 'Title меньши 3' } }).status(400);
      }
      // if (!category) {
      //   return res.send({error: {msg: 'Category - нет id'}}).status(400)
      // }
      const dataArt = {
        title,
        mainImage,
        shortDescr,
        descr,
        owner: req.user.id,
      };
      const art = new db.Articles(dataArt);
      const resArt = await art.save();

      res.send(resArt);
      // } else {
      //   res.send({error: {msg: 'Не верный code'}}).status(400)
      // }
    } else {
      res.send({ error: { msg: 'Одно из полей не заполнено' } }).status(400);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/edit/:id/:userId/', isAuthenticated, async (req, res, next) => {
  try {
    const reg = /^[a-zA-Z\s]+$/;
    const { title, descr, code, shortDescr, category, like } = req.body;
    const { id, userId } = req.params;

    if (userId !== req.user.id) {
      return res
        .send({ error: { msg: 'User не является владельцем' } })
        .status(400);
    }
    if (title || code || descr || shortDescr || category) {
      if (req.params.id) {
        const art = await db.Articles.findOne({ _id: id });

        if (!art) {
          return res.send({ error: { msg: 'Не верный id' } }).status(400);
        }
        if (title) {
          if (title.length >= 3) {
            art['title'] = title;
          } else {
            return res.send({ error: { msg: 'Title меньши 3' } }).status(400);
          }
        }
        if (code) {
          if (reg.test(code)) {
            art['code'] = code;
          } else {
            return res.send({ error: { msg: 'Не верный code' } }).status(400);
          }
        }
        if (descr) {
          art['descr'] = descr;
        }
        if (shortDescr) {
          art['shortDescr'] = shortDescr;
        }
        if (category) {
          art['category'] = category;
        }
        if (req.file) {
          art['mainImage'] = req.file.buffer;
        }
        if (like) {
          art.likesCount += 1;
          art.usersLikes.push(req.user.id);
        }

        const dbres = await art.save();

        res.send(dbres);
      } else {
        return res.send({ error: { msg: 'Нет id' } }).status(400);
      }
    } else {
      return res
        .send({ error: { msg: 'Ни одно из полей не заполнено' } })
        .status(400);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/remove/:id/:userId/', isAuthenticated, async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    if (userId !== req.user.id) {
      return res
        .send({ error: { msg: 'User не является владельцем' } })
        .status(400);
    }
    if (id) {
      const art = await db.Articles.findOne({ _id: id });

      if (!art) {
        return res.send({ error: { msg: 'Не верный id' } }).status(400);
      }
      art.isRemoved = true;
      const resArt = await art.save();

      res.send(resArt);
    } else {
      res.send({ error: { msg: 'Нет id' } });
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  '/recover/:id/:userId/',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { id, userId } = req.params;

      if (userId !== req.user.id) {
        return res
          .send({ error: { msg: 'User не является владельцем' } })
          .status(400);
      }
      if (id) {
        if (id.length !== 24) {
          return res.send({ error: { msg: 'Не верный формат id' } });
        }
        const art = await db.Articles.findOne({ _id: id });

        if (!art) {
          return res.send({ error: { msg: 'Не верный id' } }).status(400);
        }
        art.isRemoved = false;
        const resArt = await art.save();

        res.send(resArt);
      } else {
        res.send({ error: { msg: 'Нет id' } });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/removeForever/:id/:userId/',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { id, userId } = req.params;

      if (userId !== req.user.id) {
        return res
          .send({ error: { msg: 'User не является владельцем' } })
          .status(400);
      }

      if (id) {
        if (id.length !== 24) {
          return res.send({ error: { msg: 'Не верный формат id' } });
        }
        const art = await db.Articles.findOne({ id });

        if (!art) {
          return res.send({ error: { msg: 'Не верный id' } }).status(400);
        }

        db.Articles.remove({ _id: id });
        res.send({ ok: 1 });
      } else {
        res.send({ error: { msg: 'Нет id' } });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get('/get/:id/', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params.id;

    if (id) {
      if (id.length !== 24) {
        return res.send({ error: { msg: 'Не верный формат id' } });
      }
      const art = await db.Articles.findOne({ _id: id });

      if (!art) {
        return res.send({ error: { msg: 'Не верный id' } }).status(400);
      }

      res.send(art);
    } else {
      res.send({ error: { msg: 'Нет id' } });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/list/', isAuthenticated, async (req, res, next) => {
  try {
    const { page, remove, category } = req.body;

    let pageSkip = 0;
    let removed = false;
    let cat;

    if (page) {
      pageSkip = page * 10;
    }
    if (remove) {
      removed = remove;
    }
    if (category) {
      cat = category;
    }
    const arts = await db.Articles.find({
      isRemoved: removed,
    })
      .limit(10)
      .skip(pageSkip);

    res.send({
      arts,
      pages: Math.ceil((await db.Articles.find()).length / 10),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
