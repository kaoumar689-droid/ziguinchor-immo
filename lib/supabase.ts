import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://cdihkzydctnnegkfpooo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaWhrenxkY3RubmVna2Zwb29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Nzc4MDYsImV4cCI6MjA5NDQ1MzgwNn0.yR8_pzfQSQao2wkE4jtCWj3JzmfPa8_fMAP8z7GHXr8'
)