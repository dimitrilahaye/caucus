// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ placesUseCase: import('../../core/usecases/placesUseCase.js').PlacesUseCase }} deps
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
    const places = await deps.placesUseCase.list();
    list.innerHTML = '';
    if (!places.length) {
      emptyMsg.textContent = 'Ajoutez votre premier lieu';
    } else {
      emptyMsg.textContent = '';
      for (const p of places) {
        const placeCard = document.createElement('div');
        placeCard.className = 'card';
        
        const placeContent = document.createElement('div');
        placeContent.className = 'inline-edit-container';
        
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = p.name;
        renameInput.required = true;
        renameInput.className = 'input-inline';

        const renameBtn = document.createElement('button');
        renameBtn.type = 'button';
        renameBtn.textContent = '✏️';
        renameBtn.className = 'btn-secondary btn-match-input';
        renameBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const newName = renameInput.value.trim();
          if (!newName) return;
          
          // Feedback visuel pendant la sauvegarde
          const originalText = renameBtn.textContent;
          renameBtn.textContent = '⏳';
          renameBtn.disabled = true;
          
          try {
            const changed = await deps.placesUseCase.rename(p.id, newName);
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
        deleteBtn.className = 'btn-danger btn-match-input';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer le lieu "${p.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.placesUseCase.remove(p.id);
          if (ok) refresh();
        });

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.appendChild(renameBtn);
        btnGroup.appendChild(deleteBtn);
        
        placeContent.appendChild(renameInput);
        placeContent.appendChild(btnGroup);
        
        placeCard.appendChild(placeContent);
        list.appendChild(placeCard);
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.placesUseCase.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}