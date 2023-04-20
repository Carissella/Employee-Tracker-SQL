INSERT INTO department (name) VALUES
('Finance'),
('Healthcare'),
('Sales'),
('Engineering'),
('Marketing');

INSERT INTO roles (title, salary, department_id) VALUES
('Hedgefund Manager', 400000, 1),
('Finance Consultant', 75000, 1),
('Doctor', 900000, 2),
('Nurse', 130000, 2),
('Salesmen', 30000, 3),
('Business Salesmen', 60000, 3),
('Engineer', 90000, 4),
('Principal Engineer', 180000, 4),
('Advertising Accountant', 100000, 5),
('Marketing Agent', 90000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Rocky', 'Road', 1, 2),
('Sharon', 'Bert', 2, null),
('Beatriss', 'Pecan', 3, 4),
('Teera', 'Missu', 4, null),
('Corey', 'Inthian', 5, 6),
('Andy', 'Kin', 6, null),
('Rory', 'Pinkles', 7, 8),
('Lisa', "Pizza", 8, null),
('Yesslay', 'Ahhline', 9, 10),
('Tomato', 'Potato', 10, null);