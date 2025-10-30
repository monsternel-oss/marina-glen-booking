-- Quick SQL to make a user admin
-- Run this in your PostgreSQL database after registering

UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@marinaglen.co.za';

-- Check if it worked
SELECT id, email, first_name, last_name, role 
FROM users 
WHERE email = 'admin@marinaglen.co.za';