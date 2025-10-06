// @ts-check

import { COURSE_DETAILS_MESSAGES } from './courseDetailsConstants.js';

/**
 * Sections pour la page des détails de cours
 */

/**
 * Crée la section header avec titre éditable et bouton de suppression
 * @param {import('../../../core/entities/course.js').Course} course
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {{ section: HTMLElement, title: HTMLElement, deleteBtn: HTMLElement }}
 */
export function createHeaderSection(course, courseId, coursesUseCase) {
  const header = document.createElement('div');
  header.className = 'flex justify-center items-center mb-lg';

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
  
  const deleteCourseBtn = document.createElement('button');
  deleteCourseBtn.type = 'button';
  deleteCourseBtn.textContent = '🗑️';
  deleteCourseBtn.className = 'btn-danger btn-match-input';
  
  // Les handlers seront attachés dans index.js
  
  titleSection.appendChild(title);
  titleSection.appendChild(deleteCourseBtn);
  header.appendChild(titleSection);

  return { section: header, title, deleteBtn: deleteCourseBtn };
}

/**
 * Crée la section de génération d'impro
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {{ section: HTMLElement, button: HTMLElement }}
 */
export function createImproSection(courseId, coursesUseCase) {
  const improSection = document.createElement('div');
  improSection.className = 'mb-lg';
  
  const generateImproBtn = document.createElement('button');
  generateImproBtn.type = 'button';
  generateImproBtn.textContent = COURSE_DETAILS_MESSAGES.LABELS.GENERATE_IMPRO;
  generateImproBtn.className = 'btn-primary btn-lg rounded';
  
  // Le handler sera attaché dans index.js
  
  improSection.appendChild(generateImproBtn);
  
  return { section: improSection, button: generateImproBtn };
}

/**
 * Crée la section des élèves
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @param {() => Promise<void>} refreshStudents
 * @param {() => Promise<void>} updateGenerateImproButton
 * @returns {{ section: HTMLElement, emptyMsg: HTMLElement, list: HTMLElement, form: HTMLElement, input: HTMLElement }}
 */
export function createStudentsSection(courseId, coursesUseCase, refreshStudents, updateGenerateImproButton) {
  const studentsSection = document.createElement('div');
  studentsSection.className = 'mb-lg';

  const studentsTitle = document.createElement('h3');
  studentsTitle.textContent = COURSE_DETAILS_MESSAGES.LABELS.STUDENTS_TITLE;
  studentsTitle.className = 'mb-md';
  studentsSection.appendChild(studentsTitle);

  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-md';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = COURSE_DETAILS_MESSAGES.LABELS.STUDENT_NAME_PLACEHOLDER;
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

  // Le handler sera attaché dans index.js

  return { section: studentsSection, emptyMsg, list, form, input };
}

/**
 * Crée un élément élève avec édition inline
 * @param {import('../../../core/entities/course.js').Student} student
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @param {() => Promise<void>} refreshStudents
 * @param {() => Promise<void>} updateGenerateImproButton
 * @returns {{ element: HTMLElement, editableName: HTMLElement, deleteBtn: HTMLElement }}
 */
export function createStudentElement(student, courseId, coursesUseCase, refreshStudents, updateGenerateImproButton) {
  const studentCard = document.createElement('div');
  studentCard.className = 'card';
  studentCard.style.padding = '0.5rem 0.75rem';
  studentCard.style.minHeight = 'auto';
  
  const studentContent = document.createElement('div');
  studentContent.className = 'flex items-center justify-between gap-sm';
  
  const editableName = document.createElement('span');
  editableName.textContent = student.name;
  editableName.contentEditable = 'true';
  editableName.className = 'editable-name px-1 py-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
  editableName.style.minHeight = '1.5rem';
  editableName.style.display = 'inline-block';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.textContent = '🗑️';
  deleteBtn.className = 'btn-danger btn-match-input';
  
  // Le handler sera attaché dans index.js
  
  studentContent.appendChild(editableName);
  studentContent.appendChild(deleteBtn);
  
  studentCard.appendChild(studentContent);
  
  return { element: studentCard, editableName, deleteBtn };
}
