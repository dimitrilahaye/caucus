// @ts-check

import { renderCrudListPage } from '../components/crudListPage.js';

/**
 * @param {HTMLElement} root
 * @param {{ placesUseCase: import('../../core/usecases/placesUseCase.js').PlacesUseCase }} deps
 */
export function renderPlacesPage(root, deps) {
  renderCrudListPage(root, {
    title: 'Lieux',
    placeholder: 'Nom du lieu',
    emptyMessage: 'Ajoutez votre premier lieu',
    entityName: 'le lieu',
    useCase: deps.placesUseCase
  });
}