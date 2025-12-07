package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Enseignant;
import com.upec.gl.examsurveillance.repository.EnseignantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    @Autowired
    public EnseignantService(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    public Optional<Enseignant> getEnseignantById(@NonNull Long id) {
        return enseignantRepository.findById(id);
    }

    public Optional<Enseignant> getEnseignantByUsername(String username) {
        return enseignantRepository.findByUsername(username);
    }

    public Optional<Enseignant> getEnseignantByEmail(String email) {
        return enseignantRepository.findByEmail(email);
    }

    public Enseignant createEnseignant(@NonNull Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }

    public void deleteEnseignant(@NonNull Long id) {
        enseignantRepository.deleteById(id);
    }
}
