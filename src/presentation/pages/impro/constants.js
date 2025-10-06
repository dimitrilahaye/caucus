// @ts-check

/**
 * Constantes et configuration pour la page d'impro
 */

export const IMPRO_CONFIG = {
  DEFAULT_PLACES_COUNT: 1,
  MAX_STUDENTS_PER_IMPRO: 50,
  MIN_STUDENTS_PER_IMPRO: 1,
  MAX_PLACES_PER_IMPRO: 10,
  MIN_PLACES_PER_IMPRO: 1,
};

export const IMPRO_MESSAGES = {
  ERRORS: {
    NO_STUDENTS_SELECTED: 'Sélectionnez au moins un élève',
    TOO_MANY_STUDENTS: 'Trop d\'élèves sélectionnés',
    INVALID_PLACES_COUNT: 'Nombre de lieux invalide',
    NO_PLACES_AVAILABLE: 'Aucun lieu disponible',
    NO_CHARACTERS_AVAILABLE: 'Aucun personnage disponible',
    NO_MOODS_AVAILABLE: 'Aucune émotion disponible',
    NOT_ENOUGH_CHARACTERS: 'Pas assez de personnages pour tous les élèves',
    NOT_ENOUGH_PLACES: 'Pas assez de lieux disponibles',
    GENERATION_FAILED: 'Erreur lors de la génération de l\'impro',
    REGENERATION_FAILED: 'Erreur lors de la régénération',
    DELETION_FAILED: 'Erreur lors de la suppression',
  },
  CONFIRMATIONS: {
    DELETE_PLACE: (placeName) => `Supprimer le lieu "${placeName}" de l'impro ?`,
    DELETE_STUDENT: (studentName) => `Supprimer l'élève "${studentName}" de l'impro ?`,
    NAVIGATE_AWAY: 'Vous allez perdre l\'impro générée. Continuer ?',
  },
  SUCCESS: {
    IMPRO_GENERATED: 'Impro générée avec succès',
    ELEMENT_REGENERATED: 'Élément régénéré avec succès',
    ELEMENT_DELETED: 'Élément supprimé avec succès',
  },
  LABELS: {
    STUDENT_SELECTION: 'Sélectionner les élèves',
    PLACES_COUNT: 'Nombre de lieux: ',
    GENERATE_IMPRO: '🎭 Générer une impro',
    SELECT_ALL: 'Tout sélectionner',
    DESELECT_ALL: 'Tout dé-sélectionner',
    PLACES_TITLE: 'Lieux:',
    ASSIGNMENTS_TITLE: 'Attributions:',
    IMPRO_GENERATED_TITLE: 'Impro générée',
  },
};

