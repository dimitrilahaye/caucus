// @ts-check

/**
 * Constantes et configuration pour la page des cours
 */

export const COURSES_CONFIG = {
  MAX_COURSE_NAME_LENGTH: 100,
  MIN_COURSE_NAME_LENGTH: 1,
};

export const COURSES_MESSAGES = {
  ERRORS: {
    COURSE_NAME_REQUIRED: 'Le nom du cours est requis',
    COURSE_NAME_TOO_LONG: 'Le nom du cours est trop long',
    COURSE_NAME_TOO_SHORT: 'Le nom du cours est trop court',
    CREATION_FAILED: 'Erreur lors de la création du cours',
    LOADING_FAILED: 'Erreur lors du chargement des cours',
  },
  SUCCESS: {
    COURSE_CREATED: 'Cours créé avec succès',
  },
  LABELS: {
    PAGE_TITLE: 'Cours',
    COURSE_NAME_PLACEHOLDER: 'Nom du cours',
    CREATE_BUTTON: '+',
    NO_COURSES_MESSAGE: 'Créez votre premier cours',
  },
};
