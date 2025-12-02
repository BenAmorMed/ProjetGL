package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Assignment;
import com.upec.gl.examsurveillance.model.AssignmentStatus;
import com.upec.gl.examsurveillance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByExamId(Long examId);

    List<Assignment> findBySupervisorId(Long supervisorId);

    List<Assignment> findBySupervisor(User supervisor);

    List<Assignment> findByAssignmentStatus(AssignmentStatus status);
}
