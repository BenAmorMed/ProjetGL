package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Assignment;
import com.upec.gl.examsurveillance.service.AssignmentService;
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
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Assignments", description = "Surveillance assignment management endpoints")
public class AssignmentController {

        private final AssignmentService assignmentService;
        private final com.upec.gl.examsurveillance.service.EnseignantService enseignantService;

        @Autowired
        public AssignmentController(AssignmentService assignmentService,
                        com.upec.gl.examsurveillance.service.EnseignantService enseignantService) {
                this.assignmentService = assignmentService;
                this.enseignantService = enseignantService;
        }

        @Operation(summary = "Get all assignments", description = "Retrieve a list of all surveillance assignments")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of assignments")
        })
        @GetMapping
        public List<Assignment> getAllAssignments() {
                return assignmentService.getAllAssignments();
        }

        @Operation(summary = "Get available assignments", description = "Retrieve surveillance assignments available for the authenticated teacher to claim")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved available assignments"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @GetMapping("/available")
        public List<Assignment> getAvailableAssignments(
                        @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
                com.upec.gl.examsurveillance.model.Enseignant enseignant = enseignantService
                                .getEnseignantByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Enseignant not found"));
                return assignmentService.getAvailableAssignments(enseignant.getId());
        }

        @Operation(summary = "Get my assignments", description = "Retrieve surveillance assignments claimed by the authenticated teacher")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved teacher's assignments"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @GetMapping("/my-assignments")
        public List<Assignment> getMyAssignments(
                        @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
                com.upec.gl.examsurveillance.model.Enseignant enseignant = enseignantService
                                .getEnseignantByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Enseignant not found"));
                return assignmentService.getMyAssignments(enseignant.getId());
        }

        @Operation(summary = "Claim an assignment", description = "Claim a surveillance assignment for the authenticated teacher")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Assignment claimed successfully"),
                        @ApiResponse(responseCode = "400", description = "Assignment not available or already claimed"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @PostMapping("/{id}/claim")
        public org.springframework.http.ResponseEntity<?> claimAssignment(
                        @PathVariable @NonNull Long id,
                        @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
                com.upec.gl.examsurveillance.model.Enseignant enseignant = enseignantService
                                .getEnseignantByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Enseignant not found"));

                try {
                        Assignment assignment = assignmentService.claimAssignment(id, enseignant.getId());
                        return org.springframework.http.ResponseEntity.ok(assignment);
                } catch (RuntimeException e) {
                        return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @Operation(summary = "Unclaim an assignment", description = "Release a previously claimed surveillance assignment")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Assignment unclaimed successfully"),
                        @ApiResponse(responseCode = "400", description = "Assignment not found or not claimed by this teacher"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @DeleteMapping("/{id}/claim")
        public org.springframework.http.ResponseEntity<?> unclaimAssignment(
                        @PathVariable @NonNull Long id,
                        @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
                com.upec.gl.examsurveillance.model.Enseignant enseignant = enseignantService
                                .getEnseignantByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Enseignant not found"));

                try {
                        assignmentService.unclaimAssignment(id, enseignant.getId());
                        return org.springframework.http.ResponseEntity.ok().build();
                } catch (RuntimeException e) {
                        return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @Operation(summary = "Create an assignment", description = "Create a new surveillance assignment")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Assignment created successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
        })
        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping
        public Assignment createAssignment(@RequestBody @NonNull Assignment assignment) {
                return assignmentService.createAssignment(assignment);
        }

        @Operation(summary = "Generate assignments for a session", description = "Automatically generate surveillance assignments for a specific exam session")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Assignments generated successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required"),
                        @ApiResponse(responseCode = "404", description = "Exam session not found")
        })
        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping("/generate/{seanceId}")
        public org.springframework.http.ResponseEntity<Void> generateAssignments(@PathVariable @NonNull Long seanceId) {
                assignmentService.generateAssignments(seanceId);
                return org.springframework.http.ResponseEntity.ok().build();
        }
}
