package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Seance;
import com.upec.gl.examsurveillance.repository.SeanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
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

    public Optional<Seance> getSeanceById(@NonNull Long id) {
        return seanceRepository.findById(id);
    }

    public Seance createSeance(@NonNull Seance seance) {
        return seanceRepository.save(seance);
    }

    public void deleteSeance(@NonNull Long id) {
        seanceRepository.deleteById(id);
    }
}
