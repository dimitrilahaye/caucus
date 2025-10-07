// @ts-check

/**
 * Use-case pour la suppression d'éléments d'impro
 */

/**
 * @typedef {object} DeletionUseCase
 * @property {(params: {confirmationMessage: string}) => Promise<boolean>} confirmDeletion
 */

/**
 * Crée le use-case de suppression
 * @returns {DeletionUseCase}
 */
export function createDeletionUseCase() {
  return {
    async confirmDeletion({ confirmationMessage }) {
      const confirmed = window.confirm(confirmationMessage);
      return confirmed;
    }
  };
}
