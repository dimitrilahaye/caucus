import './style.css';
import { composeApp } from './presentation/compose/index.js';
import { renderHome } from './presentation/pages/home.js';

const counterElement = document.querySelector('#counter');
const button = document.querySelector('#btn');
let count = 0;

function updateCounter() {
  counterElement.textContent = `Clicks: ${count}`;
}

button.addEventListener('click', () => {
  count += 1;
  updateCounter();
});

updateCounter();

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

// Bootstrap minimal presentation layer
const appRoot = document.getElementById('app');
if (appRoot) {
  composeApp();
  renderHome(appRoot);
}

