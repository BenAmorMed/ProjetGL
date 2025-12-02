-- Sample Data for Exam Surveillance Management System
-- This file contains realistic test data for the application

-- ============================================================
-- USERS TABLE
-- ============================================================
-- Admin user (password: admin123)
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'admin@upec.fr', 'ADMIN');

-- Teacher users (password: teacher123 for all)
INSERT INTO users (username, password, email, role) VALUES
('jdupont', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'jean.dupont@upec.fr', 'TEACHER'),
('mmartin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'marie.martin@upec.fr', 'TEACHER'),
('pbernard', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'pierre.bernard@upec.fr', 'TEACHER'),
('sdubois', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'sophie.dubois@upec.fr', 'TEACHER'),
('lthomas', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'luc.thomas@upec.fr', 'TEACHER'),
('arobert', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'anne.robert@upec.fr', 'TEACHER'),
('nrichard', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'nicolas.richard@upec.fr', 'TEACHER'),
('cgarcia', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'christine.garcia@upec.fr', 'TEACHER'),
('fmorel', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'francois.morel@upec.fr', 'TEACHER'),
('elefevre', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'emilie.lefevre@upec.fr', 'TEACHER'),
('droux', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'david.roux@upec.fr', 'TEACHER'),
('ilambert', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'isabelle.lambert@upec.fr', 'TEACHER'),
('vfontaine', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'vincent.fontaine@upec.fr', 'TEACHER'),
('sbonnet', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'sandrine.bonnet@upec.fr', 'TEACHER'),
('msimon', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'marc.simon@upec.fr', 'TEACHER');

-- ============================================================
-- ROOMS TABLE
-- ============================================================
INSERT INTO rooms (name, capacity, location) VALUES
-- Main Buildings
('Amphi A', 300, 'Bâtiment Principal - Niveau 0'),
('Amphi B', 250, 'Bâtiment Principal - Niveau 0'),
('Amphi C', 200, 'Bâtiment Sciences - Niveau 1'),
('Amphi D', 180, 'Bâtiment Sciences - Niveau 1'),

-- Large Lecture Halls
('Salle 101', 100, 'Bâtiment A - Niveau 1'),
('Salle 102', 100, 'Bâtiment A - Niveau 1'),
('Salle 103', 80, 'Bâtiment A - Niveau 1'),
('Salle 201', 90, 'Bâtiment A - Niveau 2'),
('Salle 202', 90, 'Bâtiment A - Niveau 2'),
('Salle 203', 75, 'Bâtiment A - Niveau 2'),

-- Medium Rooms
('Salle B101', 60, 'Bâtiment B - Niveau 1'),
('Salle B102', 60, 'Bâtiment B - Niveau 1'),
('Salle B201', 55, 'Bâtiment B - Niveau 2'),
('Salle B202', 55, 'Bâtiment B - Niveau 2'),

-- Small Rooms
('Salle C101', 40, 'Bâtiment C - Niveau 1'),
('Salle C102', 40, 'Bâtiment C - Niveau 1'),
('Salle C103', 35, 'Bâtiment C - Niveau 1'),
('Salle C201', 40, 'Bâtiment C - Niveau 2'),
('Salle C202', 40, 'Bâtiment C - Niveau 2'),
('Salle C203', 35, 'Bâtiment C - Niveau 2'),

-- Computer Labs
('Labo Info 1', 50, 'Bâtiment Informatique - Niveau 1'),
('Labo Info 2', 50, 'Bâtiment Informatique - Niveau 1'),
('Labo Info 3', 45, 'Bâtiment Informatique - Niveau 2'),
('Labo Info 4', 45, 'Bâtiment Informatique - Niveau 2'),

-- Specialized Rooms
('Salle TP 1', 30, 'Bâtiment Sciences - Niveau 2'),
('Salle TP 2', 30, 'Bâtiment Sciences - Niveau 2');

-- ============================================================
-- EXAMS TABLE
-- ============================================================
-- January 2025 Exam Session
INSERT INTO exams (subject, date, start_time, end_time) VALUES
-- Week 1 - Jan 6-10, 2025
('Génie Logiciel', '2025-01-06', '08:30:00', '11:30:00'),
('Bases de Données Avancées', '2025-01-06', '14:00:00', '17:00:00'),
('Réseaux et Communication', '2025-01-07', '08:30:00', '11:30:00'),
('Architecture Logicielle', '2025-01-07', '14:00:00', '16:30:00'),
('Systèmes Distribués', '2025-01-08', '08:30:00', '11:30:00'),
('Sécurité Informatique', '2025-01-08', '14:00:00', '17:00:00'),
('Intelligence Artificielle', '2025-01-09', '08:30:00', '11:30:00'),
('Machine Learning', '2025-01-09', '14:00:00', '17:00:00'),
('Développement Web Avancé', '2025-01-10', '08:30:00', '11:30:00'),
('Programmation Mobile', '2025-01-10', '14:00:00', '16:30:00'),

-- Week 2 - Jan 13-17, 2025
('Algorithmique Avancée', '2025-01-13', '08:30:00', '11:30:00'),
('Théorie des Graphes', '2025-01-13', '14:00:00', '17:00:00'),
('Compilation', '2025-01-14', '08:30:00', '11:30:00'),
('Systèmes d''Exploitation', '2025-01-14', '14:00:00', '17:00:00'),
('Cloud Computing', '2025-01-15', '08:30:00', '11:30:00'),
('DevOps et CI/CD', '2025-01-15', '14:00:00', '16:30:00'),
('Big Data Analytics', '2025-01-16', '08:30:00', '11:30:00'),
('Internet des Objets', '2025-01-16', '14:00:00', '17:00:00'),
('Blockchain et Cryptographie', '2025-01-17', '08:30:00', '11:30:00'),
('Gestion de Projet Agile', '2025-01-17', '14:00:00', '16:30:00'),

-- Week 3 - Jan 20-24, 2025
('Modélisation UML', '2025-01-20', '08:30:00', '11:30:00'),
('Qualité Logicielle', '2025-01-20', '14:00:00', '17:00:00'),
('Interface Homme-Machine', '2025-01-21', '08:30:00', '11:30:00'),
('Accessibilité Numérique', '2025-01-21', '14:00:00', '16:30:00'),
('Réalité Virtuelle', '2025-01-22', '08:30:00', '11:30:00'),
('Vision par Ordinateur', '2025-01-22', '14:00:00', '17:00:00'),
('Traitement du Langage Naturel', '2025-01-23', '08:30:00', '11:30:00'),
('Robotique', '2025-01-23', '14:00:00', '17:00:00'),
('Éthique et Droit Numérique', '2025-01-24', '08:30:00', '11:30:00'),
('Management des SI', '2025-01-24', '14:00:00', '16:30:00');

-- ============================================================
-- AVAILABILITIES TABLE
-- ============================================================
-- Availabilities for January 2025 exam period
-- Week 1 (Jan 6-10, 2025)
INSERT INTO availabilities (user_id, date, start_time, end_time) VALUES
-- Jean Dupont - available most mornings
(2, '2025-01-06', '08:00:00', '12:00:00'),
(2, '2025-01-07', '08:00:00', '12:00:00'),
(2, '2025-01-08', '08:00:00', '12:00:00'),
(2, '2025-01-09', '14:00:00', '18:00:00'),
(2, '2025-01-10', '08:00:00', '12:00:00'),

-- Marie Martin - prefers afternoons
(3, '2025-01-06', '14:00:00', '18:00:00'),
(3, '2025-01-07', '14:00:00', '18:00:00'),
(3, '2025-01-08', '14:00:00', '18:00:00'),
(3, '2025-01-09', '08:00:00', '12:00:00'),
(3, '2025-01-10', '14:00:00', '18:00:00'),

-- Pierre Bernard - full days available
(4, '2025-01-06', '08:00:00', '18:00:00'),
(4, '2025-01-08', '08:00:00', '18:00:00'),
(4, '2025-01-10', '08:00:00', '18:00:00'),

-- Sophie Dubois - mixed schedule
(5, '2025-01-06', '08:00:00', '12:00:00'),
(5, '2025-01-07', '14:00:00', '18:00:00'),
(5, '2025-01-08', '08:00:00', '12:00:00'),
(5, '2025-01-09', '14:00:00', '18:00:00'),
(5, '2025-01-10', '08:00:00', '18:00:00'),

-- Luc Thomas
(6, '2025-01-06', '14:00:00', '18:00:00'),
(6, '2025-01-07', '08:00:00', '12:00:00'),
(6, '2025-01-08', '14:00:00', '18:00:00'),
(6, '2025-01-09', '08:00:00', '12:00:00'),
(6, '2025-01-10', '14:00:00', '18:00:00'),

-- Anne Robert
(7, '2025-01-06', '08:00:00', '18:00:00'),
(7, '2025-01-07', '08:00:00', '18:00:00'),
(7, '2025-01-09', '08:00:00', '18:00:00'),

-- Nicolas Richard
(8, '2025-01-07', '08:00:00', '12:00:00'),
(8, '2025-01-08', '08:00:00', '12:00:00'),
(8, '2025-01-09', '14:00:00', '18:00:00'),
(8, '2025-01-10', '08:00:00', '12:00:00'),

-- Christine Garcia
(9, '2025-01-06', '08:00:00', '12:00:00'),
(9, '2025-01-07', '14:00:00', '18:00:00'),
(9, '2025-01-08', '08:00:00', '18:00:00'),
(9, '2025-01-09', '08:00:00', '12:00:00'),
(9, '2025-01-10', '14:00:00', '18:00:00'),

-- François Morel - Week 2 (Jan 13-17)
(10, '2025-01-13', '08:00:00', '18:00:00'),
(10, '2025-01-14', '08:00:00', '18:00:00'),
(10, '2025-01-15', '08:00:00', '12:00:00'),
(10, '2025-01-16', '14:00:00', '18:00:00'),
(10, '2025-01-17', '08:00:00', '18:00:00'),

-- Emilie Lefèvre - Week 2
(11, '2025-01-13', '14:00:00', '18:00:00'),
(11, '2025-01-14', '14:00:00', '18:00:00'),
(11, '2025-01-15', '08:00:00', '18:00:00'),
(11, '2025-01-16', '08:00:00', '12:00:00'),
(11, '2025-01-17', '14:00:00', '18:00:00'),

-- David Roux - Week 2
(12, '2025-01-13', '08:00:00', '12:00:00'),
(12, '2025-01-14', '08:00:00', '12:00:00'),
(12, '2025-01-15', '14:00:00', '18:00:00'),
(12, '2025-01-16', '08:00:00', '18:00:00'),
(12, '2025-01-17', '08:00:00', '12:00:00'),

-- Isabelle Lambert - Week 3 (Jan 20-24)
(13, '2025-01-20', '08:00:00', '18:00:00'),
(13, '2025-01-21', '08:00:00', '18:00:00'),
(13, '2025-01-22', '14:00:00', '18:00:00'),
(13, '2025-01-23', '08:00:00', '12:00:00'),
(13, '2025-01-24', '08:00:00', '18:00:00'),

-- Vincent Fontaine - Week 3
(14, '2025-01-20', '14:00:00', '18:00:00'),
(14, '2025-01-21', '08:00:00', '12:00:00'),
(14, '2025-01-22', '08:00:00', '18:00:00'),
(14, '2025-01-23', '14:00:00', '18:00:00'),
(14, '2025-01-24', '08:00:00', '12:00:00'),

-- Sandrine Bonnet - Week 3
(15, '2025-01-20', '08:00:00', '12:00:00'),
(15, '2025-01-21', '14:00:00', '18:00:00'),
(15, '2025-01-22', '08:00:00', '12:00:00'),
(15, '2025-01-23', '08:00:00', '18:00:00'),
(15, '2025-01-24', '14:00:00', '18:00:00'),

-- Marc Simon - Available across all weeks
(16, '2025-01-06', '08:00:00', '18:00:00'),
(16, '2025-01-09', '08:00:00', '18:00:00'),
(16, '2025-01-13', '08:00:00', '18:00:00'),
(16, '2025-01-16', '08:00:00', '18:00:00'),
(16, '2025-01-20', '08:00:00', '18:00:00'),
(16, '2025-01-23', '08:00:00', '18:00:00');

-- ============================================================
-- ASSIGNMENTS TABLE
-- ============================================================
-- Sample assignments for Week 1
INSERT INTO assignments (exam_id, room_id, supervisor_id) VALUES
-- Jan 6 Morning - Génie Logiciel
(1, 1, 2),  -- Amphi A - Jean Dupont
(1, 2, 4),  -- Amphi B - Pierre Bernard

-- Jan 6 Afternoon - Bases de Données Avancées
(2, 1, 3),  -- Amphi A - Marie Martin
(2, 2, 5),  -- Amphi B - Sophie Dubois

-- Jan 7 Morning - Réseaux et Communication
(3, 1, 2),  -- Amphi A - Jean Dupont
(3, 3, 7),  -- Amphi C - Anne Robert

-- Jan 7 Afternoon - Architecture Logicielle
(4, 1, 3),  -- Amphi A - Marie Martin
(4, 4, 5),  -- Amphi D - Sophie Dubois

-- Jan 8 Morning - Systèmes Distribués
(5, 1, 2),  -- Amphi A - Jean Dupont
(5, 2, 4),  -- Amphi B - Pierre Bernard
(5, 5, 8),  -- Salle 101 - Nicolas Richard

-- Jan 8 Afternoon - Sécurité Informatique
(6, 1, 3),  -- Amphi A - Marie Martin
(6, 2, 5),  -- Amphi B - Sophie Dubois
(6, 3, 6),  -- Amphi C - Luc Thomas

-- Jan 9 Morning - Intelligence Artificielle
(7, 1, 7),  -- Amphi A - Anne Robert
(7, 2, 3),  -- Amphi B - Marie Martin

-- Jan 9 Afternoon - Machine Learning
(8, 1, 2),  -- Amphi A - Jean Dupont
(8, 2, 5),  -- Amphi B - Sophie Dubois
(8, 3, 8),  -- Amphi C - Nicolas Richard

-- Jan 10 Morning - Développement Web Avancé
(9, 1, 2),  -- Amphi A - Jean Dupont
(9, 2, 4),  -- Amphi B - Pierre Bernard
(9, 5, 9),  -- Salle 101 - Christine Garcia

-- Jan 10 Afternoon - Programmation Mobile
(10, 1, 3),  -- Amphi A - Marie Martin
(10, 2, 5),  -- Amphi B - Sophie Dubois
(10, 6, 6),  -- Salle 102 - Luc Thomas

-- Week 2 assignments
(11, 1, 10), -- Jan 13 Morning - Algorithmique Avancée
(11, 2, 10), 
(12, 1, 11), -- Jan 13 Afternoon - Théorie des Graphes
(12, 2, 11),
(13, 1, 10), -- Jan 14 Morning - Compilation
(14, 1, 11), -- Jan 14 Afternoon - Systèmes d'Exploitation
(14, 2, 11),
(15, 1, 10), -- Jan 15 Morning - Cloud Computing
(15, 2, 12),
(16, 1, 11), -- Jan 15 Afternoon - DevOps et CI/CD
(17, 1, 12), -- Jan 16 Morning - Big Data Analytics
(17, 2, 16),
(18, 1, 10), -- Jan 16 Afternoon - Internet des Objets
(19, 1, 10), -- Jan 17 Morning - Blockchain et Cryptographie
(19, 2, 12),
(20, 1, 11), -- Jan 17 Afternoon - Gestion de Projet Agile

-- Week 3 assignments
(21, 1, 13), -- Jan 20 Morning - Modélisation UML
(21, 2, 16),
(22, 1, 14), -- Jan 20 Afternoon - Qualité Logicielle
(23, 1, 13), -- Jan 21 Morning - Interface Homme-Machine
(23, 2, 16),
(24, 1, 14), -- Jan 21 Afternoon - Accessibilité Numérique
(25, 1, 13), -- Jan 22 Morning - Réalité Virtuelle
(25, 2, 14),
(26, 1, 13), -- Jan 22 Afternoon - Vision par Ordinateur
(27, 1, 16), -- Jan 23 Morning - Traitement du Langage Naturel
(28, 1, 13), -- Jan 23 Afternoon - Robotique
(28, 2, 15),
(29, 1, 13), -- Jan 24 Morning - Éthique et Droit Numérique
(29, 2, 16),
(30, 1, 14); -- Jan 24 Afternoon - Management des SI
