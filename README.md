# AnimationStation Backend!

This is a backend repo used for AnimationStation client

## Script
Start the application `npm start`

Start nodemon for the application `npm run dev`

## Setup
- Clone this repository to your local machine
- Install the dependencies for the project
- Ensure your PostgreSQL server is running
- Create a User for this Database
    createdb -U <User_NAME>
- Create a database for the project with your user as the owner
    createdb -U <USER_NAME> <DB_NAME>
- Rename the `example.env` file to `.env` and update the following fields with your database credentials:
  ```
   MIGRATION_DB_NAME=
   MIGRATION_DB_USER=
   MIGRATION_DB_PASS=
   DATABASE_URL="postgresql://USERNAME@localhost/DATABASE_NAME"
  ```
- Run the command `npm run migrate -- 1` to create the database tables
- run the command `npm t`

Migrate the dev database `npm run migrate`

Migrate the test database `npm run migrate:test`




## IMPORTANT NOTE ON NODE VERSION

If you are running Node v14, then you must also upgrade your `pg` package to v8.x by typing:

`npm install pg@8`

If you are on Node v12 or lower, run `npm install` as normal and let it remain locked to major version `pg` v7.

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

