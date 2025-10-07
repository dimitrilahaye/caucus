// @ts-check

/**
 * Crée la section principale du composant CRUD List Page
 * @param {{ title: string, placeholder: string, emptyMessage: string, entityName: string, onSubmitHandler: () => Promise<void>, createItemCard: (item: Object) => HTMLElement, createEmptyMessage: (params: { text: string, className?: string }) => HTMLElement }} params
 * @returns {{ container: HTMLElement, form: HTMLElement, input: HTMLInputElement, emptyMsg: HTMLElement, list: HTMLElement }}
 */
export function createCrudListPageSection({ title, placeholder, emptyMessage, entityName, onSubmitHandler, createItemCard, createEmptyMessage }) {
  const container = document.createElement('div');
  container.className = 'card';

  const titleElement = document.createElement('h1');
  titleElement.textContent = title;
  titleElement.className = 'text-center mb-lg';
  container.appendChild(titleElement);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.required = true;
  input.name = 'itemName';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  btn.className = 'btn-secondary btn-match-input';
  form.appendChild(input);
  form.appendChild(btn);
  container.appendChild(form);

  const emptyMsg = createEmptyMessage({ text: emptyMessage });
  container.appendChild(emptyMsg);

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  container.appendChild(list);

  // Attacher le gestionnaire de soumission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await onSubmitHandler();
  });

  return { container, form, input, emptyMsg, list };
}
