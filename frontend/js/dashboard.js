/**
 * StudyHub - Dashboard JavaScript
 * Handles sidebar, filters, and view toggle functionality
 */

let allNotes = [];
let savedNotes = [];

document.addEventListener('DOMContentLoaded', function () {
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('active');
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      this.classList.remove('active');
    });
  }

  // View toggle (grid/list)
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const notesContainer = document.getElementById('notesContainer');

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
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
  const subjectFilter = document.getElementById('subjectFilter');
  const semesterFilter = document.getElementById('semesterFilter');
  const sortFilter = document.getElementById('sortFilter');

  //search input listener
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterNotes({
              search: searchInput.value.toLowerCase(),
              subject: subjectFilter ? subjectFilter.value : '',
              semester: semesterFilter ? semesterFilter.value : '',
              sort: sortFilter ? sortFilter.value : 'recent'
            });
          }, 300);
      }
    );
  }

  //filter dropdown listeners
  [subjectFilter, semesterFilter, sortFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', function () {
          filterNotes({
            search: searchInput ? searchInput.value
                  .toLowerCase()
                : '',

            subject:
              subjectFilter
                ? subjectFilter.value
                : '',

            semester:
              semesterFilter
                ? semesterFilter.value
                : '',

            sort:
              sortFilter
                ? sortFilter.value
                : 'recent'
          });
        }
      );
    }
  });

  //filter function
  function filterNotes(
    filters
  ) {

    let filtered =
      [...allNotes];

    //search filter
    if (filters.search) {
      filtered =
        filtered.filter(
          note =>

            (note.title || '')
              .toLowerCase()
              .includes(
                filters.search
              )

            ||

            (note.subject || '')
              .toLowerCase()
              .includes(
                filters.search
              )
            ||
            (note.courseName || '')
              .toLowerCase()
              .includes(
                filters.search
              )
        );
    }


    //subject filter
    if (filters.subject) {

      filtered =
        filtered.filter(
          note =>

            note.subject ===
            filters.subject

        );

    }

    //semester filter
    if (filters.semester) {
      filtered =  filtered.filter(  note => note.semester.toString() === filters.semester);
    }

    //sorting
    if (filters.sort === 'downloads' ) {
      filtered.sort(
        (a, b) =>
          b.downloads - a.downloads
      );
    }
    else {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    //no notes found
    if (filtered.length === 0) {

      document.getElementById(
        'notesContainer'
      ).innerHTML =

        `<p class="empty-message">
No notes found
</p>`;

      return;
    }
    //render filtered notes
    renderAllNotes(filtered, savedNotes);

  }

  // Close sidebar on window resize (if open on mobile)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && sidebar) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) {
        sidebarOverlay.classList.remove('active');
      }
    }
  });

  //api to set user info
  fetch('/api/user/profile')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      return response.json();
    })
    .then(userData => {

      //calling this funtion of userUi 
      renderUser(userData.user);
    })
    .catch(error => {
      console.error('Error:', error)
    })
  // }

  //fetch notes
  fetchNotes();
});

//fetch all notes
async function fetchNotes() {
  try {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }
    const data = await response.json();
    allNotes = data.notes;
    savedNotes = data.savedNotes;
    renderAllNotes(data.notes, data.savedNotes);
  } catch (error) {
    console.log("error in getting all notes in dashboard: ", error);
  }
}

//rendering all notes
function renderAllNotes(notes, savedNotes) {

  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  notes.forEach(note => {
    const card = document.createElement('article');
    card.className = 'card note-card';
    //click listener to open pdf
    card.addEventListener('click', async () => {
      try {
        await fetch(
          `/api/notes/download/${note._id}`,
          {
            method: 'PATCH'
          }
        );

        window.open(`/${note.fileUrl}`,'_blank');
      }
      catch (error) {
        console.log(
          error
        );
      }
    }
    );

    //card loading dynamically
    card.innerHTML = `<div class="note-card-preview">

                  <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">

                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>

                  <polyline points="14 2 14 8 20 8"></polyline>

                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  </div>

                  <div class="note-card-content">

                  <span class="note-card-subject">

                  ${note.subject}

                  </span>

                  <h3 class="note-card-title">
                  ${note.title}
                  </h3>
                  <div class="note-card-meta">

                  <span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">

                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  ${note.semester}
                  </span>
                  <span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">

                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  ${note.downloads}
                  </span>
                  </div>
                  </div>
                  <div class="note-card-footer">

                  <div class="note-card-author">
                  <div class="note-card-avatar">

                  ${(
        (note.uploadedBy?.firstName?.[0] || 'U')
        +
        (note.uploadedBy?.lastName?.[0] || '')
      ).toUpperCase()
      }
                  </div>

                  <span class="note-card-author-name">
                  ${note.uploadedBy?.firstName || ''}

                  ${note.uploadedBy?.lastName || ''}
                  </span>
                  </div>

                  <button
                  class="btn btn-ghost btn-icon"
                  aria-label="Bookmark">

                  <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">

                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  </button>

                  </div>

                  `;


    // Bookmark auto loaded
    const bookmarkBtn = card.querySelector('.btn-icon');

    const svg = bookmarkBtn.querySelector('svg');

    const isSaved = savedNotes.some(id => id.toString() === note._id);

    if (isSaved) {
      svg.setAttribute('fill', 'currentColor');
      bookmarkBtn.style.color = 'var(--primary)';

    }

    //bookmark when clicked
    bookmarkBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      try {
        const response = await fetch(
          `/api/notes/bookmark/${note._id}`,
          {
            method: 'PATCH'
          }
        );
        const data = await response.json();

        if (data.saved) {
          svg.setAttribute('fill', 'currentColor');

          bookmarkBtn.style.color = 'var(--primary)';
        }
        else {
          svg.setAttribute('fill', 'none');

          bookmarkBtn.style.color = '';
        }
      }
      catch (error) {

        console.log(error);

      }
    }
    );
    //apending created card to container
    container.appendChild(card);

  });
}


