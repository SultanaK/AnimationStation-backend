const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Protected endpoints', function () {
	let db;

	const { testUsers, testAnimations } = helpers.makeAnimationsFixtures();

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL,
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => helpers.cleanTables(db));

	afterEach('cleanup', () => helpers.cleanTables(db));

	beforeEach('insert animation', () => helpers.seedAnimationsTables(db, testUsers, testAnimations));

	const protectedEndpoints = [
		{
			name: 'GET /api/animations',
			path: '/api/animations',
			method: supertest(app).get,
		},
		{
			name: 'GET /api/animations/:animation_id',
			path: '/api/animations/1',
			method: supertest(app).get,
		},
		{
			name: 'DELETE /api/animations/:animation_id',
			path: '/api/animations/1',
			method: supertest(app).get,
		},
		{
			name: 'POST /api/animations',
			path: '/api/animations',
			method: supertest(app).post,
		},
	];

	protectedEndpoints.forEach((endpoint) => {
    beforeEach('cleanup', () => helpers.cleanTables(db))

		describe(endpoint.name, () => {
			it(`responds 401 'Missing bearer token' when no bearer token`, () => {
				return endpoint.method(endpoint.path).expect(401, { error: `Missing bearer token` });
      });

			it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
				const invalidSecret = 'bad-secret';
				return endpoint.method(endpoint.path)
					.set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
					.expect(401, { error: `Unauthorized request` });
      });
      
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { email: 'user-not-existy@example.com', id: 1 };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });

			it(`responds 401 'Unauthorized request' when invalid user`, () => {
				const userInvalidCreds = { email: 'user-not', password: 'existy' };
				return endpoint
					.method(endpoint.path)
					.set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
					.expect(401, { error: `Unauthorized request` });
			});

			it(`responds 401 'Unauthorized request' when invalid password`, () => {
				const userInvalidPass = { email: testUsers[0].email, password: 'wrong' };
				return endpoint
					.method(endpoint.path)
					.set('Authorization', helpers.makeAuthHeader(userInvalidPass))
					.expect(401, { error: `Unauthorized request` });
			});
    });
    
	});
});
