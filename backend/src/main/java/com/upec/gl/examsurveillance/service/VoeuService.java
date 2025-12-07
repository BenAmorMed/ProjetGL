package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.*;
import com.upec.gl.examsurveillance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VoeuService {

    @Autowired
    private VoeuRepository voeuRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private SeanceRepository seanceRepository;

    @Autowired
    private SurveillanceCalculService surveillanceCalculService;

    /**
     * Exprime un vœu pour une séance
     */
    public Voeu exprimerVoeu(@NonNull Long enseignantId, @NonNull Long seanceId, String commentaire) {
        // Vérifier que l'enseignant existe
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        // Vérifier que la séance existe
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));

        // Vérifier que l'enseignant n'a pas déjà exprimé un vœu pour cette séance
        Optional<Voeu> existingVoeu = voeuRepository.findByEnseignantIdAndSeanceId(enseignantId, seanceId);
        if (existingVoeu.isPresent()) {
            throw new RuntimeException("Vous avez déjà exprimé un vœu pour cette séance");
        }

        // Vérifier que la séance n'est pas saturée
        if (surveillanceCalculService.isSeanceSaturee(seanceId)) {
            throw new RuntimeException("Cette séance est déjà saturée");
        }

        // Créer le vœu
        Voeu voeu = new Voeu();
        voeu.setEnseignant(enseignant);
        voeu.setSeance(seance);
        voeu.setDateExpression(LocalDateTime.now());
        voeu.setStatut(VoeuStatus.EN_ATTENTE);
        voeu.setCommentaire(commentaire);

        return voeuRepository.save(voeu);
    }

    /**
     * Annule un vœu
     */
    public void annulerVoeu(@NonNull Long voeuId, @NonNull Long enseignantId) {
        Voeu voeu = voeuRepository.findById(voeuId)
                .orElseThrow(() -> new RuntimeException("Vœu introuvable"));

        // Vérifier que c'est bien le vœu de cet enseignant
        if (!voeu.getEnseignant().getId().equals(enseignantId)) {
            throw new RuntimeException("Vous ne pouvez annuler que vos propres vœux");
        }

        // Vérifier que le vœu n'est pas déjà accepté
        if (voeu.getStatut() == VoeuStatus.ACCEPTE) {
            throw new RuntimeException("Impossible d'annuler un vœu déjà accepté");
        }

        voeu.setStatut(VoeuStatus.ANNULE);
        voeuRepository.save(voeu);
    }

    /**
     * Récupère tous les vœux d'un enseignant
     */
    public List<Voeu> getVoeuxByEnseignant(@NonNull Long enseignantId) {
        return voeuRepository.findByEnseignantIdWithSeance(enseignantId);
    }

    /**
     * Récupère tous les vœux pour une séance
     */
    public List<Voeu> getVoeuxBySeance(@NonNull Long seanceId) {
        return voeuRepository.findBySeanceId(seanceId);
    }

    /**
     * Accepte un vœu (pour l'admin)
     */
    public Voeu accepterVoeu(@NonNull Long voeuId) {
        Voeu voeu = voeuRepository.findById(voeuId)
                .orElseThrow(() -> new RuntimeException("Vœu introuvable"));

        voeu.setStatut(VoeuStatus.ACCEPTE);
        return voeuRepository.save(voeu);
    }

    /**
     * Refuse un vœu (pour l'admin)
     */
    public Voeu refuserVoeu(@NonNull Long voeuId, String raison) {
        Voeu voeu = voeuRepository.findById(voeuId)
                .orElseThrow(() -> new RuntimeException("Vœu introuvable"));

        voeu.setStatut(VoeuStatus.REFUSE);
        voeu.setCommentaire(raison);
        return voeuRepository.save(voeu);
    }

    /**
     * Obtient les statistiques des vœux pour un enseignant
     */
    public VoeuStats getVoeuStats(@NonNull Long enseignantId) {
        List<Voeu> voeux = voeuRepository.findByEnseignantId(enseignantId);

        VoeuStats stats = new VoeuStats();
        stats.setTotal(voeux.size());
        stats.setEnAttente((int) voeux.stream().filter(v -> v.getStatut() == VoeuStatus.EN_ATTENTE).count());
        stats.setAcceptes((int) voeux.stream().filter(v -> v.getStatut() == VoeuStatus.ACCEPTE).count());
        stats.setRefuses((int) voeux.stream().filter(v -> v.getStatut() == VoeuStatus.REFUSE).count());
        stats.setAnnules((int) voeux.stream().filter(v -> v.getStatut() == VoeuStatus.ANNULE).count());

        return stats;
    }

    /**
     * DTO pour les statistiques des vœux
     */
    public static class VoeuStats {
        private Integer total;
        private Integer enAttente;
        private Integer acceptes;
        private Integer refuses;
        private Integer annules;

        // Getters et Setters
        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }

        public Integer getEnAttente() {
            return enAttente;
        }

        public void setEnAttente(Integer enAttente) {
            this.enAttente = enAttente;
        }

        public Integer getAcceptes() {
            return acceptes;
        }

        public void setAcceptes(Integer acceptes) {
            this.acceptes = acceptes;
        }

        public Integer getRefuses() {
            return refuses;
        }

        public void setRefuses(Integer refuses) {
            this.refuses = refuses;
        }

        public Integer getAnnules() {
            return annules;
        }

        public void setAnnules(Integer annules) {
            this.annules = annules;
        }
    }
}
