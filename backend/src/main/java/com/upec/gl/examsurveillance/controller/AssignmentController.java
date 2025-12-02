package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Assignment;
import com.upec.gl.examsurveillance.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final com.upec.gl.examsurveillance.service.UserService userService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService,
            com.upec.gl.examsurveillance.service.UserService userService) {
        this.assignmentService = assignmentService;
        this.userService = userService;
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @GetMapping("/available")
    public List<Assignment> getAvailableAssignments(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        com.upec.gl.examsurveillance.model.User user = userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return assignmentService.getAvailableAssignments(user.getId());
    }

    @GetMapping("/my-assignments")
    public List<Assignment> getMyAssignments(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        com.upec.gl.examsurveillance.model.User user = userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return assignmentService.getMyAssignments(user.getId());
    }

    @PostMapping("/{id}/claim")
    public org.springframework.http.ResponseEntity<?> claimAssignment(
            @PathVariable @NonNull Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        com.upec.gl.examsurveillance.model.User user = userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Assignment assignment = assignmentService.claimAssignment(id, user.getId());
            return org.springframework.http.ResponseEntity.ok(assignment);
        } catch (RuntimeException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/claim")
    public org.springframework.http.ResponseEntity<?> unclaimAssignment(
            @PathVariable @NonNull Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        com.upec.gl.examsurveillance.model.User user = userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            assignmentService.unclaimAssignment(id, user.getId());
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody @NonNull Assignment assignment) {
        return assignmentService.createAssignment(assignment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate/{examId}")
    public org.springframework.http.ResponseEntity<Void> generateAssignments(@PathVariable @NonNull Long examId) {
        assignmentService.generateAssignments(examId);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
