// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ placesPort: import('../../core/ports/placesPort.js').PlacesPort }} deps
 */
export function renderPlacesPage(root, deps) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = 'Lieux';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du lieu';
  input.required = true;
  input.name = 'placeName';
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
    const places = await deps.placesPort.list();
    list.innerHTML = '';
    if (!places.length) {
      emptyMsg.textContent = 'Ajoutez votre premier lieu';
    } else {
      emptyMsg.textContent = '';
      for (const p of places) {
        const placeCard = document.createElement('div');
        placeCard.className = 'card';
        
        const placeContent = document.createElement('div');
        placeContent.className = 'flex justify-between items-center';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = p.name;
        nameSpan.className = 'font-medium';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex gap-sm';
        
        const renameInlineForm = document.createElement('form');
        renameInlineForm.className = 'flex gap-xs';
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = p.name;
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
          const changed = await deps.placesPort.rename(p.id, newName);
          if (changed) {
            refresh();
          }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'btn-danger btn-sm';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer le lieu "${p.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.placesPort.remove(p.id);
          if (ok) refresh();
        });

        actionsDiv.appendChild(renameInlineForm);
        actionsDiv.appendChild(deleteBtn);
        
        placeContent.appendChild(nameSpan);
        placeContent.appendChild(actionsDiv);
        
        placeCard.appendChild(placeContent);
        list.appendChild(placeCard);
      }
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