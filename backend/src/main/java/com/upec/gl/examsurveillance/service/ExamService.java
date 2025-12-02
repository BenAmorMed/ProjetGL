package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Exam;
import com.upec.gl.examsurveillance.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;

    @Autowired
    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam createExam(@NonNull Exam exam) {
        return examRepository.save(exam);
    }

    public void deleteExam(@NonNull Long id) {
        examRepository.deleteById(id);
    }
}
