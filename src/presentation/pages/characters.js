// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ charactersPort: import('../../core/ports/charactersPort.js').CharactersPort }} deps
 */
export function renderCharactersPage(root, deps) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = 'Personnages';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du personnage';
  input.required = true;
  input.name = 'characterName';
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
    const characters = await deps.charactersPort.list();
    list.innerHTML = '';
    if (!characters.length) {
      emptyMsg.textContent = 'Ajoutez votre premier personnage';
    } else {
      emptyMsg.textContent = '';
      for (const c of characters) {
        const characterCard = document.createElement('div');
        characterCard.className = 'card';
        
        const characterContent = document.createElement('div');
        characterContent.className = 'flex justify-between items-center';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = c.name;
        nameSpan.className = 'font-medium';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex gap-sm';
        
        const renameInlineForm = document.createElement('form');
        renameInlineForm.className = 'flex gap-xs';
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = c.name;
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
          const changed = await deps.charactersPort.rename(c.id, newName);
          if (changed) {
            refresh();
          }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'btn-danger btn-sm';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer le personnage "${c.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.charactersPort.remove(c.id);
          if (ok) refresh();
        });

        actionsDiv.appendChild(renameInlineForm);
        actionsDiv.appendChild(deleteBtn);
        
        characterContent.appendChild(nameSpan);
        characterContent.appendChild(actionsDiv);
        
        characterCard.appendChild(characterContent);
        list.appendChild(characterCard);
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.charactersPort.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}