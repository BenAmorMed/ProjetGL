package com.upec.gl.examsurveillance.config;

import com.upec.gl.examsurveillance.model.*;
import com.upec.gl.examsurveillance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MatiereRepository matiereRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private HoraireRepository horaireRepository;

    @Autowired
    private EpreuveRepository epreuveRepository;

    @Override
    public void run(String... args) {
        System.out.println("========================================");
        System.out.println("🚀 DataInitializer started");
        System.out.println("========================================");

        // Check if data already exists
        if (enseignantRepository.count() > 0) {
            System.out.println("✅ Data already exists. Skipping initialization.");
            return;
        }

        try {
            // Initialize sample data
            List<Enseignant> users = createUsers();
            List<Room> rooms = createRooms();
            List<Exam> exams = createExams();
            List<Matiere> matieres = createMatieres();
            List<Horaire> horaires = createHoraires();
            List<Seance> seances = createSeances(horaires, matieres);
            createEpreuves(seances, matieres);

            System.out.println("========================================");
            System.out.println("✅ Sample data initialization completed!");
            System.out.println("📊 Created:");
            System.out.println("   - " + users.size() + " users (1 admin + 15 teachers)");
            System.out.println("   - " + rooms.size() + " rooms");
            System.out.println("   - " + exams.size() + " exams");
            System.out.println("   - " + matieres.size() + " matières");
            System.out.println("   - " + horaires.size() + " horaires");
            System.out.println("   - " + seances.size() + " séances");
            System.out.println("========================================");
            System.out.println("🔐 Login Credentials:");
            System.out.println("   Admin: username='admin', password='admin123'");
            System.out.println("   Teachers: username='jdupont', password='teacher123'");
            System.out.println("========================================");
        } catch (Exception e) {
            System.err.println("❌ Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private List<Enseignant> createUsers() {
        System.out.println("📝 Creating users...");
        List<Enseignant> users = new ArrayList<>();

        // Password hashes
        String hashedAdminPassword = passwordEncoder.encode("admin123");
        String hashedTeacherPassword = passwordEncoder.encode("teacher123");

        // Create admin user
        Enseignant admin = new Enseignant();
        admin.setUsername("admin");
        admin.setPassword(hashedAdminPassword);
        admin.setEmail("admin@upec.fr");
        admin.setNom("Admin");
        admin.setPrenom("System");
        admin.setChargeEnseignement(0);
        admin.setRole(Role.ADMIN);
        users.add(enseignantRepository.save(admin));

        // Create teacher users with varying workloads
        String[][] teachers = {
                { "jdupont", "jean.dupont@upec.fr", "Dupont", "Jean", "120" },
                { "mmartin", "marie.martin@upec.fr", "Martin", "Marie", "100" },
                { "pbernard", "pierre.bernard@upec.fr", "Bernard", "Pierre", "150" },
                { "sdubois", "sophie.dubois@upec.fr", "Dubois", "Sophie", "80" },
                { "lthomas", "luc.thomas@upec.fr", "Thomas", "Luc", "110" },
                { "arobert", "anne.robert@upec.fr", "Robert", "Anne", "130" },
                { "nrichard", "nicolas.richard@upec.fr", "Richard", "Nicolas", "90" },
                { "cgarcia", "christine.garcia@upec.fr", "Garcia", "Christine", "105" },
                { "fmorel", "francois.morel@upec.fr", "Morel", "François", "95" },
                { "elefevre", "emilie.lefevre@upec.fr", "Lefèvre", "Emilie", "115" },
                { "droux", "david.roux@upec.fr", "Roux", "David", "125" },
                { "ilambert", "isabelle.lambert@upec.fr", "Lambert", "Isabelle", "100" },
                { "vfontaine", "vincent.fontaine@upec.fr", "Fontaine", "Vincent", "140" },
                { "sbonnet", "sandrine.bonnet@upec.fr", "Bonnet", "Sandrine", "85" },
                { "msimon", "marc.simon@upec.fr", "Simon", "Marc", "110" }
        };

        for (String[] teacher : teachers) {
            Enseignant user = new Enseignant();
            user.setUsername(teacher[0]);
            user.setPassword(hashedTeacherPassword);
            user.setEmail(teacher[1]);
            user.setNom(teacher[2]);
            user.setPrenom(teacher[3]);
            user.setChargeEnseignement(Integer.parseInt(teacher[4]));
            user.setRole(Role.TEACHER);
            users.add(enseignantRepository.save(user));
        }

        System.out.println("✅ Created " + users.size() + " users");
        return users;
    }

    private List<Room> createRooms() {
        System.out.println("📝 Creating rooms...");
        List<Room> rooms = new ArrayList<>();

        String[][] roomData = {
                { "Amphi A", "300", "Bâtiment Principal - Niveau 0" },
                { "Amphi B", "250", "Bâtiment Principal - Niveau 0" },
                { "Salle 101", "100", "Bâtiment A - Niveau 1" },
                { "Salle 102", "100", "Bâtiment A - Niveau 1" }
        };

        for (String[] data : roomData) {
            Room room = new Room();
            room.setName(data[0]);
            room.setCapacity(Integer.parseInt(data[1]));
            room.setLocation(data[2]);
            rooms.add(roomRepository.save(room));
        }

        System.out.println("✅ Created " + rooms.size() + " rooms");
        return rooms;
    }

    private List<Exam> createExams() {
        System.out.println("📝 Creating exams...");
        List<Exam> exams = new ArrayList<>();

        exams.add(createExam("Génie Logiciel", "2025-01-06", "08:30", "11:30"));
        exams.add(createExam("Bases de Données", "2025-01-06", "14:00", "17:00"));

        System.out.println("✅ Created " + exams.size() + " exams");
        return exams;
    }

    private Exam createExam(String subject, String date, String startTime, String endTime) {
        Exam exam = new Exam();
        exam.setSubject(subject);
        exam.setDate(LocalDate.parse(date));
        exam.setStartTime(LocalTime.parse(startTime));
        exam.setEndTime(LocalTime.parse(endTime));
        return examRepository.save(exam);
    }

    private List<Matiere> createMatieres() {
        System.out.println("📝 Creating matières...");
        List<Matiere> matieres = new ArrayList<>();

        String[] matiereNames = {
                "Génie Logiciel",
                "Bases de Données",
                "Réseaux",
                "Intelligence Artificielle",
                "Sécurité Informatique",
                "Programmation Web"
        };

        for (String nom : matiereNames) {
            Matiere matiere = new Matiere();
            matiere.setNom(nom);
            matieres.add(matiereRepository.save(matiere));
        }

        System.out.println("✅ Created " + matieres.size() + " matières");
        return matieres;
    }

    private List<Horaire> createHoraires() {
        System.out.println("📝 Creating horaires...");
        List<Horaire> horaires = new ArrayList<>();

        // Les 3 créneaux horaires possibles
        String[][] creneaux = {
                { "08:30", "10:30" },
                { "11:00", "13:00" },
                { "14:30", "16:30" }
        };

        for (String[] creneau : creneaux) {
            Horaire horaire = new Horaire();
            horaire.setHeure(creneau[0]);
            horaire.setHfin(creneau[1]);
            horaires.add(horaireRepository.save(horaire));
        }

        System.out.println("✅ Created " + horaires.size() + " horaires");
        return horaires;
    }

    private List<Seance> createSeances(List<Horaire> horaires, List<Matiere> matieres) {
        System.out.println("📝 Creating séances...");
        List<Seance> seances = new ArrayList<>();

        // Créer 6 séances pour la semaine du 6 au 10 janvier 2025
        LocalDate startDate = LocalDate.of(2025, 1, 6);

        for (int day = 0; day < 3; day++) { // 3 jours
            LocalDate date = startDate.plusDays(day);

            for (int i = 0; i < 2 && i < horaires.size(); i++) { // 2 séances par jour
                Seance seance = new Seance();
                seance.setDate(date);
                seance.setHoraire(horaires.get(i));
                seance.setMatiere(matieres.get((day * 2 + i) % matieres.size()));
                seances.add(seanceRepository.save(seance));
            }
        }

        System.out.println("✅ Created " + seances.size() + " séances");
        return seances;
    }

    private void createEpreuves(List<Seance> seances, List<Matiere> matieres) {
        System.out.println("📝 Creating épreuves...");
        int count = 0;

        // Créer 1-2 épreuves par séance
        for (int i = 0; i < seances.size(); i++) {
            Seance seance = seances.get(i);
            // Première épreuve
            Epreuve epreuve1 = new Epreuve();
            epreuve1.setNom("Examen " + seance.getMatiere().getNom());
            epreuve1.setFiliere("Informatique");
            epreuve1.setClasse("M1");
            epreuve1.setNombrePaquets(2 + (i % 3)); // Entre 2 et 4 paquets
            epreuve1.setSeance(seance);
            epreuve1.setMatiere(seance.getMatiere());
            epreuveRepository.save(epreuve1);
            count++;
        }

        System.out.println("✅ Created " + count + " épreuves");
    }
}
