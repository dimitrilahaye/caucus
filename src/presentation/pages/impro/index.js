// @ts-check

import { createStudentSelectionSection, createPlacesCountSection, createPlacesList, createAssignmentsList } from './sections.js';
import { createStudentToggleHandler, createSelectAllHandler, createPlacesCountHandler, createGenerateHandler, createPlaceRegenerateHandler, createPlaceDeleteHandler, createCharacterRegenerateHandler, createMoodRegenerateHandler, createStudentDeleteHandler } from './handlers.js';
import { IMPRO_CONFIG, IMPRO_MESSAGES } from './constants.js';
import { createStudentCard } from './utils.js';

/**
 * @param {{ root: HTMLElement, params: { courseId: string }, deps: {
 *   coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase,
 *   placesUseCase: import('../../../core/usecases/placesUseCase.js').PlacesUseCase,
 *   moodsUseCase: import('../../../core/usecases/moodsUseCase.js').MoodsUseCase,
 *   charactersUseCase: import('../../../core/usecases/charactersUseCase.js').CharactersUseCase,
 *   improGenerationUseCase: import('../../../core/usecases/generateImpro.js').ImproGenerationUseCase
 * } }} params
 */
export async function renderImproPage({ root, params, deps }) {
  root.innerHTML = '';

  const course = await deps.coursesUseCase.getById(params.courseId);
  if (!course) {
    const errorCard = document.createElement('div');
    errorCard.className = 'card text-center';
    errorCard.innerHTML = '<p class="text-danger">Cours introuvable</p>';
    root.appendChild(errorCard);
    return;
  }

  // État de l'application
  let selectedStudents = new Set();
  let placesCount = IMPRO_CONFIG.DEFAULT_PLACES_COUNT;
  let hasGeneratedImpro = false;
  let impro = null;
  let maxPlaces = 1;

  // Initialisation
  const places = await deps.placesUseCase.list();
  maxPlaces = places.length;

  // Assertion de type pour TypeScript
  /** @type {import('../../../core/entities/course.js').Course} */
  const courseTyped = course;

  const container = document.createElement('div');
  container.className = 'card';
  container.style.position = 'relative';
  container.style.paddingTop = '3rem'; // Espace pour le bouton retour

  // Bouton retour en haut à droite
  const back = document.createElement('a');
  back.href = `#/courses/${params.courseId}`;
  back.textContent = '← Retour au cours';
  back.className = 'btn-secondary btn-xs';
  back.style.position = 'absolute';
  back.style.top = '0.5rem';
  back.style.right = '0.5rem';
  back.style.zIndex = '10';
  back.addEventListener('click', (e) => {
    if (hasGeneratedImpro) {
      const confirmed = window.confirm(IMPRO_MESSAGES.CONFIRMATIONS.NAVIGATE_AWAY);
      if (!confirmed) {
        e.preventDefault();
      }
    }
  });
  container.appendChild(back);

  // Header
  const header = document.createElement('div');
  header.className = 'flex justify-center items-center mb-md';

  const title = document.createElement('h1');
  title.textContent = `Impro : ${courseTyped.name}`;
  title.className = 'mb-0 text-lg';
  header.appendChild(title);
  container.appendChild(header);

  // Wrapper pour createStudentCard avec la nouvelle signature
  const createStudentCardWrapper = (student, isSelected, onToggle) => {
    return createStudentCard({ student, isSelected, onToggle });
  };

  // Fonctions de mise à jour
  function updateUI() {
    // Mise à jour de la section de sélection des élèves
    const studentSection = container.querySelector('.student-selection-section');
    if (studentSection) {
      studentSection.remove();
    }
    
    const newStudentSection = createStudentSelectionSection({
      course: courseTyped,
      selectedStudents,
      onToggle: (studentId) => createStudentToggleHandler({ studentId, selectedStudents, onUpdate: updateUI })(),
      onSelectAll: createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }),
      createStudentCard: createStudentCardWrapper
    });
    newStudentSection.className += ' student-selection-section';
    container.insertBefore(newStudentSection, container.querySelector('.places-section'));
    
    // Mise à jour du bouton de génération
    generateBtn.disabled = selectedStudents.size === 0;
  }

  function updatePlacesCount(newCount) {
    placesCount = newCount;
    const placesSection = container.querySelector('.places-section');
    if (placesSection) {
      placesSection.remove();
    }
    
    const newPlacesSection = createPlacesCountSection({
      placesCount,
      onPlacesCountChange: updatePlacesCount,
      maxPlaces
    });
    newPlacesSection.className += ' places-section';
    container.insertBefore(newPlacesSection, generateBtn);
  }

  // Sections principales
  const studentSection = createStudentSelectionSection({
    course: courseTyped,
    selectedStudents,
    onToggle: (studentId) => createStudentToggleHandler({ studentId, selectedStudents, onUpdate: updateUI })(),
    onSelectAll: createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }),
    createStudentCard: createStudentCardWrapper
  });
  studentSection.className += ' student-selection-section';
  container.appendChild(studentSection);

  const placesSection = createPlacesCountSection({
    placesCount,
    onPlacesCountChange: updatePlacesCount,
    maxPlaces
  });
  placesSection.className += ' places-section';
  container.appendChild(placesSection);

  // Generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = IMPRO_MESSAGES.LABELS.GENERATE_IMPRO;
  generateBtn.className = 'btn-primary btn-lg mb-md';
  generateBtn.disabled = true;
  
  generateBtn.addEventListener('click', async () => {
    // Récupérer la valeur actuelle du nombre de lieux
    const currentPlacesCount = placesCount;
    
    const handler = createGenerateHandler({
      selectedStudents,
      placesCount: currentPlacesCount,
      course: courseTyped,
      deps,
      onImproGenerated: (generatedImpro) => {
        impro = generatedImpro;
        hasGeneratedImpro = true;
        renderResults();
      },
      messages: IMPRO_MESSAGES
    });
    
    await handler();
  });
  
  container.appendChild(generateBtn);

  // Results section
  const resultsSection = document.createElement('div');
  resultsSection.className = 'card';
  resultsSection.style.display = 'none';
  container.appendChild(resultsSection);

  root.appendChild(container);

  // Fonction de rendu des résultats
  function renderResults() {
    if (!impro) return;
    
    resultsSection.style.display = 'block';
    resultsSection.innerHTML = '';
    
    const resultsTitle = document.createElement('h3');
    resultsTitle.textContent = IMPRO_MESSAGES.LABELS.IMPRO_GENERATED_TITLE;
    resultsTitle.className = 'text-center mb-md text-lg';
    resultsSection.appendChild(resultsTitle);
    
    // Section des lieux
    const placesTitle = document.createElement('h4');
    placesTitle.textContent = IMPRO_MESSAGES.LABELS.PLACES_TITLE;
    placesTitle.className = 'mb-sm text-base';
    resultsSection.appendChild(placesTitle);
    
    const placesList = createPlacesList({
      places: impro.places,
      onRegenerate: (index) => createPlaceRegenerateHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })(),
      onDelete: (index) => createPlaceDeleteHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })()
    });
    resultsSection.appendChild(placesList);
    
    // Section des assignments
    const assignmentsTitle = document.createElement('h4');
    assignmentsTitle.textContent = IMPRO_MESSAGES.LABELS.ASSIGNMENTS_TITLE;
    assignmentsTitle.className = 'mb-sm text-base';
    resultsSection.appendChild(assignmentsTitle);
    
    const assignmentsList = createAssignmentsList({
      assignments: impro.assignments,
      onRegenerateCharacter: (index) => createCharacterRegenerateHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })(),
      onRegenerateMood: (index) => createMoodRegenerateHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })(),
      onDeleteStudent: (index) => createStudentDeleteHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })()
    });
    resultsSection.appendChild(assignmentsList);
  }
}