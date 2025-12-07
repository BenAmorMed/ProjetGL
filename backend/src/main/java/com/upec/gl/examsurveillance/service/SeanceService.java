package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Seance;
import com.upec.gl.examsurveillance.repository.SeanceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeanceService {

    private final SeanceRepository seanceRepository;

    @Autowired
    public SeanceService(SeanceRepository seanceRepository) {
        this.seanceRepository = seanceRepository;
    }

    public List<Seance> getAllSeances() {
        return seanceRepository.findAll();
    }

    public Optional<Seance> getSeanceById(Long id) {
        return seanceRepository.findById(java.util.Objects.requireNonNull(id));
    }

    public Seance createSeance(Seance seance) {
        return seanceRepository.save(java.util.Objects.requireNonNull(seance));
    }

    public void deleteSeance(Long id) {
        seanceRepository.deleteById(java.util.Objects.requireNonNull(id));
    }
}
