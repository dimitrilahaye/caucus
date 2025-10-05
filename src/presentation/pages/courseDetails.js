// @ts-check

/**
 * Minimal stub for course details page to be expanded with rename/delete/students CRUD.
 * @param {HTMLElement} root
 * @param {{ id: string }} params
 * @param {{ coursesUseCase: import('../../core/usecases/coursesUseCase.js').CoursesUseCase }} deps
 */
export async function renderCourseDetailsPage(root, params, deps) {
  root.innerHTML = '';

  const course = await deps.coursesUseCase.getById(params.id);
  if (!course) {
    const errorCard = document.createElement('div');
    errorCard.className = 'card text-center';
    errorCard.innerHTML = '<p class="text-danger">Cours introuvable</p>';
    root.appendChild(errorCard);
    return;
  }

  const container = document.createElement('div');
  container.className = 'card';
  container.style.position = 'relative';
  container.style.paddingTop = '3rem'; // Espace pour le bouton retour

  // Bouton retour en haut à droite
  const back = document.createElement('a');
  back.href = '#/courses';
  back.textContent = '← Retour à la liste des cours';
  back.className = 'btn-secondary btn-xs';
  back.style.position = 'absolute';
  back.style.top = '0.5rem';
  back.style.right = '0.5rem';
  back.style.zIndex = '10';
  container.appendChild(back);

  const header = document.createElement('div');
  header.className = 'flex justify-center items-center mb-lg';

  // Titre éditable avec bouton trash
  const titleSection = document.createElement('div');
  titleSection.className = 'flex items-center gap-sm';
  
  const title = document.createElement('h1');
  title.textContent = course.name;
  title.contentEditable = 'true';
  title.className = 'mb-0 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
  title.style.minHeight = '2rem';
  title.style.display = 'inline-flex';
  title.style.alignItems = 'center';
  title.style.marginBottom = '0';
  
  // Ajouter un padding supplémentaire en mode édition
  title.addEventListener('focus', () => {
    title.style.padding = '8px 12px';
    title.style.backgroundColor = '';
    title.style.border = '1px solid #dee2e6';
    
    // Positionner le curseur à la fin du texte
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(title);
        range.collapse(false); // false = à la fin
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  });
  
  // Gérer la sauvegarde et le style lors de la perte de focus
  title.addEventListener('blur', async () => {
    // Restaurer le style normal (padding d'origine)
    title.style.padding = '';
    title.style.backgroundColor = '';
    title.style.border = '';
    
    // Gérer la sauvegarde
    const newName = title.textContent.trim();
    if (newName && newName !== course.name) {
      try {
        await deps.coursesUseCase.rename(params.id, newName);
        course.name = newName; // Mettre à jour l'objet local
        // Feedback visuel de succès
        title.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          title.style.backgroundColor = '';
        }, 1000);
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        title.textContent = course.name;
        title.style.backgroundColor = '#f8d7da';
        setTimeout(() => {
          title.style.backgroundColor = '';
        }, 2000);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      title.textContent = course.name;
    }
  });
  
  title.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      title.blur(); // Déclenche l'événement blur
    } else if (e.key === 'Escape') {
      e.preventDefault();
      title.textContent = course.name;
      title.blur();
    }
  });
  
  const deleteCourseBtn = document.createElement('button');
  deleteCourseBtn.type = 'button';
  deleteCourseBtn.textContent = '🗑️';
  deleteCourseBtn.className = 'btn-danger btn-match-input';
  deleteCourseBtn.addEventListener('click', async () => {
    const confirmed = window.confirm('Supprimer ce cours et tous ses élèves ?');
    if (!confirmed) return;
    const ok = await deps.coursesUseCase.remove(params.id);
    if (ok) {
      location.hash = '#/courses';
    }
  });
  
  titleSection.appendChild(title);
  titleSection.appendChild(deleteCourseBtn);
  header.appendChild(titleSection);

  container.appendChild(header);


  // Generate impro section
  const improSection = document.createElement('div');
  improSection.className = 'mb-lg';
  
  const generateImproBtn = document.createElement('button');
  generateImproBtn.type = 'button';
  generateImproBtn.textContent = '🎭 Générer une impro';
  generateImproBtn.className = 'btn-primary btn-lg rounded';
  
  async function updateGenerateImproButton() {
    const currentCourse = await deps.coursesUseCase.getById(params.id);
    if (!currentCourse || !currentCourse.students.length) {
      generateImproBtn.disabled = true;
      generateImproBtn.className = 'btn-primary btn-lg rounded';
    } else {
      generateImproBtn.disabled = false;
      generateImproBtn.className = 'btn-primary btn-lg rounded';
    }
  }
  
  generateImproBtn.addEventListener('click', async (e) => {
    if (generateImproBtn.disabled) {
      e.preventDefault();
      return;
    }
    const currentCourse = await deps.coursesUseCase.getById(params.id);
    if (!currentCourse || !currentCourse.students.length) {
      e.preventDefault();
      alert('Il faut au moins un élève pour générer une impro');
      return;
    }
    // Rediriger vers la page d'impro
    location.hash = `#/courses/${params.id}/impro`;
  });
  
  await updateGenerateImproButton();
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
  submit.className = 'btn-secondary btn-match-input';
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
    const updated = await deps.coursesUseCase.getById(params.id);
    list.innerHTML = '';
    if (!updated || !updated.students.length) {
      emptyMsg.textContent = 'Ajoutez votre premier élève pour ce cours';
      return;
    }
    emptyMsg.textContent = '';
    for (const s of updated.students) {
      const studentCard = document.createElement('div');
      studentCard.className = 'card';
      studentCard.style.padding = '0.5rem 0.75rem';
      studentCard.style.minHeight = 'auto';
      
      const studentContent = document.createElement('div');
      studentContent.className = 'flex items-center justify-between gap-sm';
      
      // Utiliser contenteditable pour l'édition inline
      const editableName = document.createElement('span');
      editableName.textContent = s.name;
      editableName.contentEditable = 'true';
      editableName.className = 'editable-name px-1 py-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
      editableName.style.minHeight = '1.5rem';
      editableName.style.display = 'inline-block';
      
      // Ajouter un padding supplémentaire en mode édition
      editableName.addEventListener('focus', () => {
        editableName.style.padding = '4px 8px';
        editableName.style.backgroundColor = '';
        editableName.style.border = '1px solid #dee2e6';
        
        // Positionner le curseur à la fin du texte
        setTimeout(() => {
          const range = document.createRange();
          const sel = window.getSelection();
          if (sel) {
            range.selectNodeContents(editableName);
            range.collapse(false); // false = à la fin
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
      });
      
      // Gérer la sauvegarde et le style lors de la perte de focus
      editableName.addEventListener('blur', async () => {
        // Restaurer le style normal (padding d'origine)
        editableName.style.padding = '';
        editableName.style.backgroundColor = '';
        editableName.style.border = '';
        
        // Gérer la sauvegarde
        const newName = editableName.textContent.trim();
        if (newName && newName !== s.name) {
          try {
            await deps.coursesUseCase.renameStudent(params.id, s.id, newName);
            // Feedback visuel de succès
            editableName.style.backgroundColor = '#d4edda';
            setTimeout(() => {
              editableName.style.backgroundColor = '';
            }, 1000);
          } catch (error) {
            // En cas d'erreur, revenir à l'ancienne valeur
            editableName.textContent = s.name;
            editableName.style.backgroundColor = '#f8d7da';
            setTimeout(() => {
              editableName.style.backgroundColor = '';
            }, 2000);
          }
        } else if (!newName) {
          // Si vide, revenir à l'ancienne valeur
          editableName.textContent = s.name;
        }
      });
      
      editableName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          editableName.blur(); // Déclenche l'événement blur
        } else if (e.key === 'Escape') {
          e.preventDefault();
          editableName.textContent = s.name;
          editableName.blur();
        }
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = '🗑️';
      deleteBtn.className = 'btn-danger btn-match-input';
      deleteBtn.addEventListener('click', async () => {
        const confirmed = window.confirm(`Supprimer l'élève "${s.name}" ?`);
        if (!confirmed) return;
        const ok = await deps.coursesUseCase.removeStudent(params.id, s.id);
        if (ok) {
          refreshStudents();
          await updateGenerateImproButton();
        }
      });

      studentContent.appendChild(editableName);
      studentContent.appendChild(deleteBtn);
      
      studentCard.appendChild(studentContent);
      list.appendChild(studentCard);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.coursesUseCase.addStudent(params.id, name);
    input.value = '';
    refreshStudents();
    await updateGenerateImproButton();
  });


  refreshStudents();
}


