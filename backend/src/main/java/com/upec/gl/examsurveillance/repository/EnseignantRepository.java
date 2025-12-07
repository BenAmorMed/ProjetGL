package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByUsername(String username);

    Optional<Enseignant> findByEmail(String email);
}
