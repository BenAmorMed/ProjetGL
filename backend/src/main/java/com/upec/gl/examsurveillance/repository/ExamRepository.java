package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByDate(LocalDate date);
}
