package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Assignment;
import com.upec.gl.examsurveillance.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findBySupervisor(Enseignant supervisor);

    List<Assignment> findBySeanceId(Long seanceId);
}
