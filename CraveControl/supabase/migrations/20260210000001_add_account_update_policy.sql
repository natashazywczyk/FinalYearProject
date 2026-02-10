-- Add UPDATE policy for account table
CREATE POLICY "Users can update their own account"
  ON public.account
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
