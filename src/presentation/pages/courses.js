// @ts-check

/** @typedef {import('../../core/entities/course.js').Course} Course */

/**
 * @param {HTMLElement} root
 * @param {{ coursesPort: import('../../core/ports/coursesPort.js').CoursesPort }} deps
 */
export function renderCoursesPage(root, deps) {
  root.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Cours';
  root.appendChild(title);

  const form = document.createElement('form');
  form.style.marginBottom = '1rem';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du cours';
  input.required = true;
  input.name = 'courseName';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  // Match action button sizing used elsewhere
  btn.style.backgroundColor = '#e5e7eb';
  btn.style.color = '#111827';
  btn.style.border = 'none';
  btn.style.borderRadius = '0.375rem';
  btn.style.padding = '0.25rem 0.5rem';
  form.appendChild(input);
  form.appendChild(btn);
  root.appendChild(form);

  const message = document.createElement('p');
  root.appendChild(message);

  const list = document.createElement('ul');
  root.appendChild(list);

  async function refresh() {
    const courses = await deps.coursesPort.list();
    list.innerHTML = '';
    if (!courses.length) {
      message.textContent = 'Créez votre premier cours';
    } else {
      message.textContent = '';
    }
    for (const c of courses) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#/courses/${encodeURIComponent(c.id)}`;
      a.textContent = c.name;
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    await deps.coursesPort.create(name);
    input.value = '';
    refresh();
  });

  refresh();
}


