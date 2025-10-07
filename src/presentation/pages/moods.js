// @ts-check

import { renderCrudListPage } from '../components/crudListPage.js';

/**
 * @param {{ root: HTMLElement, deps: { moodsUseCase: import('../../core/usecases/moodsUseCase.js').MoodsUseCase } }} params
 */
export function renderMoodsPage({ root, deps }) {
  renderCrudListPage({ root, config: {
    title: 'Émotions',
    placeholder: 'Nom de l\'émotion',
    emptyMessage: 'Ajoutez votre première émotion',
    entityName: 'l\'émotion',
    useCase: deps.moodsUseCase
  }});
}