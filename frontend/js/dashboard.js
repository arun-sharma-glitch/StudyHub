/**
 * StudyHub - Dashboard JavaScript
 * Handles sidebar, filters, and view toggle functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('active');
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      this.classList.remove('active');
    });
  }

  // View toggle (grid/list)
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const notesContainer = document.getElementById('notesContainer');

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Update view
      const view = this.dataset.view;
      if (notesContainer) {
        if (view === 'list') {
          notesContainer.classList.remove('notes-grid');
          notesContainer.classList.add('notes-list');
          // Transform cards to list items
          notesContainer.querySelectorAll('.note-card').forEach(card => {
            card.classList.add('note-list-item-style');
          });
        } else {
          notesContainer.classList.remove('notes-list');
          notesContainer.classList.add('notes-grid');
          notesContainer.querySelectorAll('.note-card').forEach(card => {
            card.classList.remove('note-list-item-style');
          });
        }
      }
    });
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = this.value.toLowerCase();
        filterNotes({ search: query });
      }, 300);
    });
  }

  // Filter functionality
  const subjectFilter = document.getElementById('subjectFilter');
  const semesterFilter = document.getElementById('semesterFilter');
  const sortFilter = document.getElementById('sortFilter');

  [subjectFilter, semesterFilter, sortFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', function() {
        filterNotes({
          subject: subjectFilter ? subjectFilter.value : '',
          semester: semesterFilter ? semesterFilter.value : '',
          sort: sortFilter ? sortFilter.value : 'recent'
        });
      });
    }
  });

  // Filter notes function (placeholder - would connect to API)
  function filterNotes(filters) {
    console.log('Filtering notes:', filters);
    // In a real app, this would make an API call and update the notes grid
  }

  // Bookmark functionality
  document.querySelectorAll('.note-card-footer .btn-icon, .note-list-actions .btn-icon').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const svg = this.querySelector('svg');
      const isBookmarked = this.classList.toggle('bookmarked');
      
      if (isBookmarked) {
        svg.setAttribute('fill', 'currentColor');
        this.style.color = 'var(--primary)';
      } else {
        svg.setAttribute('fill', 'none');
        this.style.color = '';
      }
    });
  });

  // Close sidebar on window resize (if open on mobile)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024 && sidebar) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) {
        sidebarOverlay.classList.remove('active');
      }
    }
  });


    fetch('/api/user/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
       
        return response.json();
      })
      .then(userData => {

        console.log('User Data:', userData);

        //calling this funtion of userUi 
        renderUser(userData.user);
      })
      .catch(error => {
        console.error('Error:', error )
      }) 
  // }
});


