// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ placesPort: import('../../core/ports/placesPort.js').PlacesPort }} deps
 */
export function renderPlacesPage(root, deps) {
  root.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Lieux';
  root.appendChild(title);

  const form = document.createElement('form');
  form.style.marginBottom = '1rem';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du lieu';
  input.required = true;
  input.name = 'placeName';
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
    const places = await deps.placesPort.list();
    list.innerHTML = '';
    if (!places.length) {
      emptyMsg.textContent = 'Ajoutez votre premier lieu';
      return;
    }
    emptyMsg.textContent = '';
    for (const p of places) {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = p.name + ' ';

      const renameForm = document.createElement('form');
      renameForm.style.display = 'inline-flex';
      renameForm.style.gap = '0.25rem';
      const renameInput = document.createElement('input');
      renameInput.type = 'text';
      renameInput.value = p.name;
      renameInput.required = true;
      renameInput.size = Math.max(8, p.name.length);
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
        const updated = await deps.placesPort.rename(p.id, newName);
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
        const confirmed = window.confirm(`Supprimer le lieu "${p.name}" ?`);
        if (!confirmed) return;
        const ok = await deps.placesPort.remove(p.id);
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
    await deps.placesPort.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}


