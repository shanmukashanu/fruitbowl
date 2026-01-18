import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://grdmwetcqssahiwlqdsz.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImMyZDIwOWE3LTAzNzctNGVlZi1iZDk0LWJlMDA5NWFlNTlkYSJ9.eyJwcm9qZWN0SWQiOiJncmRtd2V0Y3Fzc2FoaXdscWRzeiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY4NjQ2MzIzLCJleHAiOjIwODQwMDYzMjMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.tZYF9fUfSwKinybLbe2c1zudvdPtla-CX3C5UZ2eAkU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };