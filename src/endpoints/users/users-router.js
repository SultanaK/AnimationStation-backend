const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
	id: user.id,
	user_name: xss(user.user_name),
	full_name: xss(user.full_name),
	email: xss(user.email),
	created: user.created,
	updated: user.updated,
});

usersRouter
	.route('/')
	.get(requireAuth, (req, res, next) => {
		const knexInstance = req.app.get('db');
		UsersService.getAllUsers(knexInstance)
			.then((users) => {
				res.json(users.map(serializeUser));
			})
			.catch(next);
	})
	.post(jsonParser, (req, res, next) => {
		const { full_name, user_name, email, password } = req.body;
		const newUser = { full_name, email, user_name, password };

		for (const [key, value] of Object.entries(newUser)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` },
				});
			}
		}
		const passwordError = UsersService.validatePassword(password);
		if (passwordError) return res.status(400).json({ error: passwordError });

		UsersService.hasUserWithEmail(req.app.get('db'), email)
			.then((hasUserWithEmail) => {
				if (hasUserWithEmail) return res.status(400).json({ error: { message: `Email already taken` } });
				return UsersService.hashPassword(password).then((hashedPassword) => {
					const newUser = {
						full_name,
						user_name,
						email,
						password: hashedPassword,
						created: 'now()',
					};

					return UsersService.insertUser(req.app.get('db'), newUser).then((user) => {
						res
							.status(201)
							.location(path.posix.join(req.originalUrl, `/${user.id}`))
							.json(serializeUser(user));
					});
				});
			})
			.catch(next);
	});

usersRouter
	.route('/:user_id')
	.all(requireAuth)
	.all(checkUserExists)
	.get((req, res, next) => {
		res.json(serializeUser(res.user));
	})
	.delete((req, res, next) => {
		UsersService.deleteUser(req.app.get('db'), req.params.id)
			.then((numRowsAffected) => {
				res.status(204).end();
			})
			.catch(next);
	})
	.patch(jsonParser, (req, res, next) => {
		const { full_name, user_name, password, email } = req.body;
		const userToUpdate = { full_name, user_name, password, email };

		const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
		if (numberOfValues === 0)
			return res.status(400).json({
				error: {
					message: `Request body must contain either 'fullname', 'username', 'password' or 'nickname'`,
				},
			});

		UsersService.updateUser(req.app.get('db'), req.params.id, userToUpdate)
			.then((numRowsAffected) => {
				res.status(204).end();
			})
			.catch(next);
	});

async function checkUserEmailExists(req, res, next) {
	try {
		const email = await UsersService.hasUserWithEmail(req.app.get('db'), req.user.email);
		if (email)
			return res.status(404).json({
				error: `Email already exist`,
			});
		res.email = email;
		next();
	} catch (error) {
		next(error);
	}
}

async function checkUserExists(req, res, next) {
	try {
		const user = await UsersService.getById(req.app.get('db'), req.params.user_id);
		if (user)
			return res.status(404).json({
				error: `User doesn't exist`,
			});
		res.user = user;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = usersRouter;
