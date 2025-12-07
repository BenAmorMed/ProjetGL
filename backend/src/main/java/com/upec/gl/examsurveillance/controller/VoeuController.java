package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Enseignant;
import com.upec.gl.examsurveillance.model.Voeu;
import com.upec.gl.examsurveillance.repository.EnseignantRepository;
import com.upec.gl.examsurveillance.service.VoeuService;
import com.upec.gl.examsurveillance.service.VoeuService.VoeuStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voeux")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Vœux", description = "Gestion des vœux de surveillance")
public class VoeuController {

    @Autowired
    private VoeuService voeuService;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Operation(summary = "Obtenir mes vœux (enseignant)")
    @GetMapping("/mes-voeux")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<Voeu> getMesVoeux(Authentication authentication) {
        String username = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(username)
                .orElseGet(() -> enseignantRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé")));

        return voeuService.getVoeuxByEnseignant(enseignant.getId());
    }

    @Operation(summary = "Obtenir les vœux d'un enseignant (admin)")
    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Voeu> getVoeuxByEnseignant(@PathVariable @NonNull Long enseignantId) {
        return voeuService.getVoeuxByEnseignant(enseignantId);
    }

    @Operation(summary = "Obtenir les vœux pour une séance (admin)")
    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Voeu> getVoeuxBySeance(@PathVariable @NonNull Long seanceId) {
        return voeuService.getVoeuxBySeance(seanceId);
    }

    @Operation(summary = "Exprimer un vœu")
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> exprimerVoeu(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            Long enseignantId = Long.parseLong(request.get("enseignantId").toString());
            Long seanceId = Long.parseLong(request.get("seanceId").toString());
            String commentaire = request.get("commentaire") != null ? request.get("commentaire").toString() : null;

            Voeu voeu = voeuService.exprimerVoeu(enseignantId, seanceId, commentaire);
            return ResponseEntity.ok(voeu);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Annuler un vœu")
    @DeleteMapping("/{voeuId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> annulerVoeu(
            @PathVariable @NonNull Long voeuId,
            @RequestParam @NonNull Long enseignantId) {
        try {
            voeuService.annulerVoeu(voeuId, enseignantId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Accepter un vœu (admin)")
    @PutMapping("/{voeuId}/accepter")
    @PreAuthorize("hasRole('ADMIN')")
    public Voeu accepterVoeu(@PathVariable @NonNull Long voeuId) {
        return voeuService.accepterVoeu(voeuId);
    }

    @Operation(summary = "Refuser un vœu (admin)")
    @PutMapping("/{voeuId}/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Voeu> refuserVoeu(
            @PathVariable @NonNull Long voeuId,
            @RequestBody Map<String, String> request) {
        String raison = request.get("raison");
        return ResponseEntity.ok(voeuService.refuserVoeu(voeuId, raison));
    }

    @Operation(summary = "Obtenir les statistiques de mes vœux")
    @GetMapping("/stats/{enseignantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public VoeuStats getVoeuStats(@PathVariable @NonNull Long enseignantId) {
        return voeuService.getVoeuStats(enseignantId);
    }
}
