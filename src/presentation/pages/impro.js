// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ courseId: string }} params
 * @param {{
 *   coursesPort: import('../../core/ports/coursesPort.js').CoursesPort,
 *   improGenerationUseCase: import('../../core/usecases/generateImpro.js').ImproGenerationUseCase
 * }} deps
 */
export async function renderImproPage(root, params, deps) {
  root.innerHTML = '';

  const course = await deps.coursesPort.getById(params.courseId);
  if (!course) {
    const p = document.createElement('p');
    p.textContent = 'Cours introuvable';
    root.appendChild(p);
    return;
  }

  const title = document.createElement('h2');
  title.textContent = `Générer une impro - ${course.name}`;
  root.appendChild(title);

  const back = document.createElement('a');
  back.href = `#/courses/${params.courseId}`;
  back.textContent = '← Retour au cours';
  back.addEventListener('click', (e) => {
    if (hasGeneratedImpro) {
      const confirmed = window.confirm('Vous allez perdre l\'impro générée. Continuer ?');
      if (!confirmed) {
        e.preventDefault();
      }
    }
  });
  root.appendChild(back);

  const hr = document.createElement('hr');
  root.appendChild(hr);

  // Student selection
  const studentSection = document.createElement('div');
  studentSection.style.marginBottom = '1rem';
  
  const studentTitle = document.createElement('h3');
  studentTitle.textContent = 'Sélectionner les élèves';
  studentSection.appendChild(studentTitle);

  const selectAllBtn = document.createElement('button');
  selectAllBtn.type = 'button';
  selectAllBtn.textContent = 'Tout sélectionner';
  selectAllBtn.style.marginBottom = '0.5rem';
  studentSection.appendChild(selectAllBtn);

  const studentList = document.createElement('div');
  studentSection.appendChild(studentList);

  root.appendChild(studentSection);

  // Places count
  const placesSection = document.createElement('div');
  placesSection.style.marginBottom = '1rem';
  
  const placesLabel = document.createElement('label');
  placesLabel.textContent = 'Nombre de lieux: ';
  const placesInput = document.createElement('input');
  placesInput.type = 'number';
  placesInput.min = '1';
  placesInput.value = '1';
  placesLabel.appendChild(placesInput);
  placesSection.appendChild(placesLabel);

  root.appendChild(placesSection);

  // Generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = 'Générer une impro';
  generateBtn.style.backgroundColor = '#22c55e';
  generateBtn.style.color = '#052e16';
  generateBtn.style.border = 'none';
  generateBtn.style.borderRadius = '0.5rem';
  generateBtn.style.padding = '0.75rem 1.5rem';
  generateBtn.style.fontWeight = '600';
  generateBtn.style.marginBottom = '1rem';
  root.appendChild(generateBtn);

  // Results section
  const resultsSection = document.createElement('div');
  resultsSection.style.display = 'none';
  root.appendChild(resultsSection);

  let selectedStudents = new Set();
  let hasGeneratedImpro = false;

  function renderStudents() {
    studentList.innerHTML = '';
    course.students.forEach(student => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '0.25rem';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = student.id;
      checkbox.checked = selectedStudents.has(student.id);
      
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedStudents.add(student.id);
        } else {
          selectedStudents.delete(student.id);
        }
      });
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${student.name}`));
      studentList.appendChild(label);
    });
  }

  selectAllBtn.addEventListener('click', () => {
    selectedStudents.clear();
    course.students.forEach(student => selectedStudents.add(student.id));
    renderStudents();
  });

  generateBtn.addEventListener('click', async () => {
    if (selectedStudents.size === 0) {
      alert('Sélectionnez au moins un élève');
      return;
    }

    const studentsToGenerate = course.students.filter(s => selectedStudents.has(s.id));
    const placesCount = parseInt(placesInput.value) || 1;

    try {
      const impro = await deps.improGenerationUseCase.generate(studentsToGenerate, placesCount);
      
      hasGeneratedImpro = true;
      
      // Show results
      resultsSection.style.display = 'block';
      resultsSection.innerHTML = '';

      const resultsTitle = document.createElement('h3');
      resultsTitle.textContent = 'Impro générée';
      resultsSection.appendChild(resultsTitle);

      // Places
      const placesTitle = document.createElement('h4');
      placesTitle.textContent = 'Lieux:';
      resultsSection.appendChild(placesTitle);
      
      const placesList = document.createElement('ul');
      impro.places.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place.name;
        placesList.appendChild(li);
      });
      resultsSection.appendChild(placesList);

      // Assignments
      const assignmentsTitle = document.createElement('h4');
      assignmentsTitle.textContent = 'Attributions:';
      resultsSection.appendChild(assignmentsTitle);

      const assignmentsList = document.createElement('ul');
      impro.assignments.forEach(assignment => {
        const li = document.createElement('li');
        li.textContent = `${assignment.student.name}: ${assignment.character.name} (${assignment.mood.name})`;
        assignmentsList.appendChild(li);
      });
      resultsSection.appendChild(assignmentsList);

    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  });

  renderStudents();
}
