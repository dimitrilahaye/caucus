// @ts-check

import { renderCrudListPage } from '../components/crudListPage.js';

/**
 * @param {HTMLElement} root
 * @param {{ charactersUseCase: import('../../core/usecases/charactersUseCase.js').CharactersUseCase }} deps
 */
export function renderCharactersPage(root, deps) {
  renderCrudListPage(root, {
    title: 'Personnages',
    placeholder: 'Nom du personnage',
    emptyMessage: 'Ajoutez votre premier personnage',
    entityName: 'le personnage',
    useCase: deps.charactersUseCase
  });
}