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
      li.textContent = s.name;
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


