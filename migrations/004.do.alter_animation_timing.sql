CREATE TYPE animation_timing AS ENUM (
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out'
);

ALTER TABLE animations
  ADD COLUMN
    timing animation_timing;