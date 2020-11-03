BEGIN;

TRUNCATE
  animations,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, email, password)
VALUES
  ('dunder', 'Dunder Mifflin', 'dunder@email.com', '$2a$10$jOUf1PzodRaZm1gWz3w/K.QQoB9.giNHzPQ5v65EUsWhn4545kisy'),
  ('b.deboop', 'Bodeep Deboop', 'Bo@gmail.com', '$2a$10$SqPusKk3PDk.GvBIfyitqORO5bujAXMOKN7SUryMadFTCcT0XTZ8m'),
  ('wippy', 'Ping Won In', 'Ping@yahoo.com', '$2a$10$GGBXtEu3Fglwd/Pawi5F5.A/NObHkfnf0JmZiNHaXypeUd6A6UpUe'),
  ('Ping', 'Ping Won In', 'won@yahoo.com', '$2a$10$qh7H8r659496l4ISPNujquOGSkbHWsjLo9mTmRa9rjcraTrEdnPzS');

INSERT INTO animations (title, content, user_id)
VALUES
  ('First post!', 'Interview amet consectetur adipisicing elit.', 1),
  ('Second post!', 'How-to consectetur adipisicing elit.', 2),
  ('Third post!', 'News dolor sit amet, consectetur adipisicing elit', 3),
  ('Fourth post', 'How-to consectetur adipisicing elit', 4);
  



COMMIT;
