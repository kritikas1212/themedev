/**
 * Dark Mode Toggle Functionality
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Get saved theme preference or default to light
    const savedTheme = localStorage.getItem('mysticAura-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('mysticAura-theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add fade transition
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      });
    }
  });

  function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      if (theme === 'dark') {
        themeToggle.style.color = '#f9fafb';
      } else {
        themeToggle.style.color = '';
      }
    }
  }
})();

