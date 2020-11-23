const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const xss = require("xss");

function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'test-user-1',
			full_name: 'Test user 1',
			email: 'test-user-1@email.com',
			password: 'password',
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 2,
			user_name: 'test-user-2',
			full_name: 'Test user 2',
			email: 'test-user-2@email.com',
			password: 'password',
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 3,
			user_name: 'test-user-3',
			full_name: 'Test user 3',
			email: 'test-user-3@email.com',
			password: 'password',
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 4,
			user_name: 'test-user-4',
			full_name: 'Test user 4',
			email: 'test-user-4@email.com',
			password: 'password',
			created: '2029-01-22T16:28:32.615Z',
		},
	];
}

function makeAnimationsArray(users) {
	return [
		{
			id: 1,
			title: 'First test post!',
			delay: 1,
			duration: 500,
      direction: 'reverse',
			iteration: 3,
      timing: 'ease-in',
      fill: 'both',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[0].id,
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 2,
			title: 'Second test post!',
			delay: 1,
			duration: 500,
      direction: 'reverse',
			iteration: 3,
      timing: 'ease-in',
      fill: 'both',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[1].id,
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 3,
			title: 'Third test post!',
			delay: 1,
			duration: 500,
      direction: 'reverse',
			iteration: 3,
      timing: 'ease-in',
      fill: 'both',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[2].id,
			created: '2029-01-22T16:28:32.615Z',
		},
		{
			id: 4,
			title: 'Fourth test post!',
			delay: 1,
			duration: 500,
      direction: 'reverse',
			iteration: 3,
      timing: 'ease-in',
      fill: 'both',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[3].id,
			created: '2029-01-22T16:28:32.615Z',
		},
	];
}

function makeExpectedAnimations(user, animations) {
  const expectedAnimations = [];
  animations.forEach(animation => {
    if (animation.user_id === user.id) {
      expectedAnimations.push(
        makeExpectedAnimation(animation)
      )
    }
  });

  return expectedAnimations;
}

function makeExpectedAnimation(animation) {
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
		user_id: animation.user_id,
		created: animation.created,
	};
}

function makeMaliciousAnimation(user) {
	const maliciousAnimation = {
		id: 911,
		title: 'Naughty naughty very naughty <script>alert("xss");</script>',
		delay: '1',
		duration: '500',
		iteration: '3',
		keyframe: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
		target: 'square',
		direction: 'reverse',
		timing: 'ease-in',
		fill: 'both',
		user_id: user.id,
  };
  
	const expectedAnimation = {
		...maliciousAnimation,
		title: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
		keyframe: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  
	return {
		maliciousAnimation,
		expectedAnimation,
	};
}

function makeAnimationsFixtures() {
	const testUsers = makeUsersArray();
	const testAnimations = makeAnimationsArray(testUsers);

	return { testUsers, testAnimations };
}

function cleanTables(db) {
	return db.transaction((trx) =>
		trx
			.raw(
				`TRUNCATE
        animations,
        users
        RESTART IDENTITY CASCADE
        `
			)
			.then(() =>
				Promise.all([
					trx.raw(`ALTER SEQUENCE animations_id_seq minvalue 0 START WITH 1`),
					trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
					trx.raw(`SELECT setval('animations_id_seq', 0)`),
					trx.raw(`SELECT setval('users_id_seq', 0)`),
				])
			)
	);
}
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}
function seedAnimationsTables(db, users, animations ) {
	// use a transaction to group the queries and auto rollback on any failure
	return db.transaction(async (trx) => {
    await seedUsers(trx, users)
		await trx.into('animations').insert(animations);
		// update the auto sequence to match the forced id values
		await Promise.all([
			trx.raw(`SELECT setval('users_id_seq', ?)`, [
				users[users.length - 1].id,
			]),
			trx.raw(`SELECT setval('animations_id_seq', ?)`, [
				animations[animations.length - 1].id,
			]),
		]);
	});
}

function seedMaliciousAnimation(db, user, animation) {
	return db
		.into('users')
		.insert([ user ])
		.then(() => db.into('animations').insert([ animation ]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const subject = user.email;
  const payload = { id: user.id };
  const token = jwt.sign(payload, secret, {
    subject,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256',
  });
  return `bearer ${token}`
}

module.exports = {
	makeUsersArray,
  makeAnimationsArray,
  makeExpectedAnimation,
  makeExpectedAnimations,
	makeMaliciousAnimation,
	makeAnimationsFixtures,
	cleanTables,
	seedAnimationsTables,
  seedMaliciousAnimation,
  makeAuthHeader,
  seedUsers,
};
