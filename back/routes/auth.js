const express = require('express')
const router = express.Router()
const db = require('../model/db')
const config = require('config')
const jwt = require('jsonwebtoken')
const bCrypt = require('bcrypt')

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(user.password, password)
}
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

router.post('/login', async (req, res, next) => {
  try {
    if (req.body.email && req.body.password) {
      const result = await db.User.findOne({email: req.body.email})

      if (result) {
        const resPass = isValidPassword(req.body, result.password)

        if (resPass) {
          const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id: result._id,
          }, config.get('jwtSecret'))
          const finalRes = {token, userId: result._id, email: result.email}

          res.send(finalRes)
        } else {
          res.send({error: {msg: 'Password не правельный'}}).status(400)
        }
      } else {
        res.send({error: {msg: 'Такого Email не существует'}}).status(400)
      }
    } else {
      res.send({error: {msg: 'Одно из полей не заполнено'}}).status(400)
    }
  } catch (error) {
    next(error)
  }
})

router.post('/registration', async function (req, res, next) {
  try {
    if (req.body.email && req.body.password) {
      const reg = /^(([^<>()[\]\\., :\s@\"]+(\.[^<>()[\]\\., :\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const data = {
        email: req.body.email,
        password: createHash(req.body.password),
      }

      if (reg.test(data.email)) {
        const user = new db.User(data)

        return user.save()
          .then(use => {
            res.send({ok: 1})
          })
          .catch(err => {
            if (err.errmsg.indexOf('duplicate key') !== -1) {
              return res.send({error: {msg: 'Email занят'}}).status(400)
            }
            next(err)
          })
      }
      return res.send({error: {msg: 'Email не верный формат'}}).status(400)
    }
    res.send({error: {msg: 'Одно из полей не заполнено'}}).status(400)
  } catch (error) {
    next(error)
  }
})

module.exports = router 
