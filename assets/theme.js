/**
 * Dark Mode Toggle Functionality
 * 
 * Features:
 * - Toggles between light and dark themes
 * - Saves user preference in localStorage
 * - Smooth fade transitions
 * - Dynamic icon updates (moon/sun)
 * - Accessible with proper ARIA labels
 * 
 * @author MysticAura Theme
 * @version 1.0.0
 */
(function() {
  'use strict';

  // Initialize theme on page load (before DOM ready to prevent flash)
  function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('mysticAura-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  // Apply theme immediately to prevent flash
  initTheme();

  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Get saved theme preference or default to light
    const savedTheme = localStorage.getItem('mysticAura-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('mysticAura-theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Dispatch custom event for any components that need to react
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: newTheme } 
        }));
      });
    }
  });

  /**
   * Update theme toggle button icon and styling
   * @param {string} theme - Current theme ('light' or 'dark')
   */
  function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      
      // Update color for visibility
      if (theme === 'dark') {
        themeToggle.style.color = '#f9fafb';
      } else {
        themeToggle.style.color = '';
      }
    }
  }
})();

