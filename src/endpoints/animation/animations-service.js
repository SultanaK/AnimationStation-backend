const xss = require('xss');
const AnimationsService = {
	getAllAnimations(knexInstance, user_id) {
		return knexInstance
			.select('*')
			.from('animations')
			.where({ user_id })
			.then((animations) => {
				return animations;
			});
	},
	getByAnimationId(knexInstance, id, user_id) {
		return knexInstance
			.select('*')
			.from('animations')
			.where({ user_id })
			.where('id', id)
			.first();
	},

	insertAnimation(knexInstance, animation, user_id) {
		return knexInstance
			.insert(animation)
			.into('animations')
			.returning('*')
			.then(([ animation ]) => animation)
			.then((animation) =>
				AnimationsService.getByAnimationId(knexInstance, animation.id, user_id)
			);
	},

	deleteAnimation(knex, id, user_id) {
		return knex('animations')
			.where('id', id)
			.where('user_id', user_id)
			.delete();
  },
  
	updateAnimation(knex, id, user_id, updatedAnimation) {
		return knex('animations')
			.where('id', id)
			.where('user_id', user_id)
			.update(updatedAnimation)
			.returning('*')
			.then(([ animation ]) => animation)
			.then((animation) =>
				AnimationsService.getByAnimationId(knex, animation.id, animation.user_id)
			);
  },
  
  updateNote(db, id, newNoteFields) {
    return db("markdown_notes")
      .where({id})
      .update(newNoteFields)
      .returning("*")
      .then(([note]) => note)
      .then((note) => NotesService.getById(db, note.id, note.user_id));
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

module.exports = AnimationsService;
