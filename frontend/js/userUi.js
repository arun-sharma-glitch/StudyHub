// Render User UI

function renderUser(user = null) {
    if (!user) return;

    const names = document.querySelectorAll('.name');
    const emails = document.querySelectorAll('.email');
    const avatars = document.querySelectorAll('.avatar');
    const bio = document.getElementById('bio');
    const university = document.getElementById('university-name');

    const fullName = `${user.firstName} ${user.lastName}`;

    names.forEach(ele => {ele.textContent = fullName });

    emails.forEach(ele => { ele.textContent = user.email || '' });

    avatars.forEach(ele => {
        ele.textContent = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    });

    if (bio) {
        bio.textContent = user.bio || 'No bio added'
    }

    if (university) { university.textContent = user.university || 'Not added' }
}