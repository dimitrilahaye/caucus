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

export const IMPRO_CLASSES = {
  CARD: 'card',
  CARD_COMPACT: 'card p-sm',
  BUTTON_PRIMARY: 'btn-primary',
  BUTTON_SECONDARY: 'btn-secondary',
  BUTTON_DANGER: 'btn-danger',
  BUTTON_SMALL: 'btn-sm',
  BUTTON_LARGE: 'btn-lg',
  BUTTON_MATCH_INPUT: 'btn-match-input',
  BUTTON_COMPACT: 'btn-compact',
  TEXT_CENTER: 'text-center',
  TEXT_BASE: 'text-base',
  TEXT_SMALL: 'text-sm',
  TEXT_LARGE: 'text-lg',
  FONT_MEDIUM: 'font-medium',
  FONT_SEMIBOLD: 'font-semibold',
  MARGIN_BOTTOM_SMALL: 'mb-sm',
  MARGIN_BOTTOM_MEDIUM: 'mb-md',
  MARGIN_BOTTOM_LARGE: 'mb-lg',
  MARGIN_BOTTOM_EXTRA_SMALL: 'mb-xs',
  MARGIN_TOP_EXTRA_SMALL: 'mt-xs',
  GAP_SMALL: 'gap-sm',
  GAP_EXTRA_SMALL: 'gap-xs',
  FLEX: 'flex',
  FLEX_COLUMN: 'flex flex-col',
  FLEX_CENTER: 'flex items-center',
  FLEX_BETWEEN: 'flex justify-between',
  FLEX_END: 'flex justify-end',
  INLINE_EDIT_CONTAINER: 'inline-edit-container',
  BUTTON_GROUP: 'btn-group',
  OVERFLOW_SCROLL: 'overflow-y-auto',
  MAX_HEIGHT: 'max-h-48',
  CURSOR_POINTER: 'cursor-pointer',
  WIDTH_AUTO: 'w-auto',
  WIDTH_FULL: 'w-full',
};

export const IMPRO_SELECTORS = {
  RESULTS_SECTION: '.card[style*="display: block"]',
  IMPRO_TITLE: 'h3',
  PLACES_TITLE: 'h4',
  ASSIGNMENTS_TITLE: 'h4:nth-of-type(2)',
};
