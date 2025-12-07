package com.upec.gl.examsurveillance.model;

public enum VoeuStatus {
    EN_ATTENTE, // Vœu exprimé, en attente de validation
    ACCEPTE, // Vœu accepté/assigné
    REFUSE, // Vœu refusé (séance saturée ou conflit)
    ANNULE // Vœu annulé par l'enseignant
}
