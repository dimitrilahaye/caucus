// @ts-check

/**
 * @param {HTMLElement} root
 * @param {{ courseId: string }} params
 * @param {{
 *   coursesUseCase: import('../../core/usecases/coursesUseCase.js').CoursesUseCase,
 *   placesUseCase: import('../../core/usecases/placesUseCase.js').PlacesUseCase,
 *   moodsUseCase: import('../../core/usecases/moodsUseCase.js').MoodsUseCase,
 *   charactersUseCase: import('../../core/usecases/charactersUseCase.js').CharactersUseCase,
 *   improGenerationUseCase: import('../../core/usecases/generateImpro.js').ImproGenerationUseCase
 * }} deps
 */
export async function renderImproPage(root, params, deps) {
  root.innerHTML = '';

  const course = await deps.coursesUseCase.getById(params.courseId);
  if (!course) {
    const errorCard = document.createElement('div');
    errorCard.className = 'card text-center';
    errorCard.innerHTML = '<p class="text-danger">Cours introuvable</p>';
    root.appendChild(errorCard);
    return;
  }

  const container = document.createElement('div');
  container.className = 'card';

  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-lg';

  const title = document.createElement('h1');
  title.textContent = `Générer une impro - ${course.name}`;
  title.className = 'mb-0';
  header.appendChild(title);

  const back = document.createElement('a');
  back.href = `#/courses/${params.courseId}`;
  back.textContent = '← Retour au cours';
  back.className = 'btn-secondary btn-sm';
  back.addEventListener('click', (e) => {
    if (hasGeneratedImpro) {
      const confirmed = window.confirm('Vous allez perdre l\'impro générée. Continuer ?');
      if (!confirmed) {
        e.preventDefault();
      }
    }
  });
  header.appendChild(back);

  container.appendChild(header);

  // Student selection section
  const studentSection = document.createElement('div');
  studentSection.className = 'mb-lg';
  
  const studentTitle = document.createElement('h3');
  studentTitle.textContent = 'Sélectionner les élèves';
  studentTitle.className = 'mb-md';
  studentSection.appendChild(studentTitle);

  const selectAllBtn = document.createElement('button');
  selectAllBtn.type = 'button';
  selectAllBtn.textContent = 'Tout sélectionner';
  selectAllBtn.className = 'btn-secondary btn-sm mb-md';
  studentSection.appendChild(selectAllBtn);

  const studentList = document.createElement('div');
  studentList.className = 'flex flex-col gap-sm';
  studentSection.appendChild(studentList);

  container.appendChild(studentSection);

  // Places count section
  const placesSection = document.createElement('div');
  placesSection.className = 'mb-lg';
  
  const placesLabel = document.createElement('label');
  placesLabel.textContent = 'Nombre de lieux: ';
  placesLabel.className = 'font-medium mb-sm block';
  
  const placesControls = document.createElement('div');
  placesControls.className = 'flex items-center gap-sm';
  
  const decrementBtn = document.createElement('button');
  decrementBtn.type = 'button';
  decrementBtn.textContent = '-';
  decrementBtn.className = 'btn-secondary btn-match-input';
  
  const placesInput = document.createElement('input');
  placesInput.type = 'number';
  placesInput.min = '1';
  placesInput.value = '1';
  placesInput.className = 'w-auto text-center';
  placesInput.style.width = '80px';
  
  const incrementBtn = document.createElement('button');
  incrementBtn.type = 'button';
  incrementBtn.textContent = '+';
  incrementBtn.className = 'btn-secondary btn-match-input';
  
  placesControls.appendChild(decrementBtn);
  placesControls.appendChild(placesInput);
  placesControls.appendChild(incrementBtn);
  
  placesLabel.appendChild(placesControls);
  placesSection.appendChild(placesLabel);

  container.appendChild(placesSection);

  // Fonction pour mettre à jour les boutons selon les limites
  async function updatePlacesButtons() {
    const places = await deps.placesUseCase.list();
    const currentValue = parseInt(placesInput.value) || 1;
    const maxPlaces = places.length;
    
    decrementBtn.disabled = currentValue <= 1;
    incrementBtn.disabled = currentValue >= maxPlaces;
    
    // Mettre à jour les attributs min/max
    placesInput.max = maxPlaces.toString();
  }

  // Event listeners pour les boutons
  decrementBtn.addEventListener('click', () => {
    const currentValue = parseInt(placesInput.value) || 1;
    if (currentValue > 1) {
      placesInput.value = (currentValue - 1).toString();
      updatePlacesButtons();
    }
  });

  incrementBtn.addEventListener('click', () => {
    const currentValue = parseInt(placesInput.value) || 1;
    const maxPlaces = parseInt(placesInput.max) || 1;
    if (currentValue < maxPlaces) {
      placesInput.value = (currentValue + 1).toString();
      updatePlacesButtons();
    }
  });

  // Event listener pour l'input direct
  placesInput.addEventListener('input', () => {
    const value = parseInt(placesInput.value) || 1;
    const maxPlaces = parseInt(placesInput.max) || 1;
    
    // Forcer les limites
    if (value < 1) {
      placesInput.value = '1';
    } else if (value > maxPlaces) {
      placesInput.value = maxPlaces.toString();
    }
    
    updatePlacesButtons();
  });

  // Initialiser les boutons
  updatePlacesButtons();

  // Generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = '🎭 Générer une impro';
  generateBtn.className = 'btn-primary btn-lg mb-lg';
  generateBtn.disabled = true; // Désactivé par défaut
  container.appendChild(generateBtn);

  // Results section
  const resultsSection = document.createElement('div');
  resultsSection.className = 'card';
  resultsSection.style.display = 'none';
  container.appendChild(resultsSection);

  root.appendChild(container);

          let selectedStudents = new Set();
          let hasGeneratedImpro = false;

          // Fonction pour mettre à jour l'état du bouton de génération
          function updateGenerateButton() {
            generateBtn.disabled = selectedStudents.size === 0;
          }

          // Fonctions de régénération
          async function regeneratePlace(currentPlaces, placeIndex) {
            const places = await deps.placesUseCase.list();
            
            // Exclure les lieux déjà utilisés ET le lieu actuel
            const usedPlaceIds = currentPlaces.map(p => p.id);
            const currentPlaceId = currentPlaces[placeIndex].id;
            const availablePlaces = places.filter(p => !usedPlaceIds.includes(p.id) && p.id !== currentPlaceId);
            
            if (availablePlaces.length === 0) {
              throw new Error('Aucun autre lieu disponible');
            }
            
            // Sélectionner aléatoirement un nouveau lieu
            const randomIndex = Math.floor(Math.random() * availablePlaces.length);
            return availablePlaces[randomIndex];
          }

          async function regenerateCharacter(currentAssignments, assignmentIndex) {
            const characters = await deps.charactersUseCase.list();
            
            // Exclure les personnages déjà utilisés ET le personnage actuel
            const usedCharacterIds = currentAssignments.map(a => a.character.id);
            const currentCharacterId = currentAssignments[assignmentIndex].character.id;
            const availableCharacters = characters.filter(c => !usedCharacterIds.includes(c.id) && c.id !== currentCharacterId);
            
            if (availableCharacters.length === 0) {
              throw new Error('Aucun autre personnage disponible');
            }
            
            // Sélectionner aléatoirement un nouveau personnage
            const randomIndex = Math.floor(Math.random() * availableCharacters.length);
            return availableCharacters[randomIndex];
          }

          async function regenerateMood(currentAssignments, assignmentIndex) {
            const moods = await deps.moodsUseCase.list();
            
            if (moods.length === 0) {
              throw new Error('Aucune émotion disponible');
            }
            
            // Exclure l'émotion actuelle
            const currentMoodId = currentAssignments[assignmentIndex].mood.id;
            const availableMoods = moods.filter(m => m.id !== currentMoodId);
            
            if (availableMoods.length === 0) {
              throw new Error('Aucune autre émotion disponible');
            }
            
            // Sélectionner aléatoirement une nouvelle émotion
            const randomIndex = Math.floor(Math.random() * availableMoods.length);
            return availableMoods[randomIndex];
          }

          // Fonctions de re-rendu des sections
          function renderPlacesSection(currentImpro) {
            const placesTitle = resultsSection.querySelector('h4');
            const placesList = placesTitle?.nextElementSibling;
            
            if (!placesList) return;
            
            placesList.innerHTML = '';
            currentImpro.places.forEach((place, index) => {
              const placeCard = document.createElement('div');
              placeCard.className = 'card';
              
              const placeContent = document.createElement('div');
              placeContent.className = 'inline-edit-container';
              
              const placeName = document.createElement('span');
              placeName.textContent = place.name;
              placeName.className = 'font-medium';
              
              const btnGroup = document.createElement('div');
              btnGroup.className = 'btn-group';
              
              const regeneratePlaceBtn = document.createElement('button');
              regeneratePlaceBtn.type = 'button';
              regeneratePlaceBtn.textContent = '🔄';
              regeneratePlaceBtn.className = 'btn-secondary btn-match-input';
              regeneratePlaceBtn.addEventListener('click', async () => {
                try {
                  const newPlace = await regeneratePlace(currentImpro.places, index);
                  placeName.textContent = newPlace.name;
                  currentImpro.places[index] = newPlace;
                } catch (error) {
                  alert(`Erreur: ${error.message}`);
                }
              });
              
              const deletePlaceBtn = document.createElement('button');
              deletePlaceBtn.type = 'button';
              deletePlaceBtn.textContent = '🗑️';
              deletePlaceBtn.className = 'btn-danger btn-match-input';
              deletePlaceBtn.disabled = currentImpro.places.length <= 1;
              deletePlaceBtn.addEventListener('click', async () => {
                const confirmed = window.confirm(`Supprimer le lieu "${placeName.textContent}" de l'impro ?`);
                if (!confirmed) return;
                
                currentImpro.places.splice(index, 1);
                renderPlacesSection(currentImpro);
              });
              
              btnGroup.appendChild(regeneratePlaceBtn);
              btnGroup.appendChild(deletePlaceBtn);
              
              placeContent.appendChild(placeName);
              placeContent.appendChild(btnGroup);
              placeCard.appendChild(placeContent);
              placesList.appendChild(placeCard);
            });
          }

          function renderAssignmentsSection(currentImpro) {
            const assignmentsTitle = resultsSection.querySelectorAll('h4')[1]; // Le deuxième h4
            const assignmentsList = assignmentsTitle?.nextElementSibling;
            
            if (!assignmentsList) return;
            
            assignmentsList.innerHTML = '';
            currentImpro.assignments.forEach((assignment, index) => {
              const assignmentCard = document.createElement('div');
              assignmentCard.className = 'card';
              
              // Nom de l'élève
              const studentName = document.createElement('div');
              studentName.className = 'text-lg font-semibold mb-sm';
              studentName.textContent = assignment.student.name;
              assignmentCard.appendChild(studentName);
              
              // Personnage
              const characterContainer = document.createElement('div');
              characterContainer.className = 'flex justify-between items-center mb-xs';
              
              const characterSpan = document.createElement('span');
              characterSpan.textContent = assignment.character.name;
              characterSpan.className = 'font-medium';
              
              const regenerateCharacterBtn = document.createElement('button');
              regenerateCharacterBtn.type = 'button';
              regenerateCharacterBtn.textContent = '🔄';
              regenerateCharacterBtn.className = 'btn-secondary btn-match-input';
              regenerateCharacterBtn.addEventListener('click', async () => {
                try {
                  const newCharacter = await regenerateCharacter(currentImpro.assignments, index);
                  characterSpan.textContent = newCharacter.name;
                  currentImpro.assignments[index].character = newCharacter;
                } catch (error) {
                  alert(`Erreur: ${error.message}`);
                }
              });
              
              characterContainer.appendChild(characterSpan);
              characterContainer.appendChild(regenerateCharacterBtn);
              assignmentCard.appendChild(characterContainer);
              
              // Émotion
              const moodContainer = document.createElement('div');
              moodContainer.className = 'flex justify-between items-center mb-sm';
              
              const moodSpan = document.createElement('span');
              moodSpan.textContent = assignment.mood.name;
              moodSpan.className = 'text-secondary';
              
              const regenerateMoodBtn = document.createElement('button');
              regenerateMoodBtn.type = 'button';
              regenerateMoodBtn.textContent = '🔄';
              regenerateMoodBtn.className = 'btn-secondary btn-match-input';
              regenerateMoodBtn.addEventListener('click', async () => {
                try {
                  const newMood = await regenerateMood(currentImpro.assignments, index);
                  moodSpan.textContent = newMood.name;
                  currentImpro.assignments[index].mood = newMood;
                } catch (error) {
                  alert(`Erreur: ${error.message}`);
                }
              });
              
              moodContainer.appendChild(moodSpan);
              moodContainer.appendChild(regenerateMoodBtn);
              assignmentCard.appendChild(moodContainer);
              
              // Bouton de suppression
              const deleteStudentContainer = document.createElement('div');
              deleteStudentContainer.className = 'flex justify-end';
              
              const deleteStudentBtn = document.createElement('button');
              deleteStudentBtn.type = 'button';
              deleteStudentBtn.textContent = '🗑️ Supprimer l\'élève de l\'impro';
              deleteStudentBtn.className = 'btn-danger btn-sm';
              deleteStudentBtn.disabled = currentImpro.assignments.length <= 1;
              deleteStudentBtn.addEventListener('click', async () => {
                const confirmed = window.confirm(`Supprimer l'élève "${studentName.textContent}" de l'impro ?`);
                if (!confirmed) return;
                
                currentImpro.assignments.splice(index, 1);
                renderAssignmentsSection(currentImpro);
              });
              
              deleteStudentContainer.appendChild(deleteStudentBtn);
              assignmentCard.appendChild(deleteStudentContainer);
              
              assignmentsList.appendChild(assignmentCard);
            });
          }

  function renderStudents() {
    if (!course) return;
    
    studentList.innerHTML = '';
    course.students.forEach(student => {
      const studentCard = document.createElement('div');
      studentCard.className = 'card';
      
      const label = document.createElement('label');
      label.className = 'flex items-center gap-sm cursor-pointer w-full';
      
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
        // Mettre à jour le texte du bouton "Tout sélectionner"
        if (selectedStudents.size === course.students.length) {
          selectAllBtn.textContent = 'Tout dé-sélectionner';
        } else {
          selectAllBtn.textContent = 'Tout sélectionner';
        }
        // Mettre à jour l'état du bouton de génération
        updateGenerateButton();
      });
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(student.name));
      studentCard.appendChild(label);
      studentList.appendChild(studentCard);
    });
  }

  selectAllBtn.addEventListener('click', () => {
    if (!course) return;
    
    if (selectedStudents.size === course.students.length) {
      // Tout dé-sélectionner
      selectedStudents.clear();
      selectAllBtn.textContent = 'Tout sélectionner';
    } else {
      // Tout sélectionner
      selectedStudents.clear();
      course.students.forEach(student => selectedStudents.add(student.id));
      selectAllBtn.textContent = 'Tout dé-sélectionner';
    }
    renderStudents();
    updateGenerateButton();
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
      resultsTitle.className = 'text-center mb-lg';
      resultsSection.appendChild(resultsTitle);

      // Places
      const placesTitle = document.createElement('h4');
      placesTitle.textContent = 'Lieux:';
      placesTitle.className = 'mb-md';
      resultsSection.appendChild(placesTitle);
      
      const placesList = document.createElement('div');
      placesList.className = 'flex flex-col gap-sm mb-lg';
      impro.places.forEach((place, index) => {
        const placeCard = document.createElement('div');
        placeCard.className = 'card';
        
        const placeContent = document.createElement('div');
        placeContent.className = 'inline-edit-container';
        
        const placeName = document.createElement('span');
        placeName.textContent = place.name;
        placeName.className = 'font-medium';
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        
        const regeneratePlaceBtn = document.createElement('button');
        regeneratePlaceBtn.type = 'button';
        regeneratePlaceBtn.textContent = '🔄';
        regeneratePlaceBtn.className = 'btn-secondary btn-match-input';
        regeneratePlaceBtn.addEventListener('click', async () => {
          try {
            const newPlace = await regeneratePlace(impro.places, index);
            placeName.textContent = newPlace.name;
            impro.places[index] = newPlace;
          } catch (error) {
            alert(`Erreur: ${error.message}`);
          }
        });
        
        const deletePlaceBtn = document.createElement('button');
        deletePlaceBtn.type = 'button';
        deletePlaceBtn.textContent = '🗑️';
        deletePlaceBtn.className = 'btn-danger btn-match-input';
        deletePlaceBtn.disabled = impro.places.length <= 1; // Désactiver s'il n'y a qu'un lieu
        deletePlaceBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer le lieu "${placeName.textContent}" de l'impro ?`);
          if (!confirmed) return;
          
          // Supprimer le lieu de la liste
          impro.places.splice(index, 1);
          
          // Re-render la section des lieux
          renderPlacesSection(impro);
        });
        
        btnGroup.appendChild(regeneratePlaceBtn);
        btnGroup.appendChild(deletePlaceBtn);
        
        placeContent.appendChild(placeName);
        placeContent.appendChild(btnGroup);
        placeCard.appendChild(placeContent);
        placesList.appendChild(placeCard);
      });
      resultsSection.appendChild(placesList);

      // Assignments
      const assignmentsTitle = document.createElement('h4');
      assignmentsTitle.textContent = 'Attributions:';
      assignmentsTitle.className = 'mb-md';
      resultsSection.appendChild(assignmentsTitle);

      const assignmentsList = document.createElement('div');
      assignmentsList.className = 'flex flex-col gap-sm';
      impro.assignments.forEach((assignment, index) => {
        const assignmentCard = document.createElement('div');
        assignmentCard.className = 'card';
        
        // Nom de l'élève (première ligne, plus gros)
        const studentName = document.createElement('div');
        studentName.className = 'text-lg font-semibold mb-sm';
        studentName.textContent = assignment.student.name;
        assignmentCard.appendChild(studentName);
        
        // Personnage (deuxième ligne)
        const characterContainer = document.createElement('div');
        characterContainer.className = 'flex justify-between items-center mb-xs';
        
        const characterSpan = document.createElement('span');
        characterSpan.textContent = assignment.character.name;
        characterSpan.className = 'font-medium';
        
        const regenerateCharacterBtn = document.createElement('button');
        regenerateCharacterBtn.type = 'button';
        regenerateCharacterBtn.textContent = '🔄';
        regenerateCharacterBtn.className = 'btn-secondary btn-match-input';
        regenerateCharacterBtn.addEventListener('click', async () => {
          try {
            const newCharacter = await regenerateCharacter(impro.assignments, index);
            characterSpan.textContent = newCharacter.name;
            impro.assignments[index].character = newCharacter;
          } catch (error) {
            alert(`Erreur: ${error.message}`);
          }
        });
        
        characterContainer.appendChild(characterSpan);
        characterContainer.appendChild(regenerateCharacterBtn);
        assignmentCard.appendChild(characterContainer);
        
        // Émotion (troisième ligne, sans parenthèses)
        const moodContainer = document.createElement('div');
        moodContainer.className = 'flex justify-between items-center mb-sm';
        
        const moodSpan = document.createElement('span');
        moodSpan.textContent = assignment.mood.name;
        moodSpan.className = 'text-secondary';
        
        const regenerateMoodBtn = document.createElement('button');
        regenerateMoodBtn.type = 'button';
        regenerateMoodBtn.textContent = '🔄';
        regenerateMoodBtn.className = 'btn-secondary btn-match-input';
        regenerateMoodBtn.addEventListener('click', async () => {
          try {
            const newMood = await regenerateMood(impro.assignments, index);
            moodSpan.textContent = newMood.name;
            impro.assignments[index].mood = newMood;
          } catch (error) {
            alert(`Erreur: ${error.message}`);
          }
        });
        
        moodContainer.appendChild(moodSpan);
        moodContainer.appendChild(regenerateMoodBtn);
        assignmentCard.appendChild(moodContainer);
        
        // Bouton de suppression de l'élève (quatrième ligne)
        const deleteStudentContainer = document.createElement('div');
        deleteStudentContainer.className = 'flex justify-end';
        
        const deleteStudentBtn = document.createElement('button');
        deleteStudentBtn.type = 'button';
        deleteStudentBtn.textContent = '🗑️ Supprimer l\'élève de l\'impro';
        deleteStudentBtn.className = 'btn-danger btn-sm';
        deleteStudentBtn.disabled = impro.assignments.length <= 1; // Désactiver s'il n'y a qu'un élève
        deleteStudentBtn.addEventListener('click', async () => {
          const confirmed = window.confirm(`Supprimer l'élève "${studentName.textContent}" de l'impro ?`);
          if (!confirmed) return;
          
          // Supprimer l'élève de la liste
          impro.assignments.splice(index, 1);
          
          // Re-render la section des attributions
          renderAssignmentsSection(impro);
        });
        
        deleteStudentContainer.appendChild(deleteStudentBtn);
        assignmentCard.appendChild(deleteStudentContainer);
        
        assignmentsList.appendChild(assignmentCard);
      });
      resultsSection.appendChild(assignmentsList);

    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  });

  renderStudents();
  updateGenerateButton();
}