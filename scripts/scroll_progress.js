// scripts/scroll_progress.js
// Updates the #scroll-progress bar width as the user scrolls the page

function updateScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgressBar);
window.addEventListener('resize', updateScrollProgressBar);
document.addEventListener('DOMContentLoaded', updateScrollProgressBar);
