// @ts-check

/**
 * Composant générique pour les pages CRUD avec édition inline
 * @param {{ root: HTMLElement, config: {
 *   title: string,
 *   placeholder: string,
 *   emptyMessage: string,
 *   entityName: string,
 *   useCase: {
 *     list: () => Promise<Array<{id: string, name: string}>>,
 *     create: (name: string) => Promise<{id: string, name: string}>,
 *     rename: (id: string, name: string) => Promise<{id: string, name: string} | undefined>,
 *     remove: (id: string) => Promise<boolean>
 *   }
 * } }} params
 */
export function renderCrudListPage({ root, config }) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = config.title;
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = config.placeholder;
  input.required = true;
  input.name = 'itemName';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  btn.className = 'btn-secondary btn-match-input';
  form.appendChild(input);
  form.appendChild(btn);
  container.appendChild(form);

  const emptyMsg = document.createElement('p');
  emptyMsg.className = 'text-center text-muted mb-md';
  container.appendChild(emptyMsg);

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  container.appendChild(list);

  root.appendChild(container);

  /**
   * Crée un élément éditable avec contenteditable
   * @param {{ initialValue: string, itemId: string }} params
   * @returns {HTMLElement}
   */
  function createEditableElement({ initialValue, itemId }) {
    const editableName = document.createElement('span');
    editableName.textContent = initialValue;
    editableName.contentEditable = 'true';
    editableName.className = 'editable-name px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
    editableName.style.minHeight = '2rem';
    editableName.style.display = 'inline-block';

    // Gestion du focus
    editableName.addEventListener('focus', () => {
      editableName.style.padding = '8px 12px';
      editableName.style.backgroundColor = '';
      editableName.style.border = '1px solid #dee2e6';
      
      // Positionner le curseur à la fin du texte
      setTimeout(() => {
        const range = document.createRange();
        const sel = window.getSelection();
        if (sel) {
          range.selectNodeContents(editableName);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 0);
    });

    // Gestion du blur
    editableName.addEventListener('blur', async () => {
      // Éviter les appels multiples pendant la sauvegarde
      if (editableName.dataset.saving === 'true') return;
      
      // Ajouter une transition smooth pour les changements de couleur
      editableName.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      
      // Restaurer le style normal
      editableName.style.padding = '4px 8px';
      editableName.style.backgroundColor = '';
      editableName.style.border = '';
      editableName.style.color = '';
      
      // Gérer la sauvegarde
      const newName = editableName.textContent.trim();
      if (newName && newName !== initialValue) {
        try {
          // Marquer comme en cours de sauvegarde
          editableName.dataset.saving = 'true';
          editableName.contentEditable = 'false';
          
          await config.useCase.rename(itemId, newName);
          
          // Mettre à jour la valeur initiale pour les prochaines comparaisons
          initialValue = newName;
          
          // Feedback visuel de succès : fond vert avec texte blanc
          editableName.style.backgroundColor = '#22c55e'; // green-500
          editableName.style.color = 'white';
          editableName.style.padding = '8px 12px'; // Ajouter du padding pendant la transition
          
          setTimeout(() => {
            // Retour à l'état normal avec transition smooth
            editableName.style.backgroundColor = '';
            editableName.style.color = '';
            editableName.style.padding = ''; // Retirer le padding
            
            // Réactiver l'édition après la transition
            editableName.contentEditable = 'true';
            editableName.dataset.saving = 'false';
          }, 500); // 0.5 secondes
          
        } catch (error) {
          // En cas d'erreur, revenir à l'ancienne valeur
          editableName.textContent = initialValue;
          editableName.style.backgroundColor = '#ef4444'; // red-500
          editableName.style.color = 'white';
          
          setTimeout(() => {
            editableName.style.backgroundColor = '';
            editableName.style.color = '';
            
            // Réactiver l'édition après la transition d'erreur
            editableName.contentEditable = 'true';
            editableName.dataset.saving = 'false';
          }, 2000);
        }
      } else if (!newName) {
        // Si vide, revenir à l'ancienne valeur
        editableName.textContent = initialValue;
      }
    });

    // Gestion des touches
    editableName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        editableName.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        editableName.textContent = initialValue;
        editableName.blur();
      }
    });

    return editableName;
  }

  /**
   * Crée un bouton de suppression
   * @param {{ itemName: string, itemId: string }} params
   * @returns {HTMLElement}
   */
  function createDeleteButton({ itemName, itemId }) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn-danger btn-match-input';
    deleteBtn.addEventListener('click', async () => {
      const confirmed = window.confirm(`Supprimer ${config.entityName} "${itemName}" ?`);
      if (!confirmed) return;
      const ok = await config.useCase.remove(itemId);
      if (ok) refresh();
    });
    return deleteBtn;
  }

  /**
   * Rafraîchit la liste des éléments
   */
  async function refresh() {
    const items = await config.useCase.list();
    list.innerHTML = '';
    if (!items.length) {
      emptyMsg.textContent = config.emptyMessage;
    } else {
      emptyMsg.textContent = '';
      for (const item of items) {
        const itemCard = document.createElement('div');
        itemCard.className = 'card';
        
        const itemContent = document.createElement('div');
        itemContent.className = 'flex items-center justify-between gap-sm';
        
        const editableName = createEditableElement({ initialValue: item.name, itemId: item.id });
        const deleteBtn = createDeleteButton({ itemName: item.name, itemId: item.id });
        
        itemContent.appendChild(editableName);
        itemContent.appendChild(deleteBtn);
        
        itemCard.appendChild(itemContent);
        list.appendChild(itemCard);
      }
    }
  }

  // Gestion du formulaire d'ajout
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await config.useCase.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}
