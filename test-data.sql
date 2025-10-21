INSERT INTO public.locations (name, qr_code, building, floor, is_active) 
VALUES ('Toilet Lantai 1-A', 'TOILET-1A-001', 'Gedung A', '1', true);

INSERT INTO public.users (email, full_name, password_hash, is_active)
VALUES ('test@example.com', 'Test User', 'temp_hash', true);

SELECT * FROM public.locations;
SELECT * FROM public.users;
