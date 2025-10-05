import './style.css';
import { composeApp } from './presentation/compose/index.js';
import { Router } from './presentation/router.js';
import { renderCoursesPage } from './presentation/pages/courses.js';
import { renderCourseDetailsPage } from './presentation/pages/courseDetails.js';
import { renderBurgerMenu } from './presentation/components/burgerMenu.js';
import { renderPlacesPage } from './presentation/pages/places.js';
import { renderMoodsPage } from './presentation/pages/moods.js';
import { renderCharactersPage } from './presentation/pages/characters.js';
import { renderImproPage } from './presentation/pages/impro.js';

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
  if (menuMount) renderBurgerMenu(menuMount);
  const router = new Router([
    { path: '/courses', handler: () => renderCoursesPage(appRoot, deps) },
    { path: '/courses/:id', handler: (params) => renderCourseDetailsPage(appRoot, params, deps) },
    { path: '/courses/:courseId/impro', handler: (params) => renderImproPage(appRoot, params, deps) },
    { path: '/places', handler: () => renderPlacesPage(appRoot, deps) },
    { path: '/moods', handler: () => renderMoodsPage(appRoot, deps) },
    { path: '/characters', handler: () => renderCharactersPage(appRoot, deps) },
  ]);
  router.start();
}

