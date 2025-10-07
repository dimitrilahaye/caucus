// @ts-check

import { renderCrudListPage } from '../components/crudListPage.js';

/**
 * @param {{ root: HTMLElement, deps: { placesUseCase: import('../../core/usecases/placesUseCase.js').PlacesUseCase } }} params
 */
export function renderPlacesPage({ root, deps }) {
  renderCrudListPage({ root, config: {
    title: 'Lieux',
    placeholder: 'Nom du lieu',
    emptyMessage: 'Ajoutez votre premier lieu',
    entityName: 'le lieu',
    useCase: deps.placesUseCase
  }});
}