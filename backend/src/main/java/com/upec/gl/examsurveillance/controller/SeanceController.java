package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Seance;
import com.upec.gl.examsurveillance.service.SeanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seances")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Seances", description = "Exam session management endpoints")
public class SeanceController {

    private final SeanceService seanceService;

    @Autowired
    public SeanceController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @Operation(summary = "Get all exam sessions", description = "Retrieve a list of all exam sessions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of exam sessions")
    })
    @GetMapping
    public List<Seance> getAllSeances() {
        return seanceService.getAllSeances();
    }

    @Operation(summary = "Create a new exam session", description = "Create a new exam session (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exam session created successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Seance createSeance(@RequestBody @NonNull Seance seance) {
        return seanceService.createSeance(seance);
    }

    @Operation(summary = "Delete an exam session", description = "Delete an exam session by ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exam session deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required"),
            @ApiResponse(responseCode = "404", description = "Exam session not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteSeance(@PathVariable @NonNull Long id) {
        seanceService.deleteSeance(id);
    }
}
