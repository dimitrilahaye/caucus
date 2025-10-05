// @ts-check

/**
 * Minimal stub for course details page to be expanded with rename/delete/students CRUD.
 * @param {HTMLElement} root
 * @param {{ id: string }} params
 * @param {{ coursesPort: import('../../core/ports/coursesPort.js').CoursesPort }} deps
 */
export async function renderCourseDetailsPage(root, params, deps) {
  root.innerHTML = '';

  const course = await deps.coursesPort.getById(params.id);
  if (!course) {
    const p = document.createElement('p');
    p.textContent = 'Cours introuvable';
    root.appendChild(p);
    return;
  }

  const title = document.createElement('h2');
  title.textContent = `Cours: ${course.name}`;
  root.appendChild(title);

  // Rename course form
  const renameForm = document.createElement('form');
  renameForm.style.margin = '0 0 1rem 0';
  const renameInput = document.createElement('input');
  renameInput.type = 'text';
  renameInput.placeholder = 'Nouveau nom du cours';
  renameInput.value = course.name;
  renameInput.required = true;
  const renameBtn = document.createElement('button');
  renameBtn.type = 'submit';
  renameBtn.textContent = 'Renommer le cours';
  renameForm.appendChild(renameInput);
  renameForm.appendChild(renameBtn);
  root.appendChild(renameForm);

  const back = document.createElement('a');
  back.href = '#/courses';
  back.textContent = '← Retour aux cours';
  root.appendChild(back);

  const hr = document.createElement('hr');
  root.appendChild(hr);

  // Add student form
  const form = document.createElement('form');
  form.style.margin = '1rem 0';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom';
  input.required = true;
  input.name = 'studentName';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Ajouter un élève';
  form.appendChild(input);
  form.appendChild(submit);
  root.appendChild(form);

  const emptyMsg = document.createElement('p');
  root.appendChild(emptyMsg);

  const list = document.createElement('ul');
  root.appendChild(list);

  async function refreshStudents() {
    const updated = await deps.coursesPort.getById(params.id);
    list.innerHTML = '';
    if (!updated || !updated.students.length) {
      emptyMsg.textContent = 'Ajoutez votre premier élève pour ce cours';
      return;
    }
    emptyMsg.textContent = '';
    for (const s of updated.students) {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = s.name + ' ';
      const renameInlineForm = document.createElement('form');
      renameInlineForm.style.display = 'inline-flex';
      renameInlineForm.style.gap = '0.25rem';
      const renameInput = document.createElement('input');
      renameInput.type = 'text';
      renameInput.value = s.name;
      renameInput.required = true;
      renameInput.size = Math.max(8, s.name.length);
      const renameBtn = document.createElement('button');
      renameBtn.type = 'submit';
      renameBtn.textContent = 'Renommer';
      renameInlineForm.appendChild(renameInput);
      renameInlineForm.appendChild(renameBtn);

      renameInlineForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const newName = renameInput.value.trim();
        if (!newName) return;
        const changed = await deps.coursesPort.renameStudent(params.id, s.id, newName);
        if (changed) {
          refreshStudents();
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Supprimer';
      deleteBtn.style.marginLeft = '0.5rem';
      deleteBtn.addEventListener('click', async () => {
        const confirmed = window.confirm(`Supprimer l'élève "${s.name}" ?`);
        if (!confirmed) return;
        const ok = await deps.coursesPort.removeStudent(params.id, s.id);
        if (ok) refreshStudents();
      });

      li.appendChild(nameSpan);
      li.appendChild(renameInlineForm);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.coursesPort.addStudent(params.id, name);
    input.value = '';
    refreshStudents();
  });

  renameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = renameInput.value.trim();
    if (!newName) return;
    const updated = await deps.coursesPort.rename(params.id, newName);
    if (updated) {
      title.textContent = `Cours: ${updated.name}`;
    }
  });

  refreshStudents();
}


