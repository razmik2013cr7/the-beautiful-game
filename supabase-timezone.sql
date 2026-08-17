-- Kick-off timezone support
-- Run this in the Supabase SQL Editor once.

alter table public.matches add column if not exists timezone text;

-- Existing matches have no timezone stored, so they keep showing
-- the wall-clock time as-is. New matches automatically save the
-- admin's timezone and are shown converted to each visitor's timezone.
