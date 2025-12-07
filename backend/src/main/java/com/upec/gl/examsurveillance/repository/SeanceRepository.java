package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Long> {
}
