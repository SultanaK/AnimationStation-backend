CREATE TYPE IF NOT EXISTS animation_direction AS ENUM (
    'normal',
    'reverse',
    'alternate',
    'alternate-reverse'
);

ALTER TABLE animations
  ADD COLUMN
    direction animation_direction;