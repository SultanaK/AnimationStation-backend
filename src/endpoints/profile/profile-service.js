const xss = require('xss');

const ProfileService = {
	getAllAnimations(knexInstance) {
		return knexInstance.select('*').from('animations').then((animations) => {
			return animations;
		});
	},

	getAnimationsByUserId(knexInstance,id, user_id) {
		return ProfileService.getAllAnimationss(knexInstance)
			.where('user_id', user_id)
			.first();
	},
	serializeAnimations(animations) {
		return animations.map((animation) => {
			return this.serializeAnimation(animation);
		});
	},
	serializeAnimation(animation) {
		return {
			id: animation.id,
			title: xss(animation.title),
			delay: animation.delay,
			duration: animation.duration,
			direction: xss(animation.direction),
			iteration: animation.iteration,
			timing: xss(animation.timing),
			fill: xss(animation.fill),
			keyframe: xss(animation.keyframe),
			target: xss(animation.target),
			created: animation.created,
			updated: animation.updated,
			user_id: animation.user_id,
		};
	},
};

module.exports = ProfileService;
