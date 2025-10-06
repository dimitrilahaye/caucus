// @ts-check

import { renderCrudListPage } from '../components/crudListPage.js';

/**
 * @param {HTMLElement} root
 * @param {{ moodsUseCase: import('../../core/usecases/moodsUseCase.js').MoodsUseCase }} deps
 */
export function renderMoodsPage(root, deps) {
  renderCrudListPage(root, {
    title: 'Émotions',
    placeholder: 'Nom de l\'émotion',
    emptyMessage: 'Ajoutez votre première émotion',
    entityName: 'l\'émotion',
    useCase: deps.moodsUseCase
  });
}