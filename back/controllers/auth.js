const jwt = require('jsonwebtoken')
const config = require('config')
const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) return res.status(401).send({error: {msg: 'Нет token'}})

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send({error: {msg: 'Invalid token'}})
  }
}

module.exports = isAuthenticated
