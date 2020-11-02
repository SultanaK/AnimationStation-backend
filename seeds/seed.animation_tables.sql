BEGIN;

TRUNCATE
  animation,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, email, password)
VALUES
  ('dunder', 'Dunder Mifflin', 'dunder@email.com', 'password'),
  ('b.deboop', 'Bodeep Deboop', 'Bo@gmail.com', 'bo-password'),
  ('wippy', 'Ping Won In', 'Ping@yahoo.com', 'ping-password'),
  ('Ping', 'Ping Won In', 'won@yahoo.com', 'Won-password');

INSERT INTO animation (title, content, user_id)
VALUES
  ('First post!', 'Interview amet consectetur adipisicing elit.', 1),
  ('Second post!', 'How-to consectetur adipisicing elit.', 2),
  ('Third post!', 'News dolor sit amet, consectetur adipisicing elit', 3),
  ('Fourth post', 'How-to consectetur adipisicing elit', 4);
  



COMMIT;
