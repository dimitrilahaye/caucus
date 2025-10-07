// @ts-check

import { renderCrudListPage } from '../components/crudListPage/index.js';

/**
 * @param {{ root: HTMLElement, deps: { charactersUseCase: import('../../core/usecases/charactersUseCase.js').CharactersUseCase } }} params
 */
export function renderCharactersPage({ root, deps }) {
  renderCrudListPage({ root, config: {
    title: 'Personnages',
    placeholder: 'Nom du personnage',
    emptyMessage: 'Ajoutez votre premier personnage',
    entityName: 'le personnage',
    useCase: deps.charactersUseCase
  }});
}