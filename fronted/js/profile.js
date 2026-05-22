/**
 * StudyHub - Profile JavaScript
 * Handles tabs and profile settings
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.dataset.tab;

      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Update active tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });

  // Edit profile button
  const editProfileBtn = document.querySelector('.profile-info .btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      // Switch to settings tab
      const settingsTab = document.querySelector('.tab-btn[data-tab="settings"]');
      if (settingsTab) {
        settingsTab.click();
      }
    });
  }

  // Settings form submission
  const settingsForms = document.querySelectorAll('.settings-section form');
  settingsForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate saving (replace with actual API call)
      console.log('Saving settings...');
      alert('Settings saved successfully!');
    });
  });

  // Delete account button
  const deleteBtn = document.querySelector('.settings-section .btn[style*="error"]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmed) {
        console.log('Deleting account...');
        alert('Account deletion would be processed here.');
      }
    });
  }

  // Note card more options
  document.querySelectorAll('.note-card-footer .btn-icon[aria-label="More options"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // In a real app, this would show a dropdown menu
      const options = ['Edit', 'Delete', 'View Stats'];
      const choice = prompt(`Options:\n1. Edit\n2. Delete\n3. View Stats\n\nEnter number:`);
      
      if (choice === '1') {
        alert('Edit functionality would open here');
      } else if (choice === '2') {
        if (confirm('Are you sure you want to delete this note?')) {
          alert('Note would be deleted');
        }
      } else if (choice === '3') {
        alert('Stats view would open here');
      }
    });
  });
});
