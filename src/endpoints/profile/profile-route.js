const express = require('express');
const ProfileService = require('./profile-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const ProfileRouter = express.Router();

ProfileRouter.route('/')
	.all(requireAuth)
	.get((req, res, next) => {
		ProfileService.getAllAnimations(req.app.get('db'))
			.then((animations) => {
				res.json(ProfileService.serializeAnimations(animations));
			})
			.catch(next);
	});

ProfileRouter.route('/:user_id')
	.all(requireAuth)
	.all(checkUserExist)
	.get((req, res, next) => {
		ProfileService.getAnimationsByUserId(req.app.get('db'), req.params.user_id)
			.then((user) => {
				res.json(ProfileService.serializeProfile(user));
			})
			.catch(next);
	});

/* async/await syntax for promises */
async function checkUserExist(req, res, next) {
	try {
		const user = await ProfileService.getAnimationsByUserId(req.app.get('db'), req.params.user_id);

		if (!user)
			return res.status(404).json({
				error: `User doesn't exist`,
			});

		res.user = user;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = ProfileRouter;
