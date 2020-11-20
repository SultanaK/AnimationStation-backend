module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/animation-station',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/animation-station-test',
  JWT_SECRET: process.env.JWT_SECRET || 'use-env-secret',
	JWT_EXPIRY: process.env.JWT_EXPIRY || '4600s'
}

