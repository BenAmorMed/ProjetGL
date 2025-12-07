package com.upec.gl.examsurveillance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "epreuve")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Epreuve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String filiere;

    @Column(nullable = false)
    private String classe;

    // Nombre de paquets (groupes d'étudiants) pour cette épreuve
    @Column(name = "nombre_paquets", nullable = false)
    private Integer nombrePaquets = 1;

    @ManyToOne(optional = false)
    @JoinColumn(name = "seance_id", nullable = false)
    private Seance seance;

    @ManyToOne(optional = false)
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;
}
