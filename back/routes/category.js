const express = require('express')
const router = express.Router()
const db = require('../model/db')
const isAuthenticated = require('../controllers/auth')

router.get('/list', isAuthenticated, async (req, res, next) => {
	const categorys = await db.Category.find({})

	res.send(categorys)
})

router.post('/add', isAuthenticated, (req, res, next) => {
	try {
		const reg = /^[a-zA-Z\s]+$/

		if (req.body.title && req.body.code) {
			if (reg.test(req.body.code)) {
				const category = new db.Category(req.body)

				category.save()
					.then(cat => {
						res.send(category)
					})
					.catch(err => {
						next(err)
					})
			} else {
				res.send({error: {msg: 'Не верный code'}}).status(400)
			}
		} else {
			res.send({error: {msg: 'Одно из полей не заполнено'}}).status(400)
		}
	} catch (error) {
		next(error)
	}
})

router.post('/edit/:id/', isAuthenticated, async (req, res, next) => {
	try {
		const reg = /^[a-zA-Z\s]+$/
		const {title, code} = req.body;

		if (title || code) {
			if (req.params.id.length !== 24) {
				return res.send({error: {msg: 'Не верный формат id'}})
			}
			if (req.params.id) {
				const category = await db.Category.findOne({_id: req.params.id})

				if (code) {
					if (reg.test(code)) {
						category.code = code
					} else {
						return res.send({error: {msg: 'Не верный code'}}).status(400)
					}
				}
				if (title) {
					category.title = title
				}
				const cat = await category.save();

				res.send(cat)
			} else {
				res.send({error: {msg: 'Нет id'}})
			}
		} else {
			res.send({error: {msg: 'Все поля пустые'}}).status(400)
		}
	} catch (error) {
		next(error)
	}
})

router.post('/remove/:id/', isAuthenticated, async (req, res, next) => {
	try {
		if (req.params.id) {
			if (req.params.id.length !== 24) {
				return res.send({error: {msg: 'Не верный формат id'}})
			}
			const category = await db.Category.find({_id: req.params.id})

			category[0].isRemoved = true
			category[0].save()
				.then(cat => {
					res.send(cat)
				})
				.catch(err => {
					next(err)
				})
		} else {
			res.send({error: {msg: 'Нет id'}})
		}
	} catch (error) {
		next(error)
	}
})

router.get('/removeForever/:id/', isAuthenticated, (req, res, next) => {
	try {
		if (req.params.id) {
			if (req.params.id.length !== 24) {
				return res.send({error: {msg: 'Не верный формат id'}})
			}
			db.Category.remove({_id: req.params.id})
			res.send({ok: 1})
		} else {
			res.send({error: {msg: 'Нет id'}})
		}
	} catch (error) {
		next(error)
	}
})

router.post('/recover/:id/', isAuthenticated, async (req, res, next) => {
	if (req.params.id) {
		if (req.params.id.length !== 24) {
			return res.send({error: {msg: 'Не верный формат id'}})
		}
		const category = await db.Category.find({_id: req.params.id})

		if (!category[0]) {
			res.send({error: {msg: 'Такого id - нет'}})
		}
		category[0].isRemoved = false
		category[0].save()
			.then(cat => {
				res.send(cat)
			})
			.catch(err => {
				next(err)
			})
	} else {
		res.send({error: {msg: 'Нет id'}})
	}
})

module.exports = router
