package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Epreuve;
import com.upec.gl.examsurveillance.model.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpreuveRepository extends JpaRepository<Epreuve, Long> {

    List<Epreuve> findBySeance(Seance seance);

    List<Epreuve> findBySeanceId(Long seanceId);

    List<Epreuve> findByMatiereId(Long matiereId);
}
