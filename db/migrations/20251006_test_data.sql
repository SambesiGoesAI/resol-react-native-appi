-- Test Data for Role-Based News Filtering

-- Insert test users
INSERT INTO users (id, email, role, access_code, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'user1@example.com', 'user', 'ACCESSCODE1', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'user2@example.com', 'user', 'ACCESSCODE2', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'user3@example.com', 'user', 'ACCESSCODE3', NOW(), NOW());

-- Insert test housing companies
INSERT INTO housing_companies (id, name, address, contact_info, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Asunto Oy Keskuskatu 1', 'Keskuskatu 1, 00100 Helsinki', 'info@keskuskatu1.fi', NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Asunto Oy Puistotie 5', 'Puistotie 5, 00200 Helsinki', 'hallitus@puistotie5.fi', NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Asunto Oy Rantakatu 10', 'Rantakatu 10, 00300 Helsinki', 'yhtiot@rantakatu10.fi', NOW(), NOW());

-- Assign users to housing companies
INSERT INTO user_housing_companies (id, user_id, housing_company_id, created_at) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW());

-- Insert news items for different housing companies
INSERT INTO news (id, title, text, image_url, housing_company_id, created_at, updated_at) VALUES
  (gen_random_uuid(), 'News for Keskuskatu 1', 'Important update for Keskuskatu 1 residents.', NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  (gen_random_uuid(), 'Maintenance Notice for Puistotie 5', 'Scheduled maintenance on Puistotie 5.', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
  (gen_random_uuid(), 'Community Event at Rantakatu 10', 'Join us for a community event at Rantakatu 10.', NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW());