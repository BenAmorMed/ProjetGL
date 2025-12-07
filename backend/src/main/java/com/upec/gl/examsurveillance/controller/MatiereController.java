package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Matiere;
import com.upec.gl.examsurveillance.repository.MatiereRepository;
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
@RequestMapping("/api/matieres")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Matieres", description = "Subject/Course management endpoints")
public class MatiereController {

    private final MatiereRepository matiereRepository;

    @Autowired
    public MatiereController(MatiereRepository matiereRepository) {
        this.matiereRepository = matiereRepository;
    }

    @Operation(summary = "Get all subjects", description = "Retrieve a list of all subjects/courses")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of subjects")
    })
    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereRepository.findAll();
    }

    @Operation(summary = "Create a new subject", description = "Create a new subject/course (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subject created successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Matiere createMatiere(@RequestBody @NonNull Matiere matiere) {
        return matiereRepository.save(matiere);
    }

    @Operation(summary = "Delete a subject", description = "Delete a subject/course by ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subject deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required"),
            @ApiResponse(responseCode = "404", description = "Subject not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteMatiere(@PathVariable @NonNull Long id) {
        matiereRepository.deleteById(id);
    }
}
