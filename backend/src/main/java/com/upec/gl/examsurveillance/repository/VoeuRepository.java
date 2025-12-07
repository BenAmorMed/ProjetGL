package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Voeu;
import com.upec.gl.examsurveillance.model.VoeuStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoeuRepository extends JpaRepository<Voeu, Long> {

    List<Voeu> findByEnseignantId(Long enseignantId);

    List<Voeu> findBySeanceId(Long seanceId);

    List<Voeu> findByStatut(VoeuStatus statut);

    Optional<Voeu> findByEnseignantIdAndSeanceId(Long enseignantId, Long seanceId);

    // Compte le nombre de vœux pour une séance (pour vérifier saturation)
    @Query("SELECT COUNT(v) FROM Voeu v WHERE v.seance.id = :seanceId AND v.statut IN ('EN_ATTENTE', 'ACCEPTE')")
    Long countActiveVoeuxBySeanceId(@Param("seanceId") Long seanceId);

    // Trouve tous les vœux d'un enseignant avec leurs séances
    @Query("SELECT v FROM Voeu v JOIN FETCH v.seance s JOIN FETCH s.horaire WHERE v.enseignant.id = :enseignantId")
    List<Voeu> findByEnseignantIdWithSeance(@Param("enseignantId") Long enseignantId);
}
