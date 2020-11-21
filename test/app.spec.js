const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');

describe('Express App', () => {
  it('should return a message from GET / responds with 200 containing "Hello, from AnimationStation!!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, from AnimationStation!!');
  });
});
