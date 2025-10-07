// @ts-check

import { createStudentSelectionSection, createPlacesCountSection, createPlacesList, createAssignmentsList } from './sections.js';
import { createStudentToggleHandler, createSelectAllHandler, createPlacesCountHandler, createGenerateHandler, createPlaceRegenerateHandler, createPlaceDeleteHandler, createCharacterRegenerateHandler, createMoodRegenerateHandler, createStudentDeleteHandler, createBackClickHandler } from './handlers.js';
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

  const course = await deps.coursesUseCase.getById({ id: params.courseId });
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
  const backClickHandler = createBackClickHandler({ 
    getHasGeneratedImpro: () => hasGeneratedImpro, 
    messages: IMPRO_MESSAGES 
  });
  
  back.addEventListener('click', backClickHandler);
  container.appendChild(back);

  // Header
  const header = document.createElement('div');
  header.className = 'flex justify-center items-center mb-md';

  const title = document.createElement('h1');
  title.textContent = `Impro : ${courseTyped.name}`;
  title.className = 'mb-0 text-lg';
  header.appendChild(title);
  container.appendChild(header);


  // Fonctions de mise à jour
  function updateUI() {
    // Mise à jour de la section de sélection des élèves
    const studentSection = container.querySelector('.student-selection-section');
    if (studentSection) {
      studentSection.remove();
    }
    
    const { section: newStudentSection, selectAllBtn } = createStudentSelectionSection({
      course: courseTyped,
      selectedStudents,
      onToggle: (studentId) => createStudentToggleHandler({ studentId, selectedStudents, onUpdate: updateUI })(),
      onSelectAll: createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }),
      createStudentCard: (student, isSelected, onToggle) => createStudentCard({ student, isSelected, onToggle })
    });
    newStudentSection.className += ' student-selection-section';
    selectAllBtn.addEventListener('click', createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }));
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
    
    const { section: newPlacesSection, decrementBtn, placesInput, incrementBtn } = createPlacesCountSection({
      placesCount,
      onPlacesCountChange: updatePlacesCount,
      maxPlaces
    });
    newPlacesSection.className += ' places-section';
    
    // Attacher les event listeners
    const decrementHandler = () => {
      if (placesCount > 1) {
        updatePlacesCount(placesCount - 1);
      }
    };
    
    const inputHandler = () => {
      const value = parseInt(/** @type {HTMLInputElement} */ (placesInput).value) || 1;
      const clampedValue = Math.max(1, Math.min(maxPlaces, value));
      updatePlacesCount(clampedValue);
    };
    
    const incrementHandler = () => {
      if (placesCount < maxPlaces) {
        updatePlacesCount(placesCount + 1);
      }
    };

    decrementBtn.addEventListener('click', decrementHandler);
    placesInput.addEventListener('input', inputHandler);
    incrementBtn.addEventListener('click', incrementHandler);
    
    container.insertBefore(newPlacesSection, generateBtn);
  }

  // Sections principales
  const { section: studentSection, selectAllBtn: initialSelectAllBtn } = createStudentSelectionSection({
    course: courseTyped,
    selectedStudents,
    onToggle: (studentId) => createStudentToggleHandler({ studentId, selectedStudents, onUpdate: updateUI })(),
    onSelectAll: createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }),
    createStudentCard: (student, isSelected, onToggle) => createStudentCard({ student, isSelected, onToggle })
  });
  studentSection.className += ' student-selection-section';
  initialSelectAllBtn.addEventListener('click', createSelectAllHandler({ course: courseTyped, selectedStudents, onUpdate: updateUI }));
  container.appendChild(studentSection);

  const { section: placesSection, decrementBtn: initialDecrementBtn, placesInput: initialPlacesInput, incrementBtn: initialIncrementBtn } = createPlacesCountSection({
    placesCount,
    onPlacesCountChange: updatePlacesCount,
    maxPlaces
  });
  placesSection.className += ' places-section';
  
  // Attacher les event listeners pour la section initiale
  const initialDecrementHandler = () => {
    if (placesCount > 1) {
      updatePlacesCount(placesCount - 1);
    }
  };
  
  const initialInputHandler = () => {
    const value = parseInt(/** @type {HTMLInputElement} */ (initialPlacesInput).value) || 1;
    const clampedValue = Math.max(1, Math.min(maxPlaces, value));
    updatePlacesCount(clampedValue);
  };
  
  const initialIncrementHandler = () => {
    if (placesCount < maxPlaces) {
      updatePlacesCount(placesCount + 1);
    }
  };

  initialDecrementBtn.addEventListener('click', initialDecrementHandler);
  initialPlacesInput.addEventListener('input', initialInputHandler);
  initialIncrementBtn.addEventListener('click', initialIncrementHandler);
  
  container.appendChild(placesSection);

  // Generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = IMPRO_MESSAGES.LABELS.GENERATE_IMPRO;
  generateBtn.className = 'btn-primary btn-lg mb-md';
  generateBtn.disabled = true;
  
  const generateHandler = createGenerateHandler({
    selectedStudents,
    placesCount,
    course: courseTyped,
    deps,
    onImproGenerated: (generatedImpro) => {
      impro = generatedImpro;
      hasGeneratedImpro = true;
      renderResults();
    },
    messages: IMPRO_MESSAGES
  });

  generateBtn.addEventListener('click', generateHandler);
  
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
    
    const { list: placesList, regenerateButtons, deleteButtons } = createPlacesList({
      places: impro.places,
      onRegenerate: (index) => createPlaceRegenerateHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })(),
      onDelete: (index) => createPlaceDeleteHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })()
    });
    
    // Attacher les event listeners aux boutons
    regenerateButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => createPlaceRegenerateHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })());
    });
    
    deleteButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => createPlaceDeleteHandler({ places: impro.places, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })());
    });
    
    resultsSection.appendChild(placesList);
    
    // Section des assignments
    const assignmentsTitle = document.createElement('h4');
    assignmentsTitle.textContent = IMPRO_MESSAGES.LABELS.ASSIGNMENTS_TITLE;
    assignmentsTitle.className = 'mb-sm text-base';
    resultsSection.appendChild(assignmentsTitle);
    
    const { list: assignmentsList, regenerateCharacterButtons, regenerateMoodButtons, deleteStudentButtons } = createAssignmentsList({
      assignments: impro.assignments,
    });
    
    // Attacher les event listeners aux boutons
    regenerateCharacterButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => createCharacterRegenerateHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })());
    });
    
    regenerateMoodButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => createMoodRegenerateHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })());
    });
    
    deleteStudentButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => createStudentDeleteHandler({ assignments: impro.assignments, index, deps, onUpdate: renderResults, messages: IMPRO_MESSAGES })());
    });
    
    resultsSection.appendChild(assignmentsList);
  }
}