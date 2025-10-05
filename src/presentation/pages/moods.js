// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ moodsPort: import('../../core/ports/moodsPort.js').MoodsPort }} deps
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
  btn.className = 'btn-secondary btn-sm';
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
    const moods = await deps.moodsPort.list();
    list.innerHTML = '';
    if (!moods.length) {
      emptyMsg.textContent = 'Ajoutez votre première émotion';
    } else {
      emptyMsg.textContent = '';
      for (const m of moods) {
        const moodCard = document.createElement('div');
        moodCard.className = 'card';
        
        const moodContent = document.createElement('div');
        moodContent.className = 'flex justify-between items-center';
        
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = m.name;
        renameInput.required = true;
        renameInput.className = 'btn-sm';
        renameInput.style.width = 'auto';
        renameInput.style.minWidth = '120px';

        const renameBtn = document.createElement('button');
        renameBtn.type = 'button';
        renameBtn.textContent = '✏️';
        renameBtn.className = 'btn-secondary btn-sm';
        renameBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const newName = renameInput.value.trim();
          if (!newName) return;
          
          // Feedback visuel pendant la sauvegarde
          const originalText = renameBtn.textContent;
          renameBtn.textContent = '⏳';
          renameBtn.disabled = true;
          
          try {
            const changed = await deps.moodsPort.rename(m.id, newName);
            if (changed) {
              // Confirmation de succès
              renameBtn.textContent = '✅';
              setTimeout(() => {
                refresh();
              }, 500);
            } else {
              // Erreur
              renameBtn.textContent = '❌';
              setTimeout(() => {
                renameBtn.textContent = originalText;
                renameBtn.disabled = false;
              }, 1000);
            }
          } catch (error) {
            renameBtn.textContent = '❌';
            setTimeout(() => {
              renameBtn.textContent = originalText;
              renameBtn.disabled = false;
            }, 1000);
          }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'btn-danger btn-sm';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer l'émotion "${m.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.moodsPort.remove(m.id);
          if (ok) refresh();
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex gap-sm';
        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);
        
        moodContent.appendChild(renameInput);
        moodContent.appendChild(actionsDiv);
        
        moodCard.appendChild(moodContent);
        list.appendChild(moodCard);
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.moodsPort.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}