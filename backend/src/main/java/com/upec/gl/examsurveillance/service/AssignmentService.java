package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Assignment;
import com.upec.gl.examsurveillance.model.Enseignant;
import com.upec.gl.examsurveillance.model.Seance;
import com.upec.gl.examsurveillance.repository.AssignmentRepository;
import com.upec.gl.examsurveillance.repository.AvailabilityRepository;
import com.upec.gl.examsurveillance.repository.SeanceRepository;
import com.upec.gl.examsurveillance.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final SeanceRepository seanceRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public AssignmentService(
            AssignmentRepository assignmentRepository,
            AvailabilityRepository availabilityRepository,
            SeanceRepository seanceRepository,
            RoomRepository roomRepository) {
        this.assignmentRepository = assignmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.seanceRepository = seanceRepository;
        this.roomRepository = roomRepository;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public List<Assignment> getMyAssignments(@NonNull Long teacherId) {
        Enseignant teacher = new Enseignant();
        teacher.setId(teacherId);
        return assignmentRepository.findBySupervisor(teacher);
    }

    public List<Assignment> getAvailableAssignments(@NonNull Long teacherId) {
        // Get all assignments that are either AVAILABLE or claimed by this teacher
        List<Assignment> allAssignments = assignmentRepository.findAll();

        // Get teacher's availabilities
        List<com.upec.gl.examsurveillance.model.Availability> availabilities = availabilityRepository
                .findByUserId(teacherId);

        // Filter assignments that match teacher's availability
        return allAssignments.stream()
                .filter(a -> a.getSupervisor() == null || a.getSupervisor().getId().equals(teacherId))
                .filter(a -> isAssignmentWithinAvailability(a, availabilities))
                .collect(java.util.stream.Collectors.toList());
    }

    private boolean isAssignmentWithinAvailability(
            Assignment assignment,
            List<com.upec.gl.examsurveillance.model.Availability> availabilities) {
        // If no availabilities set, show all assignments
        if (availabilities.isEmpty()) {
            return true;
        }

        Seance seance = assignment.getSeance();
        if (seance == null || seance.getHoraire() == null) {
            return false;
        }

        // Check if seance date/time falls within any availability slot
        return availabilities.stream()
                .anyMatch(av -> av.getDate().equals(seance.getDate()));
    }

    public Assignment createAssignment(@NonNull Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Assignment claimAssignment(@NonNull Long assignmentId, @NonNull Long teacherId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (assignment.getSupervisor() != null && !assignment.getSupervisor().getId().equals(teacherId)) {
            throw new RuntimeException("Assignment already claimed by another supervisor");
        }

        Enseignant teacher = new Enseignant();
        teacher.setId(teacherId);

        assignment.setSupervisor(teacher);
        assignment.setAssignmentStatus(com.upec.gl.examsurveillance.model.AssignmentStatus.TEACHER_SELECTED);
        assignment.setClaimedAt(java.time.LocalDateTime.now());

        return assignmentRepository.save(assignment);
    }

    public void unclaimAssignment(@NonNull Long assignmentId, @NonNull Long teacherId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (assignment.getSupervisor() == null || !assignment.getSupervisor().getId().equals(teacherId)) {
            throw new RuntimeException("Assignment not claimed by this teacher");
        }

        assignment.setSupervisor(null);
        assignment.setAssignmentStatus(com.upec.gl.examsurveillance.model.AssignmentStatus.AVAILABLE);
        assignment.setClaimedAt(null);

        assignmentRepository.save(assignment);
    }

    public void generateAssignments(@NonNull Long seanceId) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Seance not found"));

        List<com.upec.gl.examsurveillance.model.Room> rooms = roomRepository.findAll();

        // Create empty assignments for all rooms for this seance
        for (com.upec.gl.examsurveillance.model.Room room : rooms) {
            // Check if assignment already exists
            boolean exists = assignmentRepository.findAll().stream()
                    .anyMatch(a -> a.getSeance().getId().equals(seanceId) && a.getRoom().getId().equals(room.getId()));

            if (!exists) {
                Assignment assignment = new Assignment();
                assignment.setSeance(seance);
                assignment.setRoom(room);
                assignment.setSupervisor(null); // No supervisor initially
                assignment.setAssignmentStatus(com.upec.gl.examsurveillance.model.AssignmentStatus.AVAILABLE);

                assignmentRepository.save(assignment);
            }
        }
    }
}
