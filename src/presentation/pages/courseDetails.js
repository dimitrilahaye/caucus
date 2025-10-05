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
    const errorCard = document.createElement('div');
    errorCard.className = 'card text-center';
    errorCard.innerHTML = '<p class="text-danger">Cours introuvable</p>';
    root.appendChild(errorCard);
    return;
  }

  const container = document.createElement('div');
  container.className = 'card';

  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-lg';

  const title = document.createElement('h1');
  title.textContent = course.name;
  title.className = 'mb-0';
  header.appendChild(title);

  const back = document.createElement('a');
  back.href = '#/courses';
  back.textContent = '← Retour aux cours';
  back.className = 'btn-secondary btn-sm';
  header.appendChild(back);

  container.appendChild(header);

  // Course actions section
  const actionsSection = document.createElement('div');
  actionsSection.className = 'mb-lg';

  const actionsRow = document.createElement('div');
  actionsRow.className = 'flex gap-sm mb-md';
  
  const renameForm = document.createElement('form');
  renameForm.className = 'flex gap-sm';
  const renameInput = document.createElement('input');
  renameInput.type = 'text';
  renameInput.placeholder = 'Nouveau nom du cours';
  renameInput.value = course.name;
  renameInput.required = true;
  const renameBtn = document.createElement('button');
  renameBtn.type = 'submit';
  renameBtn.textContent = '✏️';
  renameBtn.className = 'btn-secondary btn-sm';
  renameForm.appendChild(renameInput);
  renameForm.appendChild(renameBtn);

  const deleteCourseBtn = document.createElement('button');
  deleteCourseBtn.type = 'button';
  deleteCourseBtn.textContent = '🗑️';
  deleteCourseBtn.className = 'btn-danger btn-sm';
  deleteCourseBtn.addEventListener('click', async () => {
    const confirmed = window.confirm('Supprimer ce cours et tous ses élèves ?');
    if (!confirmed) return;
    const ok = await deps.coursesPort.remove(params.id);
    if (ok) {
      location.hash = '#/courses';
    }
  });

  actionsRow.appendChild(renameForm);
  actionsRow.appendChild(deleteCourseBtn);
  actionsSection.appendChild(actionsRow);

  container.appendChild(actionsSection);

  // Generate impro section
  const improSection = document.createElement('div');
  improSection.className = 'mb-lg';
  
  const generateImproBtn = document.createElement('a');
  generateImproBtn.href = `#/courses/${params.id}/impro`;
  generateImproBtn.textContent = '🎭 Générer une impro';
  generateImproBtn.className = 'btn-primary btn-lg';
  
  function updateGenerateImproButton() {
    generateImproBtn.addEventListener('click', async (e) => {
      const currentCourse = await deps.coursesPort.getById(params.id);
      if (!currentCourse || !currentCourse.students.length) {
        e.preventDefault();
        alert('Il faut au moins un élève pour générer une impro');
      }
    });
  }
  
  updateGenerateImproButton();
  improSection.appendChild(generateImproBtn);
  
  container.appendChild(improSection);

  // Students section
  const studentsSection = document.createElement('div');
  studentsSection.className = 'mb-lg';

  const studentsTitle = document.createElement('h3');
  studentsTitle.textContent = 'Élèves';
  studentsTitle.className = 'mb-md';
  studentsSection.appendChild(studentsTitle);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-md';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom de l\'élève';
  input.required = true;
  input.name = 'studentName';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = '+';
  submit.className = 'btn-secondary btn-sm';
  form.appendChild(input);
  form.appendChild(submit);
  studentsSection.appendChild(form);

  const emptyMsg = document.createElement('p');
  emptyMsg.className = 'text-center text-muted mb-md';
  studentsSection.appendChild(emptyMsg);

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  studentsSection.appendChild(list);

  container.appendChild(studentsSection);
  root.appendChild(container);

  async function refreshStudents() {
    const updated = await deps.coursesPort.getById(params.id);
    list.innerHTML = '';
    if (!updated || !updated.students.length) {
      emptyMsg.textContent = 'Ajoutez votre premier élève pour ce cours';
      return;
    }
    emptyMsg.textContent = '';
    for (const s of updated.students) {
      const studentCard = document.createElement('div');
      studentCard.className = 'card';
      
      const studentContent = document.createElement('div');
      studentContent.className = 'flex justify-between items-center';
      
      const renameInlineForm = document.createElement('form');
      renameInlineForm.className = 'flex gap-xs';
      const renameInput = document.createElement('input');
      renameInput.type = 'text';
      renameInput.value = s.name;
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

      renameBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const newName = renameInput.value.trim();
        if (!newName) return;
        
        // Feedback visuel pendant la sauvegarde
        const originalText = renameBtn.textContent;
        renameBtn.textContent = '⏳';
        renameBtn.disabled = true;
        
        try {
          const changed = await deps.coursesPort.renameStudent(params.id, s.id, newName);
          if (changed) {
            // Confirmation de succès
            renameBtn.textContent = '✅';
            setTimeout(() => {
              refreshStudents();
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
        const confirmed = window.confirm(`Supprimer l'élève "${s.name}" ?`);
        if (!confirmed) return;
        const ok = await deps.coursesPort.removeStudent(params.id, s.id);
        if (ok) {
          refreshStudents();
          updateGenerateImproButton();
        }
      });

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'flex gap-sm';
      actionsDiv.appendChild(renameBtn);
      actionsDiv.appendChild(deleteBtn);
      
      studentContent.appendChild(renameInput);
      studentContent.appendChild(actionsDiv);
      
      studentCard.appendChild(studentContent);
      list.appendChild(studentCard);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.coursesPort.addStudent(params.id, name);
    input.value = '';
    refreshStudents();
    updateGenerateImproButton();
  });

  renameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = renameInput.value.trim();
    if (!newName) return;
    
    // Feedback visuel pendant la sauvegarde
    const originalText = renameBtn.textContent;
    renameBtn.textContent = '⏳';
    renameBtn.disabled = true;
    
    try {
      const updated = await deps.coursesPort.rename(params.id, newName);
      if (updated) {
        // Confirmation de succès
        renameBtn.textContent = '✅';
        title.textContent = `Cours: ${updated.name}`;
        setTimeout(() => {
          renameBtn.textContent = originalText;
          renameBtn.disabled = false;
        }, 1000);
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

  refreshStudents();
}


