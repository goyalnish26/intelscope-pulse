-- Explicitly deny SELECT on subscribers to anon and authenticated roles.
-- Service role bypasses RLS and remains able to read for admin/backend use.
REVOKE SELECT ON public.subscribers FROM anon, authenticated;

CREATE POLICY "No public read access to subscribers"
ON public.subscribers
FOR SELECT
TO anon, authenticated
USING (false);