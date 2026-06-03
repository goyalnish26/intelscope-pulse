
DROP POLICY "Anyone can subscribe" ON public.subscribers;

CREATE POLICY "Anyone can subscribe with valid email"
  ON public.subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
