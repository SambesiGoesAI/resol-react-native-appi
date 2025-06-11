-- Insert test users for role-based news filtering

INSERT INTO users (id, email, role, access_code, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'user1@example.com', 'user', 'ACCESSCODE1', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'user2@example.com', 'user', 'ACCESSCODE2', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'user3@example.com', 'user', 'ACCESSCODE3', NOW(), NOW());