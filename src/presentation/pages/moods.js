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
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = m.name;
        nameSpan.className = 'font-medium';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex gap-sm';
        
        const renameInlineForm = document.createElement('form');
        renameInlineForm.className = 'flex gap-xs';
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = m.name;
        renameInput.required = true;
        renameInput.className = 'btn-sm';
        renameInput.style.width = 'auto';
        renameInput.style.minWidth = '120px';
        const renameBtn = document.createElement('button');
        renameBtn.type = 'submit';
        renameBtn.textContent = '✏️';
        renameBtn.className = 'btn-secondary btn-sm';
        renameInlineForm.appendChild(renameInput);
        renameInlineForm.appendChild(renameBtn);

        renameInlineForm.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          const newName = renameInput.value.trim();
          if (!newName) return;
          const changed = await deps.moodsPort.rename(m.id, newName);
          if (changed) {
            refresh();
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

        actionsDiv.appendChild(renameInlineForm);
        actionsDiv.appendChild(deleteBtn);
        
        moodContent.appendChild(nameSpan);
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