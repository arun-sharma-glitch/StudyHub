/**
 * StudyHub - Profile JavaScript
 * Handles tabs and profile settings
 */


let currentUser = null;
let selectedNoteId = null;

document.addEventListener('DOMContentLoaded', function () {




  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const tabId = this.dataset.tab;

      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Update active tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');

          //check settings tab open then fill form
          if (tabId === 'settings') {
            fillSettingsForm();
          }

          //fetch saved notes
          if (tabId === 'saved') {
            fetchSavedNotes()
          }
        }
      });
    });
  });

  //href to redirect profile and tab change
  const params =
    new URLSearchParams(
      window.location.search
    );

  const activeTab = params.get('tabs');

  if (activeTab) {

    setTimeout(() => {
      const tabBtn =
        document.querySelector(`[data-tab="${activeTab}"]`);

      if (tabBtn) {
        tabBtn.click();
      }
    }, 0);
  }

  // Edit profile button
  const editProfileBtn = document.querySelector('.profile-info .btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function () {
      // Switch to settings tab
      const settingsTab = document.querySelector('.tab-btn[data-tab="settings"]');
      if (settingsTab) {
        settingsTab.click();

        //call fill settings form when edit button clicked
        fillSettingsForm()
      }
    });
  }

  // Settings form submission
  const settingsForms = document.querySelectorAll('.settings-section form');
  settingsForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simulate saving (replace with actual API call)
      console.log('Saving settings...');
      alert('Settings saved successfully!');

    });
  });


  //separately adding event listener to save changes form button
  const save_changes = document.getElementById('save-changes')

  save_changes.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('settingsFirstName').value;

    const lastName = document.getElementById('settingsLastName').value;

    const bio = document.getElementById('settingsBio').value;

    const university = document.getElementById('settingsUniversity').value;

    try {
      const response = await fetch(
        '/api/user/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({ firstName, lastName, bio, university })
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const data = await response.json();

      currentUser = data.user;

      //rendering user info
      renderUser(currentUser);

      console.log('Updated');
    }
    catch (error) {
      console.error(error)
    }
  }
  )

  // Delete account button
  const deleteBtn = document.querySelector('.settings-section .btn[style*="error"]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmed) {
        console.log('Deleting account...');
        alert('Account deletion would be processed here.');
      }
    });
  }

  // Note card more options
  document.querySelectorAll('.note-card-footer .btn-icon[aria-label="More options"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
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



  //fetching api 
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
      currentUser = userData.user;
      renderUser(currentUser);

    })
    .catch(error => {
      console.log('error', error);
    })


  //fetching my notes
  fetchMyNotes();

  //fetch profile state
  fetchStates();

  //dialog features
  dialogShowOrRemove();

});

//function fro dialog
async function dialogShowOrRemove() {
  document.getElementById('cancelDelete')
    .addEventListener('click', () => {

      document.getElementById('deleteDialog')
        .classList.remove('show');

      selectedNoteId = null;
    }
    );


  document.getElementById('confirmDelete')
    .addEventListener('click', async () => {
      try {
        const response = await fetch(
          `/api/notes/delete/${selectedNoteId}`,
          {
            method: 'DELETE'
          }
        );

        const data = response.json();

        if (!response.ok) {
          console.log(
            data
          );

          throw new Error(
            data.message
          );
        }

        document.getElementById('deleteDialog')
          .classList.remove('show');

        selectedNoteId = null;

        //fetch notes after deletition of notes
        fetchMyNotes();

        //fetch state after deletion of notes
        fetchStats();

      }
      catch (error) {
        console.log(error);
      }
    }
    );
}



//fetch my notes function
async function fetchMyNotes() {
  try {
    const response = await fetch('/api/notes/my-notes');

    if (!response.ok) {
      throw new Error(
        'Failed to load notes'
      );
    }

    const data = await response.json();
    renderMyNotes(data.notes);

  } catch (error) {
    console.log(error);
  }
}

//render my notes
function renderMyNotes(notes) {
  const container = document.getElementById('myNotesContainer');

  container.innerHTML = '';
  notes.forEach(
    note => {
      console.log(note);
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

          window.open(
            `/${note.fileUrl}`,
            '_blank'
          );
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

                        Semester
                        ${note.semester}

                        </span>

                        <span>

                        ${note.downloads}

                        downloads

                        </span>

                        </div>

                        </div>

                        <div class="note-card-footer">

                        <span
                        style="
                        font-size:0.813rem;
                        color:var(--text-muted);
                        ">

                        Uploaded

                        ${new Date(
        note.createdAt
      ).toLocaleDateString()}

                        </span>

                        <div class="note-options">
                        <button
                        class="btn btn-ghost btn-icon more-btn"
                        aria-label="More options">

                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">

                        <circle
                        cx="12"
                        cy="12"
                        r="1">

                        </circle>

                        <circle
                        cx="19"
                        cy="12"
                        r="1">

                        </circle>

                        <circle
                        cx="5"
                        cy="12"
                        r="1">

                        </circle>

                        </svg>

                        </button>

                        <div class="options-menu">

                        <button class="delete-btn">

                        Delete Note

                        </button>

                        </div>
                        </div>

                        </div>
                        `;

      container.appendChild(
        card
      );


      //more btn-----------\\
      const moreBtn =
        card.querySelector('.more-btn');

      const menu =
        card.querySelector('.options-menu');

      console.log("options menu::", menu);

      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle(
          'show'
        );

      }
      );


      //delete btn 
      const deleteBtn =
        card.querySelector('.delete-btn');

      deleteBtn
        .addEventListener('click', (e) => {
          e.stopPropagation();
          selectedNoteId = note._id;

          document.getElementById('deleteDialog')
            .classList.add(
              'show'
            );
        }
        );

      //------------------\\

    });

}


//fill settings form, when edit cliks and when settings click
function fillSettingsForm() {
  if (currentUser) {
    document.getElementById('settingsFirstName').value = currentUser.firstName;
    document.getElementById('settingsLastName').value = currentUser.lastName;
    document.getElementById('settingsEmail').value = currentUser.email;
    document.getElementById('settingsBio').value = currentUser.bio || "";
    document.getElementById('settingsUniversity').value = currentUser.university || "";
  }
}


//fetch profile state total-uploads, total-downloads
async function fetchStates() {
  try {
    const response = await fetch('/api/notes/profile-state');

    if (!response.ok) {
      throw new Error(
        'Server Error'
      );
    }
    const data = await response.json();

    document.getElementById('total-notes').textContent = data.totalNotes;
    document.getElementById('total-downloads').textContent = data.totalDownloads;

  } catch (error) {
    console.log('error in fetching state', error);
  }
}


//fetch saved notes
async function fetchSavedNotes() {

  try {
    const response = await fetch('/api/notes/saved');

    if (!response.ok) {
      throw new Error(
        'Error fetching saved notes'
      );
    }

    const data = await response.json();

    const emptyState = document.getElementById('savedEmptyState');

    const container = document.getElementById('savedNotesContainer');

    if (data.savedNotes.length === 0) {

      emptyState.style.display = 'block';

      container.innerHTML = '';

      return;
    }

    emptyState.style.display = 'none';

    //rendering saved notes
    renderSavedNotes(data.savedNotes);
  }
  catch (error) {

    console.log(
      error
    );
  }
}

function renderSavedNotes(
  savedNotes
) {

  const container =
    document.getElementById(
      'savedNotesContainer'
    );

  container.innerHTML = '';

  savedNotes.forEach(

    note => {

      const card =
        document.createElement(
          'article'
        );

      card.className =
        'card note-card';

      card.addEventListener(

        'click',

        () => {

          window.open(

            `/${note.fileUrl}`,

            '_blank'

          );

        }

      );

      card.innerHTML = card.innerHTML = `

<div class="note-card-preview">

<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">
</path>

<polyline
points="14 2 14 8 20 8">
</polyline>

<line
x1="16"
y1="13"
x2="8"
y2="13">
</line>

<line
x1="16"
y1="17"
x2="8"
y2="17">
</line>

</svg>

</div>

<div class="note-card-content">

<span
class="note-card-subject">

${note.subject}

</span>

<h3
class="note-card-title">

${note.title}

</h3>

<div
class="note-card-meta">

<span>

<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z">
</path>

<path
d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z">
</path>

</svg>

 ${note.semester}

</span>

<span>

<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4">
</path>

<polyline
points="7 10 12 15 17 10">
</polyline>

<line
x1="12"
y1="15"
x2="12"
y2="3">
</line>

</svg>

${note.downloads}

</span>

</div>

</div>

<div
class="note-card-footer">

<div
class="note-card-author">

<div
class="note-card-avatar">

${(

          (note.uploadedBy?.firstName?.[0] || 'U')

          +

          (note.uploadedBy?.lastName?.[0] || '')

        ).toUpperCase()}

</div>

<span
class="note-card-author-name">

${note.uploadedBy?.firstName || ''}

${note.uploadedBy?.lastName || ''}

</span>

</div>

<button
class="btn btn-ghost btn-icon"
aria-label="Bookmark"

style="
color:var(--primary)
">

<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"

fill="currentColor"

stroke="currentColor"

stroke-width="2"

stroke-linecap="round"

stroke-linejoin="round">

<path
d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z">

</path>

</svg>

</button>

</div>

`;
      const bookmarkBtn =

        card.querySelector(
          '.btn-icon'
        );

      bookmarkBtn.addEventListener(

        'click',

        async (e) => {

          e.stopPropagation();

          await fetch(

            `/api/notes/bookmark/${note._id}`,

            {

              method: 'PATCH'

            }

          );

          card.remove();

        }

      );

      container.appendChild(
        card
      );

    }

  );

}