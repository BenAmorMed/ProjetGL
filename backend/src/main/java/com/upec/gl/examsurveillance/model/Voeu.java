package com.upec.gl.examsurveillance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "voeu", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "enseignant_id", "seance_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voeu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "seance_id", nullable = false)
    private Seance seance;

    @Column(name = "date_expression", nullable = false)
    private LocalDateTime dateExpression;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoeuStatus statut = VoeuStatus.EN_ATTENTE;

    @Column(name = "commentaire")
    private String commentaire;

    @PrePersist
    protected void onCreate() {
        if (dateExpression == null) {
            dateExpression = LocalDateTime.now();
        }
    }
}
