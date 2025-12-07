package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Exam;
import com.upec.gl.examsurveillance.service.ExamService;
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
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Exams", description = "Exam management endpoints")
public class ExamController {

    private final ExamService examService;

    @Autowired
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @Operation(summary = "Get all exams", description = "Retrieve a list of all exams")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of exams")
    })
    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @Operation(summary = "Create a new exam", description = "Create a new exam (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exam created successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Exam createExam(@RequestBody @NonNull Exam exam) {
        return examService.createExam(exam);
    }

    @Operation(summary = "Delete an exam", description = "Delete an exam by ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exam deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required"),
            @ApiResponse(responseCode = "404", description = "Exam not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable @NonNull Long id) {
        examService.deleteExam(id);
    }
}
