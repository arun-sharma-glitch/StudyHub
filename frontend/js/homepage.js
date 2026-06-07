document.addEventListener('DOMContentLoaded', () => {
    init();
    //fetching sample notes
    fetchPublicNotes();
  }
);

function init() {
  setupButtonAnimations();
  setupFeatureCards();
  setupNoteCards();
  setupHeroEffect();
  setupScrollReveal();
  setupCTAButton();
  setupSmoothScroll();
}

//fetch sample notes
async function fetchPublicNotes() {
  try {
    const response = await fetch('/api/notes/public');

    if (!response.ok) {
      throw new Error('Failed to load notes...!');
    }
    const data = await response.json();
    //rendering sample notes 
    renderPublicNotes(data.notes);

  } catch (error) {
    console.log('error in getting public notes: ', error);
  }
}

//render public notes
function renderPublicNotes(notes) {
  const container = document.getElementById('homepageNotesContainer');
  container.innerHTML = '';

  notes.forEach(note => {
    const card = document.createElement('article');
    card.className = 'card note-card';
    //click listener to open pdf
    card.addEventListener( 'click', async () => {
        try {
          await fetch(
            `/api/notes/download/${note._id}`,
            {
              method: 'PATCH'
            }
          );

          window.open(`/${note.fileUrl}`, '_blank');
        }
        catch (error) {
          console.log(error);
        }
      }
    );
    
    card.innerHTML = ` <div class="note-card-preview">

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
      ).toUpperCase()}

                      </div>
                      <span class="note-card-author-name">
                      ${note.uploadedBy?.firstName || ''}

                      ${note.uploadedBy?.lastName || ''}
                      </span>
                      </div>
                      </div>
                      `;

    container.appendChild(card);
  });
  setupNoteCards();
}

// BUTTON ANIMATION
function setupButtonAnimations() {

  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      }
    );
    button.addEventListener('mouseleave',() => {
        button.style.transform = 'translateY(0px)';
      }
    );
  });
}
// FEATURE CARD EFFECT
function setupFeatureCards() {
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
      }
    );
    card.addEventListener( 'mouseleave', () => {
        card.style.transform = 'translateY(0px)';
      }
    );
  });
}
// NOTE CARD EFFECT
function setupNoteCards() {
  const noteCards = document.querySelectorAll('.note-card');
  noteCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.transition = '0.3s';
      }
    );
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0px)';
      }
    );
  });
}
// HERO FLOATING EFFECT
function setupHeroEffect() {
  const floatingCards = document.querySelectorAll('.floating-card');
  window.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      floatingCards.forEach(
        (card, index) => {
          const speed = (index + 1) * 12;
          const moveX = (x - 0.5) * speed;
          const moveY = (y - 0.5) * speed;
          card.style.transform = `translate(${moveX}px,${moveY}px)`;
        }
      );
    }
  );
}
// SCROLL REVEAL
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.feature-card, .note-card, .stat-box');
  revealElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(40px)';
    }
  );
  function reveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(element => {
        const top = element.getBoundingClientRect().top;

        if (top < windowHeight - 100) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0px)';
          element.style.transition = '0.6s ease';
        }
      }
    );
  }
  window.addEventListener('scroll', reveal);
  reveal();
}

// CTA BUTTON
function setupCTAButton() {
  const ctaButton = document.querySelector('.btn-white');
  if (!ctaButton) return;
  ctaButton.addEventListener('click', () => {
      alert('Welcome to StudyHub 🚀');
    }
  );
}

// SMOOTH SCROLL
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click',
        function (e) {
          e.preventDefault();
          const target = document.querySelector(
              this.getAttribute('href')
            );
          if (!target) return;
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      );
    });
}