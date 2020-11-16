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
  ('nathanielmata', 'Nathaniel Mata', 'nate@nathanielmata.com', '$2a$12$m/8jl1QtXbncFH3D5gdBM.XDeGQu.dDgfl80hUxj0aZBCxkxtxoDK');


INSERT INTO animations (title, delay, duration, iteration, direction, timing, fill, target, user_id, keyframe)
VALUES
  ('Test 5', 1, 500, 10, 'reverse', 'ease-in', 'both', 'square', 1, '{"rotate-diagonal":"\n  @keyframes rotate-diagonal {\n    0% {\n      -webkit-transform: rotate3d(-1, 1, 0, 0deg);\n              transform: rotate3d(-1, 1, 0, 0deg);\n    }\n    50% {\n      -webkit-transform: rotate3d(-1, 1, 0, 180deg);\n              transform: rotate3d(-1, 1, 0, 180deg);\n    }\n    100% {\n      -webkit-transform: rotate3d(-1, 1, 0, 360deg);\n              transform: rotate3d(-1, 1, 0, 360deg);\n    }\n  }"}');

COMMIT;
