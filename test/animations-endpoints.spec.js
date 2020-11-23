const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Animations Endpoints', function() {
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

	describe(`GET /api/animations`, () => {
		context(`Given no animations`, () => {

      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )
      
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get('/api/animations')
					.set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.expect(200, []);
			});
		});

		context('Given there are animations in the database', () => {
			beforeEach('insert animations', () =>
				helpers.seedAnimationsTables(db, testUsers, testAnimations)
			);

			it('responds with 200 and all of the animations', () => {        
        const expectedAnimations = helpers.makeExpectedAnimations(testUsers[0], testAnimations)
				return supertest(app)
					.get('/api/animations')
					.set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.expect(200, expectedAnimations);
			});
		});

		context(`Given an XSS attack animation`, () => {
			const testUser = helpers.makeUsersArray()[1];
			const {
				maliciousAnimation,
				expectedAnimation,
			} = helpers.makeMaliciousAnimation(testUser);

			beforeEach('insert malicious animation', () => {
				return helpers.seedMaliciousAnimation(db, testUser, maliciousAnimation);
			});

			it('removes XSS attack keyframe', () => {
				return supertest(app)
          .get(`/api/animations`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(200)
					.expect((res) => {
						expect(res.body[0].title).to.eql(expectedAnimation.title);
						expect(res.body[0].keyframe).to.eql(expectedAnimation.keyframe);
					});
			});
		});
	});

	describe(`GET /api/animations/:id`, () => {

		context(`Given animation does not exist`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

			it(`responds with 404`, () => {
				const id = 123456;
				return supertest(app)
					.get(`/api/animations/${id}`)
					.set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.expect(404, { error: `Animation doesn't exist` });
			});
		});

		context('Given there are animations in the database', () => {
			beforeEach('insert animations', () =>
				helpers.seedAnimationsTables(db, testUsers, testAnimations)
			);

			it('responds with 200 and the specified animation', () => {
				const id = 2;
				const expectedAnimation = helpers.makeExpectedAnimation(
					testAnimations[id - 1]
        );

        const user = testUsers[expectedAnimation.user_id - 1];

        return supertest(app)
          .get(`/api/animations/${id}`)
					.set('Authorization', helpers.makeAuthHeader(user))
					.expect(200, expectedAnimation);
			});
		});

		context(`Given an XSS attack animation`, () => {
			const testUser = helpers.makeUsersArray()[1];
			const {
				maliciousAnimation,
				expectedAnimation,
			} = helpers.makeMaliciousAnimation(testUser);

			beforeEach('insert malicious animation', () => {
				return helpers.seedMaliciousAnimation(db, testUser, maliciousAnimation);
      });
      
      const user = testUsers[maliciousAnimation.user_id - 1];

			it('removes XSS attack content', () => {
				return supertest(app)
					.get(`/api/animations/${maliciousAnimation.id}`)
					.set('Authorization', helpers.makeAuthHeader(user))
					.expect(200)
					.expect((res) => {
						expect(res.body.title).to.eql(expectedAnimation.title);
						expect(res.body.keyframe).to.eql(expectedAnimation.keyframe);
					});
			});
		});
	});
});
