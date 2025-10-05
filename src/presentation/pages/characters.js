// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ charactersPort: import('../../core/ports/charactersPort.js').CharactersPort }} deps
 */
export function renderCharactersPage(root, deps) {
  root.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Personnages';
  root.appendChild(title);

  const form = document.createElement('form');
  form.style.marginBottom = '1rem';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du personnage';
  input.required = true;
  input.name = 'characterName';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  btn.style.backgroundColor = '#e5e7eb';
  btn.style.color = '#111827';
  btn.style.border = 'none';
  btn.style.borderRadius = '0.375rem';
  btn.style.padding = '0.25rem 0.5rem';
  form.appendChild(input);
  form.appendChild(btn);
  root.appendChild(form);

  const emptyMsg = document.createElement('p');
  root.appendChild(emptyMsg);

  const list = document.createElement('ul');
  root.appendChild(list);

  async function refresh() {
    const characters = await deps.charactersPort.list();
    list.innerHTML = '';
    if (!characters.length) {
      emptyMsg.textContent = 'Ajoutez votre premier personnage';
      return;
    }
    emptyMsg.textContent = '';
    for (const c of characters) {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = c.name + ' ';

      const renameForm = document.createElement('form');
      renameForm.style.display = 'inline-flex';
      renameForm.style.gap = '0.25rem';
      const renameInput = document.createElement('input');
      renameInput.type = 'text';
      renameInput.value = c.name;
      renameInput.required = true;
      renameInput.size = Math.max(8, c.name.length);
      const renameBtn = document.createElement('button');
      renameBtn.type = 'submit';
      renameBtn.textContent = '✏️';
      renameBtn.style.backgroundColor = '#e5e7eb';
      renameBtn.style.color = '#111827';
      renameBtn.style.border = 'none';
      renameBtn.style.borderRadius = '0.375rem';
      renameBtn.style.padding = '0.25rem 0.5rem';
      renameForm.appendChild(renameInput);
      renameForm.appendChild(renameBtn);

      renameForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const newName = renameInput.value.trim();
        if (!newName) return;
        const updated = await deps.charactersPort.rename(c.id, newName);
        if (updated) refresh();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = '🗑️';
      deleteBtn.style.marginLeft = '0.5rem';
      deleteBtn.style.backgroundColor = '#dc2626';
      deleteBtn.style.color = '#fff';
      deleteBtn.style.border = 'none';
      deleteBtn.style.borderRadius = '0.375rem';
      deleteBtn.style.padding = '0.25rem 0.5rem';
      deleteBtn.addEventListener('click', async () => {
        const confirmed = window.confirm(`Supprimer le personnage "${c.name}" ?`);
        if (!confirmed) return;
        const ok = await deps.charactersPort.remove(c.id);
        if (ok) refresh();
      });

      li.appendChild(nameSpan);
      li.appendChild(renameForm);
      li.appendChild(deleteBtn);
      list.appendChild(li);
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


