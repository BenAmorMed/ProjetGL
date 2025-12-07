package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Epreuve;
import com.upec.gl.examsurveillance.repository.EpreuveRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/epreuves")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Épreuves", description = "Gestion des épreuves d'examens")
public class EpreuveController {

    @Autowired
    private EpreuveRepository epreuveRepository;

    @Operation(summary = "Lister toutes les épreuves")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public List<Epreuve> getAllEpreuves() {
        return epreuveRepository.findAll();
    }

    @Operation(summary = "Obtenir une épreuve par ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Epreuve> getEpreuveById(@PathVariable @NonNull Long id) {
        return epreuveRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Lister les épreuves d'une séance")
    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public List<Epreuve> getEpreuvesBySeance(@PathVariable @NonNull Long seanceId) {
        return epreuveRepository.findBySeanceId(seanceId);
    }

    @Operation(summary = "Lister les épreuves d'une matière")
    @GetMapping("/matiere/{matiereId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public List<Epreuve> getEpreuvesByMatiere(@PathVariable @NonNull Long matiereId) {
        return epreuveRepository.findByMatiereId(matiereId);
    }

    @Operation(summary = "Créer une nouvelle épreuve")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Epreuve createEpreuve(@RequestBody @NonNull Epreuve epreuve) {
        return epreuveRepository.save(epreuve);
    }

    @Operation(summary = "Mettre à jour une épreuve")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Epreuve> updateEpreuve(@PathVariable @NonNull Long id,
            @RequestBody @NonNull Epreuve epreuveDetails) {
        return epreuveRepository.findById(id)
                .map(epreuve -> {
                    epreuve.setNom(epreuveDetails.getNom());
                    epreuve.setFiliere(epreuveDetails.getFiliere());
                    epreuve.setClasse(epreuveDetails.getClasse());
                    epreuve.setNombrePaquets(epreuveDetails.getNombrePaquets());
                    epreuve.setSeance(epreuveDetails.getSeance());
                    epreuve.setMatiere(epreuveDetails.getMatiere());
                    return ResponseEntity.ok(epreuveRepository.save(epreuve));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Supprimer une épreuve")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEpreuve(@PathVariable @NonNull Long id) {
        return epreuveRepository.findById(id)
                .map((@NonNull Epreuve epreuve) -> {
                    epreuveRepository.delete(epreuve);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
