const bcrypt = require('bcryptjs')

function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'test-user-1',
			full_name: 'Test user 1',
			email: 'test-user-1@email.com',
			password: 'password',
			created: new Date('2029-01-22T16:28:32.615Z'),
		},
		{
			id: 2,
			user_name: 'test-user-2',
			full_name: 'Test user 2',
			email: 'test-user-2@email.com',
			password: 'password',
			created: new Date('2029-01-22T16:28:32.615Z'),
		},
		{
			id: 3,
			user_name: 'test-user-3',
			full_name: 'Test user 3',
			email: 'test-user-3@email.com',
			password: 'password',
			created: new Date('2029-01-22T16:28:32.615Z'),
		},
		{
			id: 4,
			user_name: 'test-user-4',
			full_name: 'Test user 4',
			email: 'test-user-4@email.com',
			password: 'password',
			created: new Date('2029-01-22T16:28:32.615Z'),
		},
	];
}

function makeAnimationsArray(users) {
	return [
		{
			id: 1,
			title: 'First test post!',
			delay: '1',
			duration: '500',
			iteration: '3',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[0].id,
			created: new Date('2029-01-22T16:28:32.615Z'),
			direction: 'reverse',
			timing: 'ease-in',
			fill: 'both',
		},
		{
			id: 2,
			title: 'Second test post!',
			delay: '1',
			duration: '500',
			iteration: '3',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[1].id,
			created: new Date('2029-01-22T16:28:32.615Z'),
			direction: 'reverse',
			timing: 'ease-in',
			fill: 'both',
		},
		{
			id: 3,
			title: 'Third test post!',
			delay: '1',
			duration: '500',
			iteration: '3',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[2].id,
			created: new Date('2029-01-22T16:28:32.615Z'),
			direction: 'reverse',
			timing: 'ease-in',
			fill: 'both',
		},
		{
			id: 4,
			title: 'Fourth test post!',
			delay: '1',
			duration: '500',
			iteration: '3',
			keyframe:
				'{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}',
			target: 'square',
			user_id: users[3].id,
			created: new Date('2029-01-22T16:28:32.615Z'),
			direction: 'reverse',
			timing: 'ease-in',
			fill: 'both',
		},
	];
}

function makeExpectedAnimation(users, animation) {
	const user = users.find((user) => user.id === animation.user_id);
	return {
		id: animation.id,
		delay: animation.delay,
		duration: animation.duration,
		iteration: animation.iteration,
		keyframe: animation.keyframe,
		target: animation.target,
		user_id: animation.users_id,
		created: animation.created,
		direction: animation.direction,
		timing: animation.timing,
		fill: animation.fill,
		user: {
			id: user.id,
			user_name: user.user_name,
			full_name: user.full_name,
			email: user.email,
			created: user.created.toISOString(),
			updated: user.updated || null,
		},
	};
}

function makeMaliciousAnimation(user) {
	const maliciousAnimation = {
		id: 911,
		title: 'How-to',
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
		...makeExpectedAnimation([ user ], maliciousAnimation),
		title:
			'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
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
        users,
        
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
		await trx.into('users').insert(users);
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
		// only insert comments if there are some, also update the sequence counter
		
	});
}

function seedMaliciousAnimation(db, user, animation) {
	return db
		.into('users')
		.insert([ user ])
		.then(() => db.into('animations').insert([ animation ]));
}
function makeAuthHeader(user) {
  const token = Buffer.from(`${user.email}:${user.password}`).toString('base64')
  return `Basic ${token}`
}

module.exports = {
	makeUsersArray,
	makeAnimationsArray,
	makeExpectedAnimation,
	makeMaliciousAnimation,
	makeAnimationsFixtures,
	cleanTables,
	seedAnimationsTables,
  seedMaliciousAnimation,
  makeAuthHeader,
  seedUsers,
};
