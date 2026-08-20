-- DROP TABLES (in reverse dependency order)
DROP TABLE IF EXISTS "report";
DROP TABLE IF EXISTS "notification";
DROP TABLE IF EXISTS "gamification";
DROP TABLE IF EXISTS "user_award";
DROP TABLE IF EXISTS "awards";
DROP TABLE IF EXISTS "savings_target";
DROP TABLE IF EXISTS "expense_target";
DROP TABLE IF EXISTS "fixed_expense";
DROP TABLE IF EXISTS "expense";
DROP TABLE IF EXISTS "expense_label";
DROP TABLE IF EXISTS "expense_category";
DROP TABLE IF EXISTS "fixed_income";
DROP TABLE IF EXISTS "income";
DROP TABLE IF EXISTS "income_label";
DROP TABLE IF EXISTS "income_category";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "award";

-- Drop the custom type if it exists
DROP TYPE IF EXISTS frequency_enum;

CREATE TYPE frequency_enum AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- USER
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_number" BIGINT NOT NULL,
    "birthdate" DATE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_login" DATE NOT NULL,
    "amount_saved" DECIMAL(8, 2) NOT NULL,
    "last_percentage" DECIMAL(8, 2)
);

-- INCOME
CREATE TABLE "income_category" (
    "id" BIGINT PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "income_label" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL
);

CREATE TABLE "income" (
    "id" SERIAL PRIMARY KEY,
    "label_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "value" DECIMAL(8, 2) NOT NULL,
    "occurrence_date" DATE NOT NULL,
    "insertion_date" DATE NOT NULL
);

CREATE TABLE "fixed_income" (
    "id" SERIAL PRIMARY KEY,
    "label_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "value" DECIMAL(8, 2) NOT NULL,
    "start_date" DATE NOT NULL,
    "frequency" frequency_enum NOT NULL,
    "insertion_date" DATE NOT NULL
);

-- EXPENSE
CREATE TABLE "expense_category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "expense_label" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "target" DECIMAL(8, 2) NOT NULL,
    "spent" DECIMAL(8, 2) NOT NULL
);

CREATE TABLE "expense" (
    "id" SERIAL PRIMARY KEY,
    "label_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "value" DECIMAL(8, 2) NOT NULL,
    "occurrence_date" DATE NOT NULL,
    "insertion_date" DATE NOT NULL
);

CREATE TABLE "fixed_expense" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "label_id" BIGINT NOT NULL,
    "value" DECIMAL(8, 2) NOT NULL,
    "start_date" DATE NOT NULL,
    "frequency" frequency_enum NOT NULL,
    "insertion_date" DATE NOT NULL
);

CREATE TABLE "expense_target" (
    "expense_category_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "target" BIGINT NOT NULL,
    PRIMARY KEY ("expense_category_id", "user_id")
);

-- SAVINGS
CREATE TABLE "savings_target" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "by_date" DATE NOT NULL,
    "priority" BIGINT NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- GAMIFICATION
CREATE TABLE "awards" (
    "id" BIGINT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "condition_type" VARCHAR(255) CHECK (
        "condition_type" IN (
            'amount_saved',
            'consecutive_login',
            'consecutive_income',
            'consecutive_dispense'
        )
    ) NOT NULL,
    "condition_threshold" DECIMAL(8, 2) NOT NULL
);

CREATE TABLE "user_award" (
    "award_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "received" BOOLEAN NOT NULL,
    PRIMARY KEY ("award_id", "user_id")
);

CREATE TABLE "gamification" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "level" BIGINT NOT NULL,
    "exp_points" BIGINT,
    "consecutive_income" BIGINT,
    "last_income" DATE NULL,
    "consecutive_dispense" BIGINT,
    "last_dispense" DATE NULL,
    "consecutive_login" BIGINT 
);

-- NOTIFICATIONS & REPORTS
CREATE TABLE "notification" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "notification_date" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL
);


CREATE TABLE "report" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "csv_path" TEXT NOT NULL
);

-- FOREIGN KEYS
ALTER TABLE "income_label"
    ADD CONSTRAINT "fk_income_label_user" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    ADD CONSTRAINT "fk_income_label_category" FOREIGN KEY ("category_id") REFERENCES "income_category"("id");

ALTER TABLE "income"
    ADD CONSTRAINT "fk_income_label" FOREIGN KEY ("label_id") REFERENCES "income_label"("id"),
    ADD CONSTRAINT "fk_income_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "fixed_income"
    ADD CONSTRAINT "fk_fixed_income_user" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    ADD CONSTRAINT "fk_fixed_income_label" FOREIGN KEY ("label_id") REFERENCES "income_label"("id");

ALTER TABLE "expense_label"
    ADD CONSTRAINT "fk_expense_label_user" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    ADD CONSTRAINT "fk_expense_label_category" FOREIGN KEY ("category_id") REFERENCES "expense_category"("id");

ALTER TABLE "expense"
    ADD CONSTRAINT "fk_expense_label" FOREIGN KEY ("label_id") REFERENCES "expense_label"("id"),
    ADD CONSTRAINT "fk_expense_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "fixed_expense"
    ADD CONSTRAINT "fk_fixed_expense_user" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    ADD CONSTRAINT "fk_fixed_expense_label" FOREIGN KEY ("label_id") REFERENCES "expense_label"("id");

ALTER TABLE "expense_target"
    ADD CONSTRAINT "fk_expense_target_category" FOREIGN KEY ("expense_category_id") REFERENCES "expense_category"("id"),
    ADD CONSTRAINT "fk_expense_target_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "savings_target"
    ADD CONSTRAINT "fk_savings_target_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "user_award"
    ADD CONSTRAINT "fk_user_award_user" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    ADD CONSTRAINT "fk_user_award_award" FOREIGN KEY ("award_id") REFERENCES "awards"("id");

ALTER TABLE "gamification"
    ADD CONSTRAINT "fk_gamification_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "notification"
    ADD CONSTRAINT "fk_notification_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "report"
    ADD CONSTRAINT "fk_report_user" FOREIGN KEY ("user_id") REFERENCES "user"("id");

-- USERS
INSERT INTO "user" (name, email, mobile_number, birthdate, password_hash, last_login, amount_saved) VALUES
('Alice Doe', 'alice@example.com', 929999999, '1990-05-15', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-04-01', 500.00), -- password : batata (assumindo bcrypt com 12 rondas)
('Bob Smith', 'bob.smith@example.com', 928888888, '1988-11-20', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-04-05', 1340.75),
('Carol Johnson', 'carol.j@example.com', 927777777, '1992-03-12', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-04-10', 275.20),
('David Lee', 'david.lee@example.com', 926666666, '1985-08-30', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-03-29', 920.00),
('Emma White', 'emma.w@example.com', 925555555, '1995-12-05', '$2a$12$it6kihATAZkJh9pFuy8Gfe4wRnD7b.jM.1pOVSuq6adgog/3uwB8K', '2025-04-12', 680.40);

-- INCOME CATEGORY
INSERT INTO "income_category" (id, name) VALUES 
(1, 'Salary'),
(2, 'Investment'),
(3, 'Freelance');

INSERT INTO "income_label" (user_id, category_id, name) VALUES
(1, 1, 'None'),
(1, 2, 'None'),
(1, 3, 'None'),
(2, 1, 'None'),
(2, 2, 'None'),
(2, 3, 'None'),
(3, 1, 'None'),
(3, 2, 'None'),
(3, 3, 'None'),
(4, 1, 'None'),
(4, 2, 'None'),
(4, 3, 'None'),
(5, 1, 'None'),
(5, 2, 'None'),
(5, 3, 'None');

-- INCOME
INSERT INTO "income" (label_id, user_id, value, occurrence_date, insertion_date)
SELECT random_label, random_user, (random() * 100), random_occ, random_ins
FROM generate_series(1, 3) as random_label,
    generate_series(1, 5) as random_user,
    generate_series(
        TIMESTAMPTZ '2025-05-01',
        TIMESTAMPTZ '2025-05-30',
        INTERVAL '5 days'
    ) as random_occ,
    generate_series(
        TIMESTAMPTZ '2025-05-01',
        TIMESTAMPTZ '2025-05-30',
        INTERVAL '5 days'
    ) as random_ins;
-- (1, 1, 3000.00, '2025-03-31', '2025-04-01'),
-- (2, 1, 500.00, '2025-03-15', '2025-03-15');

-- FIXED INCOME
INSERT INTO "fixed_income" (label_id, user_id, value, start_date, frequency, insertion_date) VALUES
(1, 1, 3000.00, '2024-01-01', 'WEEKLY', '2024-01-01');

-- EXPENSE CATEGORIES & LABELS
INSERT INTO "expense_category" (id, name) VALUES
(1,'Food'),
(2,'Transport'),
(3,'Health'),
(4,'Groceries'),
(5,'Rent'),
(6,'Gifts'),
(7,'Savings'),
(8,'Entertainment');

INSERT INTO "expense_label" (user_id, category_id, name, target, spent) VALUES
(1,1,'None',0,0),
(1,2,'None',0,0),
(1,3,'None',0,0),
(1,4,'None',0,0),
(1,5,'None',0,0),
(1,6,'None',0,0),
(1,7,'None',0,0),
(1,8,'None',0,0),
(2,1,'None',0,0),
(2,2,'None',0,0),
(2,3,'None',0,0),
(2,4,'None',0,0),
(2,5,'None',0,0),
(2,6,'None',0,0),
(2,7,'None',0,0),
(2,8,'None',0,0),
(3,1,'None',0,0),
(3,2,'None',0,0),
(3,3,'None',0,0),
(3,4,'None',0,0),
(3,5,'None',0,0),
(3,6,'None',0,0),
(3,7,'None',0,0),
(3,8,'None',0,0),
(4,1,'None',0,0),
(5,2,'None',0,0),
(5,3,'None',0,0),
(5,4,'None',0,0),
(5,5,'None',0,0),
(5,6,'None',0,0),
(5,7,'None',0,0),
(5,8,'None',0,0);

-- EXPENSE
INSERT INTO "expense" (label_id, user_id, value, occurrence_date, insertion_date)
SELECT random_label, random_user, (random() * 100), random_occ, random_ins
FROM generate_series(1, 8) as random_label,
    generate_series(1, 5) as random_user,
    generate_series(
        TIMESTAMPTZ '2025-05-01',
        TIMESTAMPTZ '2025-05-30',
        INTERVAL '5 days'
    ) as random_occ,
    generate_series(
        TIMESTAMPTZ '2025-05-01',
        TIMESTAMPTZ '2025-05-30',
        INTERVAL '5 days'
    ) as random_ins;

-- FIXED EXPENSE
INSERT INTO "fixed_expense" (user_id, label_id, value, start_date, frequency, insertion_date) VALUES
(1, 1, 300.00, '2024-01-01', 'DAILY', '2024-01-01');
-- Adding example fixed incomes for Alice Doe (user_id = 1)
-- Assuming label_id 1 corresponds to 'Salary' for Alice
INSERT INTO "fixed_income" (label_id, user_id, value, start_date, frequency, insertion_date) VALUES
(1, 1, 1500.00, '2025-05-01', 'MONTHLY', '2025-04-28'), -- Monthly salary, frequency '00:00:00' implies a fixed interval, often used for 'monthly' if not explicitly a string
(2, 1, 250.00, '2025-05-15', 'WEEKLY', '2025-05-10'); -- Bi-weekly freelance payment, assuming label_id 2 is for 'Investment' or 'Freelance'

-- Adding example fixed expenses for Alice Doe (user_id = 1)
-- Assuming label_id 1 corresponds to a general 'None' expense label for Alice
INSERT INTO "fixed_expense" (user_id, label_id, value, start_date, frequency, insertion_date) VALUES
(1, 5, 800.00, '2025-05-01', 'MONTHLY', '2025-04-25'), -- Rent
(1, 2, 50.00, '2025-05-05', 'WEEKLY', '2025-05-01'), -- Public transport
(1, 4, 150.00, '2025-05-10', 'MONTHLY', '2025-05-08'); -- Internet bill


-- EXPENSE TARGET
INSERT INTO "expense_target" (expense_category_id, user_id, target) VALUES
(1, 1, 400),
(2, 1, 400),
(3, 1, 400),
(4, 1, 400),
(5, 1, 400),
(6, 1, 400),
(7, 1, 400),
(8, 1, 100);

-- SAVINGS TARGET
INSERT INTO "savings_target" (user_id, name, amount, by_date, priority, active) VALUES
(1, 'Carro', 50000, '2025-12-31', 1, true);

-- AWARDS & USER AWARDS
INSERT INTO "awards" (id, name, description, condition_type, condition_threshold) VALUES
(1, 'Piggy Bank', 'Save more than $500', 'amount_saved', 500.00),
(2, 'Safe', 'Save more than $1000', 'amount_saved', 1000.00),
(3, 'Treasure', 'Save more than $5000', 'amount_saved', 5000.00),
(4, 'Bank', 'Save more than $50000', 'amount_saved', 50000.00),
(5, 'Daily Earner', 'Log income for 5 consecutive days', 'consecutive_income', 5),
(6, 'Grain by Grain', 'Log income for 20 consecutive days', 'consecutive_income', 20),
(7, 'Full Chicken', 'Log income for 50 consecutive days', 'consecutive_income', 50),
(8, 'Here often?', 'Log in for 7 consecutive days', 'consecutive_login', 7),
(9, 'Here always?', 'Log in for 30 consecutive days', 'consecutive_login', 30),
(10, 'Here forever?', 'Log in for 100 consecutive days', 'consecutive_login', 100);

INSERT INTO "user_award" (award_id, user_id, received) VALUES
(1, 1, true),
(2, 1, true),
(3, 1, false),
(4, 1, false),
(5, 1, true),
(6, 1, false),
(7, 1, false),
(8, 1, true),
(9, 1, false),
(10, 1, false);

-- GAMIFICATION
INSERT INTO "gamification" (user_id, level, exp_points, consecutive_income, last_income, consecutive_dispense, last_dispense, consecutive_login) VALUES
(1, 3, 750, 7, '2025-03-31', 1, '2025-03-10', 10);

-- NOTIFICATION
INSERT INTO "notification" (user_id, notification_date, title, text, read) VALUES
(1, '2025-05-21 14:30:00', 'Attention!', 'You have reached 70% of your groceries budget!', false),
(1, '2025-05-20 10:15:00', 'Attention!', 'New award unlocked: Saver!', true);


-- REPORT
INSERT INTO "report" (user_id, date, csv_path) VALUES
(1, '2025-03-31', '/reports/alice_2025_03.csv');
