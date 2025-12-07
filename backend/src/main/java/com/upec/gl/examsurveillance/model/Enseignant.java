package com.upec.gl.examsurveillance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;
import java.util.Set;

@Entity
@Table(name = "enseignant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NonNull
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(name = "tel")
    private Integer tel;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Keep username for authentication compatibility
    @Column(unique = true)
    private String username;

    // Charge d'enseignement (nombre de séances par semaine)
    @Column(name = "charge_enseignement")
    private Integer chargeEnseignement = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @ManyToMany
    @JoinTable(name = "enseignant_matiere", joinColumns = @JoinColumn(name = "enseignant_id"), inverseJoinColumns = @JoinColumn(name = "matiere_id"))
    private Set<Matiere> matieresEnseignees;
}
