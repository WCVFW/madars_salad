-- Grant admin access to the current user
INSERT INTO public.user_roles (user_id, role)
VALUES ('1f9b2b88-0cbd-467f-937d-52f41913b948', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;