package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.service.SurveillanceCalculService;
import com.upec.gl.examsurveillance.service.SurveillanceCalculService.SaturationInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/surveillance")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Surveillance", description = "Calculs et informations de surveillance")
public class SurveillanceController {

    @Autowired
    private SurveillanceCalculService surveillanceCalculService;

    @Operation(summary = "Calculer la capacité de surveillance d'un enseignant", description = "Formule: (charge d'enseignement × 1.5) - nombre de séances de ses matières")
    @GetMapping("/capacity/{enseignantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getCapacity(@PathVariable Long enseignantId) {
        try {
            Integer capacity = surveillanceCalculService.calculateSurveillanceCapacity(enseignantId);

            Map<String, Object> response = new HashMap<>();
            response.put("enseignantId", enseignantId);
            response.put("capaciteDisponible", capacity);
            response.put("description", "Capacité de surveillance disponible");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Calculer le nombre de surveillants requis pour une séance", description = "Formule: Math.ceil(somme des paquets × 1.5)")
    @GetMapping("/required/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getRequiredSupervisors(@PathVariable Long seanceId) {
        try {
            Integer required = surveillanceCalculService.calculateRequiredSupervisors(seanceId);

            Map<String, Object> response = new HashMap<>();
            response.put("seanceId", seanceId);
            response.put("surveillantsRequis", required);
            response.put("description", "Nombre de surveillants nécessaires");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Vérifier si une séance est saturée", description = "Une séance est saturée si vœux actifs >= surveillants requis")
    @GetMapping("/saturee/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, Boolean>> isSeanceSaturee(@PathVariable Long seanceId) {
        try {
            Boolean saturee = surveillanceCalculService.isSeanceSaturee(seanceId);
            return ResponseEntity.ok(Map.of("saturee", saturee));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("saturee", false));
        }
    }

    @Operation(summary = "Obtenir les informations de saturation complètes d'une séance")
    @GetMapping("/saturation-info/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<SaturationInfo> getSaturationInfo(@PathVariable Long seanceId) {
        try {
            SaturationInfo info = surveillanceCalculService.getSaturationInfo(seanceId);
            return ResponseEntity.ok(info);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Obtenir un résumé de toutes les séances avec leur statut de saturation")
    @GetMapping("/resume-seances")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getResumeSeances() {
        // TODO: Implémenter cette fonctionnalité
        return ResponseEntity.ok(Map.of("message",
                "Non implémenté - retourne la liste de toutes les séances avec leurs infos de saturation"));
    }
}
