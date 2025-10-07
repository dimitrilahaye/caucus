// @ts-check

/**
 * Sections d'affichage pour la page d'impro
 */

/**
 * Crée la section de sélection des élèves
 * @param {{ course: import('../../../core/entities/course.js').Course, selectedStudents: Set<string>, onToggle: function(string): void, onSelectAll: function(): void, createStudentCard: function(import('../../../core/entities/course.js').Student, boolean, function(string): void): HTMLElement }} params
 * @returns {{ section: HTMLElement, selectAllBtn: HTMLElement }}
 */
export function createStudentSelectionSection({ course, selectedStudents, onToggle, onSelectAll, createStudentCard }) {
  const section = document.createElement('div');
  section.className = 'mb-md';
  
  const title = document.createElement('h3');
  title.textContent = 'Sélectionner les élèves';
  title.className = 'mb-sm text-base';
  section.appendChild(title);

  const selectAllBtn = document.createElement('button');
  selectAllBtn.type = 'button';
  selectAllBtn.textContent = selectedStudents.size === course.students.length && course.students.length > 0 
    ? 'Tout dé-sélectionner' 
    : 'Tout sélectionner';
  selectAllBtn.className = 'btn-secondary btn-sm mb-sm';
  section.appendChild(selectAllBtn);

  const studentList = document.createElement('div');
  studentList.className = 'flex flex-col gap-xs max-h-48 overflow-y-auto';
  
  course.students.forEach(student => {
    const studentCard = createStudentCard(student, selectedStudents.has(student.id), onToggle);
    studentList.appendChild(studentCard);
  });
  
  section.appendChild(studentList);
  return { section, selectAllBtn };
}

/**
 * Crée la section de comptage des lieux
 * @param {{ placesCount: number, onPlacesCountChange: function(number): void, maxPlaces: number }} params
 * @returns {{ section: HTMLElement, decrementBtn: HTMLElement, placesInput: HTMLElement, incrementBtn: HTMLElement }}
 */
export function createPlacesCountSection({ placesCount, onPlacesCountChange, maxPlaces }) {
  const section = document.createElement('div');
  section.className = 'mb-md';
  
  const label = document.createElement('label');
  label.textContent = 'Nombre de lieux: ';
  label.className = 'font-medium mb-xs block text-sm';
  
  const controls = document.createElement('div');
  controls.className = 'flex items-center gap-sm';
  
  const decrementBtn = document.createElement('button');
  decrementBtn.type = 'button';
  decrementBtn.textContent = '-';
  decrementBtn.className = 'btn-secondary btn-match-input';
  decrementBtn.disabled = placesCount <= 1;
  
  const placesInput = document.createElement('input');
  placesInput.type = 'number';
  placesInput.min = '1';
  placesInput.max = maxPlaces.toString();
  placesInput.value = placesCount.toString();
  placesInput.className = 'w-auto text-center';
  placesInput.style.width = '80px';
  
  const incrementBtn = document.createElement('button');
  incrementBtn.type = 'button';
  incrementBtn.textContent = '+';
  incrementBtn.className = 'btn-secondary btn-match-input';
  incrementBtn.disabled = placesCount >= maxPlaces;
  
  controls.appendChild(decrementBtn);
  controls.appendChild(placesInput);
  controls.appendChild(incrementBtn);
  
  label.appendChild(controls);
  section.appendChild(label);
  
  return { section, decrementBtn, placesInput, incrementBtn };
}

/**
 * Crée la liste des lieux générés
 * @param {{ places: Array, onRegenerate: function(number): Promise<void>, onDelete: function(number): Promise<void> }} params
 * @returns {{ list: HTMLElement, regenerateButtons: HTMLElement[], deleteButtons: HTMLElement[] }}
 */
export function createPlacesList({ places, onRegenerate, onDelete }) {
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-xs mb-md';
  
  const regenerateButtons = [];
  const deleteButtons = [];
  
  places.forEach((place, index) => {
    const placeCard = document.createElement('div');
    placeCard.className = 'card p-sm';
    
    const placeContent = document.createElement('div');
    placeContent.className = 'inline-edit-container';
    
    const placeName = document.createElement('span');
    placeName.textContent = place.name;
    placeName.className = 'font-medium text-sm';
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    
    const regenerateBtn = document.createElement('button');
    regenerateBtn.type = 'button';
    regenerateBtn.textContent = '🔄';
    regenerateBtn.className = 'btn-secondary btn-compact';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn-danger btn-compact';
    deleteBtn.disabled = places.length <= 1;
    
    btnGroup.appendChild(regenerateBtn);
    btnGroup.appendChild(deleteBtn);
    
    placeContent.appendChild(placeName);
    placeContent.appendChild(btnGroup);
    placeCard.appendChild(placeContent);
    list.appendChild(placeCard);
    
    regenerateButtons.push(regenerateBtn);
    deleteButtons.push(deleteBtn);
  });
  
  return { list, regenerateButtons, deleteButtons };
}

/**
 * Crée la liste des assignments générés
 * @param {{ assignments: Array }} params
 * @returns {{ list: HTMLElement, regenerateCharacterButtons: HTMLElement[], regenerateMoodButtons: HTMLElement[], deleteStudentButtons: HTMLElement[] }}
 */
export function createAssignmentsList({ assignments }) {
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-xs';
  
  const regenerateCharacterButtons = [];
  const regenerateMoodButtons = [];
  const deleteStudentButtons = [];
  
  assignments.forEach((assignment, index) => {
    const assignmentCard = document.createElement('div');
    assignmentCard.className = 'card p-sm';
    
    // Nom de l'élève
    const studentName = document.createElement('div');
    studentName.className = 'text-base font-semibold mb-xs';
    studentName.textContent = assignment.student.name;
    assignmentCard.appendChild(studentName);
    
    // Personnage
    const characterContainer = document.createElement('div');
    characterContainer.className = 'flex justify-between items-center mb-xs';
    
    const characterSpan = document.createElement('span');
    characterSpan.textContent = assignment.character.name;
    characterSpan.className = 'font-medium text-sm';
    
    const regenerateCharacterBtn = document.createElement('button');
    regenerateCharacterBtn.type = 'button';
    regenerateCharacterBtn.textContent = '🔄';
    regenerateCharacterBtn.className = 'btn-secondary btn-match-input';
    
    characterContainer.appendChild(characterSpan);
    characterContainer.appendChild(regenerateCharacterBtn);
    assignmentCard.appendChild(characterContainer);
    
    // Émotion
    const moodContainer = document.createElement('div');
    moodContainer.className = 'flex justify-between items-center mb-xs';
    
    const moodSpan = document.createElement('span');
    moodSpan.textContent = assignment.mood.name;
    moodSpan.className = 'text-secondary text-sm';
    
    const regenerateMoodBtn = document.createElement('button');
    regenerateMoodBtn.type = 'button';
    regenerateMoodBtn.textContent = '🔄';
    regenerateMoodBtn.className = 'btn-secondary btn-match-input';
    
    moodContainer.appendChild(moodSpan);
    moodContainer.appendChild(regenerateMoodBtn);
    assignmentCard.appendChild(moodContainer);
    
    // Bouton de suppression
    const deleteStudentContainer = document.createElement('div');
    deleteStudentContainer.className = 'flex justify-end mt-xs';
    
    const deleteStudentBtn = document.createElement('button');
    deleteStudentBtn.type = 'button';
    deleteStudentBtn.textContent = '🗑️ Supprimer l\'élève de l\'impro';
    deleteStudentBtn.className = 'btn-danger btn-sm';
    deleteStudentBtn.disabled = assignments.length <= 1;
    
    deleteStudentContainer.appendChild(deleteStudentBtn);
    assignmentCard.appendChild(deleteStudentContainer);
    
    list.appendChild(assignmentCard);
    
    regenerateCharacterButtons.push(regenerateCharacterBtn);
    regenerateMoodButtons.push(regenerateMoodBtn);
    deleteStudentButtons.push(deleteStudentBtn);
  });
  
  return { list, regenerateCharacterButtons, regenerateMoodButtons, deleteStudentButtons };
}
