import './style.css';
import { migrateStorageKeys } from './core/utils/dataMigration.js';
import { composeApp } from './presentation/compose/index.js';
import { Router } from './presentation/router.js';
import { renderCoursesPage } from './presentation/pages/courses/index.js';
import { renderCourseDetailsPage } from './presentation/pages/course-details/index.js';
import { renderBurgerMenu } from './presentation/components/burgerMenu/index.js';
import { renderPlacesPage } from './presentation/pages/places.js';
import { renderMoodsPage } from './presentation/pages/moods.js';
import { renderCharactersPage } from './presentation/pages/characters.js';
import { renderImproPage } from './presentation/pages/impro/index.js';

// Migration des données LocalStorage au démarrage
try {
  const migrationResult = migrateStorageKeys();
  if (migrationResult.success && migrationResult.migratedKeys.length > 0) {
    console.log(`✅ Migration réussie: ${migrationResult.totalItems} éléments migrés`);
  }
} catch (error) {
  console.error('❌ Erreur lors de la migration des données:', error);
}

// Optional: report that PWA service worker is ready
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      console.log('Service worker ready:', reg.scope);
    } catch (e) {
      console.log('Service worker not ready yet');
    }
  });
}

// Bootstrap router and pages
const appRoot = document.getElementById('app');
if (appRoot) {
  const deps = composeApp();
  const menuMount = document.getElementById('menu');
  if (menuMount) renderBurgerMenu({ mountOn: menuMount });
  const router = new Router([
    { path: '/courses', handler: () => renderCoursesPage({ root: appRoot, deps }) },
    { path: '/courses/:id', handler: (params) => renderCourseDetailsPage({ root: appRoot, params, deps }) },
    { path: '/courses/:courseId/impro', handler: (params) => renderImproPage({ root: appRoot, params, deps }) },
    { path: '/places', handler: () => renderPlacesPage({ root: appRoot, deps }) },
    { path: '/moods', handler: () => renderMoodsPage({ root: appRoot, deps }) },
    { path: '/characters', handler: () => renderCharactersPage({ root: appRoot, deps }) },
  ]);
  router.start();
}

