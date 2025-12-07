package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
}
