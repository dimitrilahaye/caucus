// @ts-check

import { COURSE_DETAILS_MESSAGES, COURSE_DETAILS_TIMEOUTS } from './constants.js';
import { createHeaderSection, createImproSection, createStudentsSection, createStudentElement } from './sections.js';
import { 
  createTitleFocusHandlerFunction,
  createTitleBlurHandlerFunction,
  createTitleKeydownHandlerFunction,
  createDeleteCourseHandlerFunction,
  createStudentEditHandlerFunction,
  createDeleteStudentHandlerFunction,
  createGenerateImproHandlerFunction,
  createAddStudentHandlerFunction
} from './handlers.js';

/**
 * Page des détails d'un cours avec gestion des élèves et génération d'impro
 * @param {HTMLElement} root
 * @param {{ id: string }} params
 * @param {{ coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase }} deps
 */
export async function renderCourseDetailsPage(root, params, deps) {
  root.innerHTML = '';

  const course = await deps.coursesUseCase.getById(params.id);
  if (!course) {
    const errorCard = document.createElement('div');
    errorCard.className = 'card text-center';
    errorCard.innerHTML = `<p class="text-danger">${COURSE_DETAILS_MESSAGES.ERRORS.COURSE_NOT_FOUND}</p>`;
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
  back.textContent = COURSE_DETAILS_MESSAGES.LABELS.BACK_TO_COURSES;
  back.className = 'btn-secondary btn-xs';
  back.style.position = 'absolute';
  back.style.top = '0.5rem';
  back.style.right = '0.5rem';
  back.style.zIndex = '10';
  container.appendChild(back);

  // Header avec titre éditable
  const { section: header, title, deleteBtn: deleteCourseBtn } = createHeaderSection(course, params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES);
  
  // Attacher les handlers du titre
  const titleFocusHandler = createTitleFocusHandlerFunction(title);
  const titleBlurHandler = createTitleBlurHandlerFunction(title, course, params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES, COURSE_DETAILS_TIMEOUTS);
  const titleKeydownHandler = createTitleKeydownHandlerFunction(title, course);
  
  title.addEventListener('focus', titleFocusHandler);
  title.addEventListener('blur', titleBlurHandler);
  title.addEventListener('keydown', titleKeydownHandler);
  
  // Attacher le handler de suppression du cours
  if (deleteCourseBtn) {
    const deleteCourseHandler = createDeleteCourseHandlerFunction(params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES);
    deleteCourseBtn.addEventListener('click', deleteCourseHandler);
  }
  
  container.appendChild(header);

  // Section génération d'impro
  const { section: improSection, button: generateImproBtn } = createImproSection(params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES);
  
  // Attacher le handler de génération d'impro
  const generateImproHandler = createGenerateImproHandlerFunction(params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES);
  generateImproBtn.addEventListener('click', async (e) => {
    if (/** @type {HTMLButtonElement} */ (generateImproBtn).disabled) {
      e.preventDefault();
      return;
    }
    await generateImproHandler();
  });
  
  async function updateGenerateImproButton() {
    const currentCourse = await deps.coursesUseCase.getById(params.id);
    if (!currentCourse || !currentCourse.students.length) {
      /** @type {HTMLButtonElement} */ (generateImproBtn).disabled = true;
      generateImproBtn.className = 'btn-primary btn-lg rounded';
    } else {
      /** @type {HTMLButtonElement} */ (generateImproBtn).disabled = false;
      generateImproBtn.className = 'btn-primary btn-lg rounded';
    }
  }
  
  await updateGenerateImproButton();
  container.appendChild(improSection);

  // Section des élèves
  const { section: studentsSection, emptyMsg, list, form, input } = createStudentsSection(
    params.id, 
    deps.coursesUseCase, 
    refreshStudents, 
    updateGenerateImproButton,
    COURSE_DETAILS_MESSAGES
  );
  
  // Attacher le handler d'ajout d'élève
  const addStudentHandler = createAddStudentHandlerFunction(input, params.id, deps.coursesUseCase, refreshStudents, updateGenerateImproButton);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addStudentHandler();
  });

  async function refreshStudents() {
    const updated = await deps.coursesUseCase.getById(params.id);
    list.innerHTML = '';
    if (!updated || !updated.students.length) {
      emptyMsg.textContent = COURSE_DETAILS_MESSAGES.LABELS.EMPTY_STUDENTS_MESSAGE;
      return;
    }
    emptyMsg.textContent = '';
    for (const student of updated.students) {
      const { element: studentElement, editableName, deleteBtn } = createStudentElement(
        student, 
        params.id, 
        deps.coursesUseCase, 
        refreshStudents, 
        updateGenerateImproButton
      );
      
      // Attacher les handlers
      createStudentEditHandlerFunction(editableName, student, params.id, deps.coursesUseCase, COURSE_DETAILS_MESSAGES, COURSE_DETAILS_TIMEOUTS);
      const deleteStudentHandler = createDeleteStudentHandlerFunction(student, params.id, deps.coursesUseCase, refreshStudents, updateGenerateImproButton, COURSE_DETAILS_MESSAGES);
      deleteBtn.addEventListener('click', deleteStudentHandler);
      
      list.appendChild(studentElement);
    }
  }

  container.appendChild(studentsSection);
  root.appendChild(container);

  refreshStudents();
}
