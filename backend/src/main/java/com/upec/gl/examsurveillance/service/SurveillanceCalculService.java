package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.*;
import com.upec.gl.examsurveillance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SurveillanceCalculService {

    @Autowired
    private EpreuveRepository epreuveRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private VoeuRepository voeuRepository;

    /**
     * Calcule la capacité de surveillance d'un enseignant
     * Formule: (chargeEnseignement × 1.5) - nombre de séances de ses matières
     */
    public Integer calculateSurveillanceCapacity(Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        Integer chargeEnseignement = enseignant.getChargeEnseignement() != null
                ? enseignant.getChargeEnseignement()
                : 0;

        // Capacité théorique
        double capaciteTheorique = chargeEnseignement * 1.5;

        // Nombre de séances où cet enseignant enseigne ses matières
        long nbSeancesMatieresEnseignees = countSeancesForEnseignantMatieres(enseignant);

        // Capacité disponible
        int capaciteDisponible = (int) Math.floor(capaciteTheorique - nbSeancesMatieresEnseignees);

        return Math.max(0, capaciteDisponible); // Ne peut pas être négatif
    }

    /**
     * Compte le nombre de séances où l'enseignant enseigne ses matières
     */
    private long countSeancesForEnseignantMatieres(Enseignant enseignant) {
        if (enseignant.getMatieresEnseignees() == null || enseignant.getMatieresEnseignees().isEmpty()) {
            return 0;
        }

        // Compte toutes les épreuves correspondant aux matières de l'enseignant
        long totalSeances = 0;
        for (Matiere matiere : enseignant.getMatieresEnseignees()) {
            List<Epreuve> epreuves = epreuveRepository.findByMatiereId(matiere.getId());
            totalSeances += epreuves.size();
        }

        return totalSeances;
    }

    /**
     * Calcule le nombre de surveillants requis pour une séance
     * Formule: Math.ceil(somme des paquets des épreuves × 1.5)
     */
    public Integer calculateRequiredSupervisors(Long seanceId) {
        List<Epreuve> epreuves = epreuveRepository.findBySeanceId(seanceId);

        if (epreuves.isEmpty()) {
            return 0;
        }

        // Somme des paquets de toutes les épreuves de la séance
        int totalPaquets = epreuves.stream()
                .mapToInt(Epreuve::getNombrePaquets)
                .sum();

        // Nombre de surveillants = somme des paquets × 1.5 (arrondi au supérieur)
        double surveillantsRequis = totalPaquets * 1.5;

        return (int) Math.ceil(surveillantsRequis);
    }

    /**
     * Vérifie si une séance est saturée
     * Une séance est saturée si le nombre de vœux actifs >= surveillants requis
     */
    public boolean isSeanceSaturee(Long seanceId) {
        Integer surveillantsRequis = calculateRequiredSupervisors(seanceId);
        Long voeuxActifs = voeuRepository.countActiveVoeuxBySeanceId(seanceId);

        return voeuxActifs >= surveillantsRequis;
    }

    /**
     * Obtient le statut de saturation d'une séance
     */
    public SaturationInfo getSaturationInfo(Long seanceId) {
        Integer surveillantsRequis = calculateRequiredSupervisors(seanceId);
        Long voeuxActifs = voeuRepository.countActiveVoeuxBySeanceId(seanceId);

        SaturationInfo info = new SaturationInfo();
        info.setSeanceId(seanceId);
        info.setSurvillantsRequis(surveillantsRequis);
        info.setVoeuxExprimes(voeuxActifs.intValue());
        info.setPlacesRestantes(Math.max(0, surveillantsRequis - voeuxActifs.intValue()));
        info.setSaturee(voeuxActifs >= surveillantsRequis);

        return info;
    }

    /**
     * DTO pour les informations de saturation
     */
    public static class SaturationInfo {
        private Long seanceId;
        private Integer surveillantsRequis;
        private Integer voeuxExprimes;
        private Integer placesRestantes;
        private Boolean saturee;

        // Getters et Setters
        public Long getSeanceId() {
            return seanceId;
        }

        public void setSeanceId(Long seanceId) {
            this.seanceId = seanceId;
        }

        public Integer getSurvillantsRequis() {
            return surveillantsRequis;
        }

        public void setSurvillantsRequis(Integer surveillantsRequis) {
            this.surveillantsRequis = surveillantsRequis;
        }

        public Integer getVoeuxExprimes() {
            return voeuxExprimes;
        }

        public void setVoeuxExprimes(Integer voeuxExprimes) {
            this.voeuxExprimes = voeuxExprimes;
        }

        public Integer getPlacesRestantes() {
            return placesRestantes;
        }

        public void setPlacesRestantes(Integer placesRestantes) {
            this.placesRestantes = placesRestantes;
        }

        public Boolean getSaturee() {
            return saturee;
        }

        public void setSaturee(Boolean saturee) {
            this.saturee = saturee;
        }
    }
}
