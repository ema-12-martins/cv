INSERT INTO "income_category" (id, name) VALUES 
(1, 'Salary'),
(2, 'Investment'),
(3, 'Freelance');

-- USERS
INSERT INTO "user" (name, email, mobile_number, birthdate, password_hash, last_login, amount_saved) VALUES
('Alice Doe', 'alice@example.com', 929999999, '1990-05-15', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-04-01', 500.00), -- password : batata (assumindo bcrypt com 12 rondas)