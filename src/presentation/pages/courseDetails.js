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

  const back = document.createElement('a');
  back.href = '#/courses';
  back.textContent = '← Retour aux cours';
  root.appendChild(back);
}


