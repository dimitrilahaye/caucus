// @ts-check

/** @typedef {import('../../core/entities/course.js').Course} Course */

/**
 * @param {HTMLElement} root
 * @param {{ coursesUseCase: import('../../core/usecases/coursesUseCase.js').CoursesUseCase }} deps
 */
export function renderCoursesPage(root, deps) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = 'Cours';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du cours';
  input.required = true;
  input.name = 'courseName';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  btn.className = 'btn-secondary btn-match-input';
  form.appendChild(input);
  form.appendChild(btn);
  container.appendChild(form);

  const message = document.createElement('p');
  message.className = 'text-center text-muted mb-md';
  container.appendChild(message);

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  container.appendChild(list);

  root.appendChild(container);

  async function refresh() {
    const courses = await deps.coursesUseCase.list();
    list.innerHTML = '';
    if (!courses.length) {
      message.textContent = 'Créez votre premier cours';
    } else {
      message.textContent = '';
      for (const c of courses) {
        const courseCard = document.createElement('a');
        courseCard.href = `#/courses/${encodeURIComponent(c.id)}`;
        courseCard.className = 'card cursor-pointer';
        courseCard.style.display = 'block';
        courseCard.style.textDecoration = 'none';
        courseCard.style.color = 'inherit';
        
        const courseName = document.createElement('div');
        courseName.textContent = c.name;
        courseName.className = 'text-lg font-semibold';
        
        courseCard.appendChild(courseName);
        list.appendChild(courseCard);
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.coursesUseCase.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}


