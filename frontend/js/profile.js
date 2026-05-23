/**
 * StudyHub - Profile JavaScript
 * Handles tabs and profile settings
 */


let currentUser = null;

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
          if(tabId === 'settings') {
            fillSettingsForm();
          }
        }
      });
    });
  });

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
            throw new Error( 'Update failed' );
            }

        const data = await response.json();

        currentUser = data.user;

        //rendering user info
        renderUser(currentUser);

        console.log('Updated');
      }
      catch (error) {
        console.error( error)
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

});


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