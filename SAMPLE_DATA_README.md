# Sample Data Overview - Exam Surveillance Management System

## 📋 **Quick Summary**
This document provides an overview of the sample data available in `sample-data.sql`.

---

## 👥 **Users**

### **Admin Account**
- **Username:** `admin`
- **Password:** `admin123` (hashed in database)
- **Email:** `admin@upec.fr`
- **Role:** ADMIN

### **Teacher Accounts** (All using password: `teacher123`)

| ID | Username     | Email                      | Role    |
|----|-------------|----------------------------|---------|
| 2  | jdupont     | jean.dupont@upec.fr       | TEACHER |
| 3  | mmartin     | marie.martin@upec.fr      | TEACHER |
| 4  | pbernard    | pierre.bernard@upec.fr    | TEACHER |
| 5  | sdubois     | sophie.dubois@upec.fr     | TEACHER |
| 6  | lthomas     | luc.thomas@upec.fr        | TEACHER |
| 7  | arobert     | anne.robert@upec.fr       | TEACHER |
| 8  | nrichard    | nicolas.richard@upec.fr   | TEACHER |
| 9  | cgarcia     | christine.garcia@upec.fr  | TEACHER |
| 10 | fmorel      | francois.morel@upec.fr    | TEACHER |
| 11 | elefevre    | emilie.lefevre@upec.fr    | TEACHER |
| 12 | droux       | david.roux@upec.fr        | TEACHER |
| 13 | ilambert    | isabelle.lambert@upec.fr  | TEACHER |
| 14 | vfontaine   | vincent.fontaine@upec.fr  | TEACHER |
| 15 | sbonnet     | sandrine.bonnet@upec.fr   | TEACHER |
| 16 | msimon      | marc.simon@upec.fr        | TEACHER |

---

## 🏫 **Rooms (26 rooms total)**

### **Amphitheaters (Large capacity: 180-300 seats)**
- Amphi A (300) - Bâtiment Principal
- Amphi B (250) - Bâtiment Principal
- Amphi C (200) - Bâtiment Sciences
- Amphi D (180) - Bâtiment Sciences

### **Large Lecture Halls (75-100 seats)**
- Salle 101, 102, 103 - Bâtiment A, Niveau 1
- Salle 201, 202, 203 - Bâtiment A, Niveau 2

### **Medium Rooms (55-60 seats)**
- Salle B101, B102, B201, B202

### **Small Rooms (35-40 seats)**
- Salle C101, C102, C103, C201, C202, C203

### **Computer Labs (45-50 seats)**
- Labo Info 1, 2, 3, 4

### **TP Rooms (30 seats)**
- Salle TP 1, TP 2

---

## 📚 **Exams (30 exams over 3 weeks)**

### **Week 1: January 6-10, 2025**

**Monday, Jan 6**
- 08:30-11:30: Génie Logiciel
- 14:00-17:00: Bases de Données Avancées

**Tuesday, Jan 7**
- 08:30-11:30: Réseaux et Communication
- 14:00-16:30: Architecture Logicielle

**Wednesday, Jan 8**
- 08:30-11:30: Systèmes Distribués
- 14:00-17:00: Sécurité Informatique

**Thursday, Jan 9**
- 08:30-11:30: Intelligence Artificielle
- 14:00-17:00: Machine Learning

**Friday, Jan 10**
- 08:30-11:30: Développement Web Avancé
- 14:00-16:30: Programmation Mobile

### **Week 2: January 13-17, 2025**

**Monday, Jan 13**
- 08:30-11:30: Algorithmique Avancée
- 14:00-17:00: Théorie des Graphes

**Tuesday, Jan 14**
- 08:30-11:30: Compilation
- 14:00-17:00: Systèmes d'Exploitation

**Wednesday, Jan 15**
- 08:30-11:30: Cloud Computing
- 14:00-16:30: DevOps et CI/CD

**Thursday, Jan 16**
- 08:30-11:30: Big Data Analytics
- 14:00-17:00: Internet des Objets

**Friday, Jan 17**
- 08:30-11:30: Blockchain et Cryptographie
- 14:00-16:30: Gestion de Projet Agile

### **Week 3: January 20-24, 2025**

**Monday, Jan 20**
- 08:30-11:30: Modélisation UML
- 14:00-17:00: Qualité Logicielle

**Tuesday, Jan 21**
- 08:30-11:30: Interface Homme-Machine
- 14:00-16:30: Accessibilité Numérique

**Wednesday, Jan 22**
- 08:30-11:30: Réalité Virtuelle
- 14:00-17:00: Vision par Ordinateur

**Thursday, Jan 23**
- 08:30-11:30: Traitement du Langage Naturel
- 14:00-17:00: Robotique

**Friday, Jan 24**
- 08:30-11:30: Éthique et Droit Numérique
- 14:00-16:30: Management des SI

---

## 📅 **Teacher Availabilities**

Teachers have submitted their availabilities for different time slots:

- **Jean Dupont** - Mostly mornings in Week 1
- **Marie Martin** - Prefers afternoons in Week 1
- **Pierre Bernard** - Full days available (Week 1)
- **Sophie Dubois** - Mixed schedule throughout Week 1
- **François Morel** - Available most of Week 2
- **Emilie Lefèvre** - Week 2 with afternoon preference
- **David Roux** - Week 2 varied schedule
- **Isabelle Lambert** - Most of Week 3
- **Vincent Fontaine** - Week 3 mixed times
- **Sandrine Bonnet** - Week 3 varied
- **Marc Simon** - Scattered availability across all weeks

---

## 📊 **Sample Assignments**

The database includes ~50 sample assignments linking exams to rooms and supervisors. For example:

- **Génie Logiciel** (Jan 6, morning):
  - Amphi A: Jean Dupont
  - Amphi B: Pierre Bernard

- **Bases de Données Avancées** (Jan 6, afternoon):
  - Amphi A: Marie Martin
  - Amphi B: Sophie Dubois

*...and many more assignments across the 3-week exam period*

---

## 🔐 **Password Information**

> **Note:** All passwords in the database are hashed using BCrypt for security.

- **Admin password:** `admin123`
- **All teacher passwords:** `teacher123`

The hashed value stored in the database is:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu
```

---

## 🚀 **How to Use This Data**

1. **Import the SQL file** into your database
2. **Login as admin** to manage the system
3. **Login as a teacher** to view/update availabilities
4. **Test exam assignments** and scheduling features
5. **Verify the system** handles overlapping schedules correctly

---

## 📝 **Notes**

- All dates are set for **January 2025** exam session
- Time slots are realistic university exam times (2.5-3 hours)
- Teacher availabilities align with actual exam schedules
- Room assignments consider capacity requirements
- Data is designed to test various scenarios including:
  - Teachers with limited availability
  - Multiple rooms per exam
  - Overlapping time conflicts
  - Different exam durations
