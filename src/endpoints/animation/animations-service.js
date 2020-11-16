
const xss = require("xss");
const AnimationsService = {
    getAllAnimations(knexInstance) {
        return knexInstance
            .select('*')
            .from('animations')
            .then(animations => {
                return animations;
            });
    },

    getByAnimationId(knexInstance, id) {
        return knexInstance
            .from('animations')
            .select('*')
            .where('id', id)
            .first();
    },
    addAnimation(knexInstance, animation) {
        return knexInstance
            .insert(animation                                             )
            .into('animations')
            .returning('*')
            .then(([animation]) => animation)
            .then((animation) => AnimationsService.getByAnimationId(knexInstance,animation.id));
            
    },

    deleteAnimation(knex, id, user_id) {
        return knex('animations')
            .where('id', id)
            .where('user_id', user_id)
            .delete();
    },
    updateAnimation(knex, id, user_id,updatedAnimation) {
        return knex('animations')
            .where('id', id)
            .where('user_id', user_id)
            .update(updatedAnimation)
            .returning('*')
            .then(([animation]) => animation)
            .then((animation) => AnimationsService.getByAnimationId(knex, animation.id));
    },
    
    serializeAnimations(animations) {
        return animations.map((animation) => {
            return {
                id: animation.id,
                title: xss(animation.title),
                content: (animation.content),
                created: animation.created,
                updated: animation.updated,
                user_id: animation.user_id,
            };
        });
    },

    serializeAnimation(animation) {
        return {
            id: animation.id,
            title: xss(animation.title),
            content: (animation.content),
            created: animation.created,
            updated: animation.updated,
            user_id: animation.user_id,
        };
    },
    
};


module.exports = AnimationsService; 