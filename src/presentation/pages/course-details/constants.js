// @ts-check

/**
 * Constantes et configuration pour la page des détails de cours
 */

export const COURSE_DETAILS_MESSAGES = {
  ERRORS: {
    COURSE_NOT_FOUND: 'Cours introuvable',
    NO_STUDENTS_FOR_IMPRO: 'Il faut au moins un élève pour générer une impro',
  },
  CONFIRMATIONS: {
    DELETE_COURSE: 'Supprimer ce cours et tous ses élèves ?',
    DELETE_STUDENT: (studentName) => `Supprimer l'élève "${studentName}" ?`,
  },
  LABELS: {
    BACK_TO_COURSES: '← Retour à la liste des cours',
    GENERATE_IMPRO: '🎭 Générer une impro',
    STUDENTS_TITLE: 'Élèves',
    STUDENT_NAME_PLACEHOLDER: 'Nom de l\'élève',
    EMPTY_STUDENTS_MESSAGE: 'Ajoutez votre premier élève pour ce cours',
  },
};

export const COURSE_DETAILS_TIMEOUTS = {
  SUCCESS_FEEDBACK: 1000,
  ERROR_FEEDBACK: 2000,
};
