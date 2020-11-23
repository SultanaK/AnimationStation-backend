const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcryptjs');
const helpers = require('./test-helpers');


describe('Users Endpoints', function () {
	let db;
	const { testUsers } = helpers.makeAnimationsFixtures();
	const testUser = testUsers[0];

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

	describe(`POST /api/users`, () => {
		context(`User Validation`, () => {
			beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

			const requiredFields = ['password', 'email'];

			requiredFields.forEach((field) => {
				const registerAttemptBody = {
					user_name: 'test username',
					password: 'test password',
					email: 'test email',
					full_name: 'test full_name',
				};

				it(`responds with 400 required error when '${field}' is missing`, () => {
					delete registerAttemptBody[field];

					return supertest(app)
            .post('/api/users')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
						.send(registerAttemptBody)
						.expect(400, {
							error: { message: `Missing '${field}' in request body` },
						});
				});
			});

			it(`responds 400 'Password be longer than 7 characters' when empty password`, () => {
				const userShortPassword = {
					password: '1234567',
          email: 'test full_name',
          user_name: 'test user_name',
					full_name: 'test full_name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(userShortPassword)
					.expect(400, { error: `Password must be at least 8 characters` });
			});

			it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
				const userLongPassword = {
					password: '*'.repeat(73),
          email: 'test full_name',
          user_name: 'test user_name',
					full_name: 'test full_name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(userLongPassword)
					.expect(400, { error: `Password must be less than 73 characters` });
			});

			it(`responds 400 error when password starts with spaces`, () => {
				const userPasswordStartsSpaces = {
					password: ' 1Aa!2Bb@',
          email: 'test full_name',
          user_name: 'test user_name',
					full_name: 'test full_name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(userPasswordStartsSpaces)
					.expect(400, { error: `Password must not start or end with empty spaces` });
			});

			it(`responds 400 error when password ends with spaces`, () => {
				const userPasswordEndsSpaces = {
					password: '1Aa!2Bb@ ',
          email: 'test full_name',
          user_name: 'test user_name',
					full_name: 'test full_name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(userPasswordEndsSpaces)
					.expect(400, { error: `Password must not start or end with empty spaces` });
			});

			it(`responds 400 error when password isn't complex enough`, () => {
				const userPasswordNotComplex = {
					password: '11AAaabb',
          email: 'test full_name',
          user_name: 'test user_name',
					full_name: 'test full_name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(userPasswordNotComplex)
					.expect(400, {
						error: `Password must contain 1 upper case, lower case, number and special character`,
					});
			});

			it(`responds 400 'User email already taken' when username isn't unique`, () => {
				const duplicateUser = {
          email: testUser.email,
          password: '11AAaabb!',
          full_name: testUser.full_name,
          user_name: testUser.user_name,
        };
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(duplicateUser)
					.expect(400, { error: { message: `Email already taken` } });
			});
		});

		context(`Happy path`, () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
			it(`responds 201, serialized user, storing bcrypted password`, () => {
				const newUser = {
					user_name: 'test username',
					password: '11AAaa!!',
					email: 'none@none.com',
					full_name: 'Test full name',
				};
				return supertest(app)
          .post('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
					.send(newUser)
					.expect(201)
					.expect((res) => {
						expect(res.body).to.have.property('id');
						expect(res.body.user_name).to.eql(newUser.user_name);
						expect(res.body.email).to.eql(newUser.email);
						expect(res.body.full_name).to.eql(newUser.full_name);
						expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
					})
					.expect((res) =>
						db
							.from('users')
							.select('*')
							.where({ id: res.body.id })
							.first()
							.then((row) => {
								expect(row.user_name).to.eql(newUser.user_name);
								expect(row.email).to.eql(newUser.email);

								return bcrypt.compare(newUser.password, row.password);
							})
							.then((compareMatch) => {
								expect(compareMatch).to.be.true;
							})
					);
			});
		});
	});
});
