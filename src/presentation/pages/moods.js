// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ moodsUseCase: import('../../core/usecases/moodsUseCase.js').MoodsUseCase }} deps
 */
export function renderMoodsPage(root, deps) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = 'Émotions';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom de l\'émotion';
  input.required = true;
  input.name = 'moodName';
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

  async function refresh() {
    const moods = await deps.moodsUseCase.list();
    list.innerHTML = '';
    if (!moods.length) {
      emptyMsg.textContent = 'Ajoutez votre première émotion';
    } else {
      emptyMsg.textContent = '';
      for (const m of moods) {
        const moodCard = document.createElement('div');
        moodCard.className = 'card';
        
        const moodContent = document.createElement('div');
        moodContent.className = 'flex items-center justify-between gap-sm';
        
        // Utiliser contenteditable pour l'édition inline
        const editableName = document.createElement('span');
        editableName.textContent = m.name;
        editableName.contentEditable = 'true';
        editableName.className = 'editable-name px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
        editableName.style.minHeight = '2rem';
        editableName.style.display = 'inline-block';
        
        // Ajouter un padding supplémentaire en mode édition
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
              range.collapse(false); // false = à la fin
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }, 0);
        });
        
        // Gérer la sauvegarde et le style lors de la perte de focus
        editableName.addEventListener('blur', async () => {
          // Restaurer le style normal
          editableName.style.padding = '4px 8px';
          editableName.style.backgroundColor = '';
          editableName.style.border = '';
          
          // Gérer la sauvegarde
          const newName = editableName.textContent.trim();
          if (newName && newName !== m.name) {
            try {
              await deps.moodsUseCase.rename(m.id, newName);
              // Feedback visuel de succès
              editableName.style.backgroundColor = '#d4edda';
              setTimeout(() => {
                editableName.style.backgroundColor = '';
              }, 1000);
            } catch (error) {
              // En cas d'erreur, revenir à l'ancienne valeur
              editableName.textContent = m.name;
              editableName.style.backgroundColor = '#f8d7da';
              setTimeout(() => {
                editableName.style.backgroundColor = '';
              }, 2000);
            }
          } else if (!newName) {
            // Si vide, revenir à l'ancienne valeur
            editableName.textContent = m.name;
          }
        });
        
        editableName.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            editableName.blur(); // Déclenche l'événement blur
          } else if (e.key === 'Escape') {
            e.preventDefault();
            editableName.textContent = m.name;
            editableName.blur();
          }
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'btn-danger btn-match-input';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer l'émotion "${m.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.moodsUseCase.remove(m.id);
          if (ok) refresh();
        });
        
        moodContent.appendChild(editableName);
        moodContent.appendChild(deleteBtn);
        
        moodCard.appendChild(moodContent);
        list.appendChild(moodCard);
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.moodsUseCase.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}