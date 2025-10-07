// @ts-check

/**
 * Service de migration des données LocalStorage
 * Migre les clés de 'cre-impro~' vers 'caucus~'
 */

/**
 * @typedef {Object} MigrationResult
 * @property {boolean} success - Indique si la migration a réussi
 * @property {string[]} migratedKeys - Liste des clés migrées
 * @property {string[]} errors - Liste des erreurs rencontrées
 * @property {number} totalItems - Nombre total d'éléments migrés
 */

// Mapping des clés de stockage
const STORAGE_KEY_MAPPING = {
  'cre-impro~characters': 'caucus~characters',
  'cre-impro~courses': 'caucus~courses',
  'cre-impro~moods': 'caucus~moods',
  'cre-impro~places': 'caucus~places'
};

/**
 * Vérifie si des données existent avec les anciennes clés
 * @returns {boolean}
 */
function hasOldData() {
  return Object.keys(STORAGE_KEY_MAPPING).some(oldKey => 
    localStorage.getItem(oldKey) !== null
  );
}

/**
 * Migre une clé spécifique de l'ancien format vers le nouveau
 * @param {{ oldKey: string, newKey: string }} params
 * @returns {boolean} - Succès de la migration
 */
function migrateKey({ oldKey, newKey }) {
  try {
    const data = localStorage.getItem(oldKey);
    if (data === null) return true; // Pas de données à migrer
    
    // Vérifier si les nouvelles données existent déjà
    if (localStorage.getItem(newKey) !== null) {
      console.warn(`Migration: Les données ${newKey} existent déjà, suppression de ${oldKey}`);
      localStorage.removeItem(oldKey);
      return true;
    }
    
    // Copier les données vers la nouvelle clé
    localStorage.setItem(newKey, data);
    
    // Supprimer l'ancienne clé après migration réussie
    localStorage.removeItem(oldKey);
    
    console.log(`Migration: ${oldKey} → ${newKey} (${data.length} caractères)`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la migration ${oldKey} → ${newKey}:`, error);
    return false;
  }
}

/**
 * Effectue la migration complète des données
 * @returns {MigrationResult}
 */
export function migrateStorageKeys() {
  const result = {
    success: true,
    migratedKeys: /** @type {string[]} */ ([]),
    errors: /** @type {string[]} */ ([]),
    totalItems: 0
  };

  // Vérifier si une migration est nécessaire
  if (!hasOldData()) {
    console.log('Migration: Aucune donnée ancienne trouvée, migration non nécessaire');
    return result;
  }

  console.log('Migration: Début de la migration des données LocalStorage...');

  // Migrer chaque clé
  for (const [oldKey, newKey] of Object.entries(STORAGE_KEY_MAPPING)) {
    const success = migrateKey({ oldKey, newKey });
    
    if (success) {
      result.migratedKeys.push(`${oldKey} → ${newKey}`);
      
      // Compter les éléments migrés
      try {
        const data = localStorage.getItem(newKey);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            result.totalItems += parsed.length;
          }
        }
      } catch {
        // Ignorer les erreurs de parsing pour le comptage
      }
    } else {
      result.success = false;
      result.errors.push(`Échec de la migration ${oldKey} → ${newKey}`);
    }
  }

  // Rapport final
  if (result.success) {
    console.log(`Migration: Succès! ${result.migratedKeys.length} clés migrées, ${result.totalItems} éléments au total`);
  } else {
    console.error('Migration: Échec partiel:', result.errors);
  }

  return result;
}

/**
 * Vérifie si la migration a déjà été effectuée
 * @returns {boolean}
 */
export function isMigrationCompleted() {
  return !hasOldData();
}
