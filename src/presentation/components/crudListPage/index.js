// @ts-check

import { CRUD_LIST_CONFIG, CRUD_LIST_MESSAGES } from './constants.js';
import { createCrudListPageSection } from './sections.js';
import { 
  createEditableFocusHandler, 
  createEditableBlurHandler, 
  createEditableKeydownHandler
} from './handlers.js';
import { createDeleteButton, createItemCard, createEmptyMessage } from './utils.js';

/**
 * Composant générique pour les pages CRUD avec édition inline
 * @param {{ root: HTMLElement, config: {
 *   title: string,
 *   placeholder: string,
 *   emptyMessage: string,
 *   entityName: string,
 *   useCase: {
 *     list: () => Promise<Array<{id: string, name: string}>>,
 *     create: (params: {name: string}) => Promise<{id: string, name: string}>,
 *     rename: (params: {id: string, newName: string}) => Promise<{id: string, name: string} | undefined>,
 *     remove: (params: {id: string}) => Promise<boolean>
 *   }
 * } }} params
 */
export function renderCrudListPage({ root, config }) {
  root.innerHTML = '';

  // État local
  let items = [];

  /**
   * Crée une carte d'élément avec tous ses gestionnaires
   * @param {{ item: { id: string, name: string } }} params
   * @returns {HTMLElement}
   */
  function createItemCardWithHandlers({ item }) {
    let currentValue = item.name;

    // Créer les éléments d'abord
    const editableElement = document.createElement('span');
    editableElement.textContent = currentValue;
    editableElement.contentEditable = 'true';
    editableElement.className = 'editable-name px-1 py-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
    editableElement.style.minHeight = '1.5rem';
    editableElement.style.display = 'inline-block';

    const deleteButton = createDeleteButton({ 
      onClick: async () => {
        const confirmed = window.confirm(`Supprimer ${config.entityName} "${item.name}" ?`);
        if (!confirmed) return;
        const ok = await config.useCase.remove({ id: item.id });
        if (ok) refresh();
      }
    });

    // Créer les gestionnaires avec les éléments créés
    const focusHandler = createEditableFocusHandler({ editableElement });
    const blurHandler = createEditableBlurHandler({ 
      editableElement, 
      initialValue: currentValue, 
      itemId: item.id, 
      useCase: config.useCase, 
      onSuccess: refresh,
      timeouts: CRUD_LIST_CONFIG,
      colors: CRUD_LIST_MESSAGES.FEEDBACK
    });
    const keydownHandler = createEditableKeydownHandler({ 
      editableElement, 
      initialValue: currentValue 
    });

    // Attacher les gestionnaires
    editableElement.addEventListener('focus', focusHandler);
    editableElement.addEventListener('blur', () => blurHandler(editableElement.textContent.trim()));
    editableElement.addEventListener('keydown', keydownHandler);

    return createItemCard({ item, editableElement, deleteButton });
  }

  /**
   * Rafraîchit la liste des éléments
   */
  async function refresh() {
    items = await config.useCase.list();
    list.innerHTML = '';
    if (!items.length) {
      emptyMsg.textContent = config.emptyMessage;
    } else {
      emptyMsg.textContent = '';
      for (const item of items) {
        const itemCard = createItemCardWithHandlers({ item });
        list.appendChild(itemCard);
      }
    }
  }

  // Créer la section principale
  const { container, form, input, emptyMsg, list } = createCrudListPageSection({
    title: config.title,
    placeholder: config.placeholder,
    emptyMessage: config.emptyMessage,
    onSubmitHandler: async () => {
      const name = input.value.trim();
      if (!name) return;
      await config.useCase.create({ name });
      input.value = '';
      refresh();
    },
    createEmptyMessage: createEmptyMessage
  });

  root.appendChild(container);
  refresh();
}
