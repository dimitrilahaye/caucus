// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ charactersUseCase: import('../../core/usecases/charactersUseCase.js').CharactersUseCase }} deps
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
    const characters = await deps.charactersUseCase.list();
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
        
        const renameInput = document.createElement('input');
        renameInput.type = 'text';
        renameInput.value = c.name;
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
            const changed = await deps.charactersUseCase.rename(c.id, newName);
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
          const confirmed = window.confirm(`Supprimer le personnage "${c.name}" ?`);
          if (!confirmed) return;
          const ok = await deps.charactersUseCase.remove(c.id);
          if (ok) refresh();
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex gap-sm';
        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);
        
        characterContent.appendChild(renameInput);
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
    await deps.charactersUseCase.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}