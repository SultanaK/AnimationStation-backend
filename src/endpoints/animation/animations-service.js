
const xss = require("xss");
const AnimationsService = {
    getAllAnimations(knexInstance) {
        return knexInstance
            .select('*')
            .from('animation')
            .then(animations => {
                return animations;
            });
    },

    getByAnimationId(knexInstance, id) {
        return knexInstance
            .from('animation')
            .select('*')
            .where('id', id)
            .first();
    },
    addAnimation(knexInstance, animation) {
        return knexInstance
            .insert(animation)
            .into('animation')
            .returning('*')
            .then(([animation]) => animation)
            .then((anmation) => AnimationsService.getByAnimationId(knexInstance,animation.id));
            
    },

    deleteAnimation(knex, id) {
        return knex('animation')
            .where('id', id)
            .delete();
    },
    updateAnimation(knex, id, updatedAnimation) {
        return knex('anmation')
            .where('id', id)
            .update(updatedAnimation)
            .returning('*')
            .then(([animation]) => animation)
            .then((animation) => AnimationsService.getByAnimationId(knexInstance, animation.id));
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