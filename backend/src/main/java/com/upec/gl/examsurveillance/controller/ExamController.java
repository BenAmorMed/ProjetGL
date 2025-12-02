package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Exam;
import com.upec.gl.examsurveillance.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamController {

    private final ExamService examService;

    @Autowired
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Exam createExam(@RequestBody @NonNull Exam exam) {
        return examService.createExam(exam);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable @NonNull Long id) {
        examService.deleteExam(id);
    }
}
