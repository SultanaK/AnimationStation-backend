CREATE TYPE animation_fill AS ENUM (
  'forwards',
  'backwards',
  'both',
  'none'
);

ALTER TABLE animations
  ADD COLUMN
    fill animation_fill;