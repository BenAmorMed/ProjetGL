package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Enseignant;
import com.upec.gl.examsurveillance.model.Matiere;
import com.upec.gl.examsurveillance.repository.EnseignantRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/enseignants")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Enseignants", description = "Gestion des enseignants")
public class EnseignantController {

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Operation(summary = "Obtenir mes matières enseignées")
    @GetMapping("/me/matieres")
    @PreAuthorize("hasRole('TEACHER')")
    public Set<Matiere> getMyMatieres(Authentication authentication) {
        String username = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(username)
                .orElseGet(() -> enseignantRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Enseignant non trouvé")));

        return enseignant.getMatieresEnseignees();
    }
}
