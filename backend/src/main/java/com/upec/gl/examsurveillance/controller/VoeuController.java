package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Voeu;
import com.upec.gl.examsurveillance.service.VoeuService;
import com.upec.gl.examsurveillance.service.VoeuService.VoeuStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "Obtenir mes vœux (enseignant)")
    @GetMapping("/mes-voeux")
    @PreAuthorize("hasRole('TEACHER')")
    public List<Voeu> getMesVoeux(Authentication authentication) {
        // Récupérer l'ID de l'enseignant connecté depuis l'authentication
        // Pour simplifier, on suppose que le username est utilisé
        // En production, il faudrait récupérer l'ID depuis le JWT ou la session
        String username = authentication.getName();
        // TODO: Récupérer l'ID de l'enseignant depuis le username
        // Pour l'instant, retourne une liste vide
        return List.of();
    }

    @Operation(summary = "Obtenir les vœux d'un enseignant (admin)")
    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Voeu> getVoeuxByEnseignant(@PathVariable Long enseignantId) {
        return voeuService.getVoeuxByEnseignant(enseignantId);
    }

    @Operation(summary = "Obtenir les vœux pour une séance (admin)")
    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Voeu> getVoeuxBySeance(@PathVariable Long seanceId) {
        return voeuService.getVoeuxBySeance(seanceId);
    }

    @Operation(summary = "Exprimer un vœu")
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
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
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> annulerVoeu(
            @PathVariable Long voeuId,
            @RequestParam Long enseignantId) {
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
    public Voeu accepterVoeu(@PathVariable Long voeuId) {
        return voeuService.accepterVoeu(voeuId);
    }

    @Operation(summary = "Refuser un vœu (admin)")
    @PutMapping("/{voeuId}/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Voeu> refuserVoeu(
            @PathVariable Long voeuId,
            @RequestBody Map<String, String> request) {
        String raison = request.get("raison");
        return ResponseEntity.ok(voeuService.refuserVoeu(voeuId, raison));
    }

    @Operation(summary = "Obtenir les statistiques de mes vœux")
    @GetMapping("/stats/{enseignantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public VoeuStats getVoeuStats(@PathVariable Long enseignantId) {
        return voeuService.getVoeuStats(enseignantId);
    }
}
