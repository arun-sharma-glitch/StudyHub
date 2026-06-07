document.addEventListener('DOMContentLoaded', () => {

    let allUsers = [];
    let allNotes = [];
   

    const tabs =
        document.querySelectorAll(
            '.analytics-tab'
        );

    const contents =
        document.querySelectorAll(
            '.tab-content'
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            'click',

            () => {

                const tabId =
                    tab.dataset.tab;

                //remove active
                tabs.forEach(item => {
                    item.classList.remove(
                        'active'
                    );
                });

                //hide contents
                contents.forEach(content => {

                    content.classList.remove(
                        'active'
                    );

                    if (
                        tabId ===
                        content.id
                    ) {

                        content.classList.add(
                            'active'
                        );

                    }

                });

                //active tab
                tab.classList.add(
                    'active'
                );

            }

        );

    });


    //load users
    getUsers();
    //get stats
    getStats();
    //get notes
    getNotes();
    



    //getting users
    async function getUsers() {

        try {

            const response =
                await fetch(
                    '/api/admin/users'
                );

            if (!response.ok) {

                throw new Error(
                    'Error in getting users'
                );

            }

            allUsers =
                await response.json();

            //render all users
            renderUsers(allUsers);

        }

        catch (error) {

            console.log(error);

        }

    }



    //rendering all users
    function renderUsers(users) {

        const usersContainer =
            document.getElementById(
                'usersContainer'
            );

        usersContainer.innerHTML = "";



        users.forEach(user => {

            const article =
                document.createElement(
                    'article'
                );

            article.innerHTML = `

<div class="user-card">

    <div class="user-info">

        <h3 class="user-name">
            ${user.firstName}
            ${user.lastName}
        </h3>

        <p class="user-email">
            ${user.email}
        </p>

    </div>

    <button 
        class="delete-user-btn"
        data-id="${user._id}"
        aria-label="Delete user"
    >

        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
        >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4h6v2"></path>
        </svg>

    </button>

</div>

                `;

            usersContainer.appendChild(
                article
            );


            //delete user 
            article.querySelector('.delete-user-btn').addEventListener('click', () => {
                //permofrm user deletion
                setupDeleteDialog('users', user._id);
            })

        });

    }

   

    //rendering notes dynamically
    function renderNotes(notes) {
        const container = document.getElementById('adminNotesContainer');

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
                });


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
                        setupDeleteDialog('notes', note._id);
                    });

                //------------------\\

            });

    }


    //get stats function
    async function getStats() {
        const total_users = document.getElementById('total-users');
        const total_notes = document.getElementById('total-notes');
        const recent_uploads = document.getElementById('recent-uploads');

        if (total_notes && total_users && recent_uploads) {
            try {
                const response = await fetch('/api/admin/stats');

                if (!response.ok) {
                    throw new Error('Error occured in fetching stats');
                }

                const data = await response.json();

                if (data) {
                    total_notes.textContent = data.totalNotes;
                    total_users.textContent = data.totalUsers;
                    recent_uploads.textContent = data.recentUploads;
                }



            } catch (error) {
                console.log('error in getting stats at admin', error);
            }
        }
    }


    //getting notes
    async function getNotes() {
        try {

            const response =
                await fetch(
                    '/api/admin/notes'
                );

            if (!response.ok) {

                throw new Error(
                    'Error in getting notes'
                );

            }

            allNotes =
                await response.json();

            //render notes after getting
            renderNotes(allNotes);

        }

        catch (error) {

            console.log(error);

        }
    }

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


    //function for dialog
    function setupDeleteDialog(deleteType, selectedId) {
        
        document.getElementById('deleteDialog').classList.add('show');


        document.getElementById('cancelDelete')
            .onclick = () => {

                document.getElementById('deleteDialog')
                    .classList.remove('show');
            }
            


        document.getElementById('confirmDelete')
            .onclick = async () => {
                try {
                    const response = await fetch(
                        `/api/admin/${deleteType}/${selectedId}`,
                        {
                            method: 'DELETE'
                        }
                    );

                    const data = await response.json();

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

                    //fetch notes or user after deletition of notes
                    deleteType === 'users' ? getUsers() : getNotes();
                    

                    //fetch state after deletion of notes
                    getStats();

                }
                catch (error) {
                    console.log(error);
                }
            }
    }

});