/**
 * StudyHub - Authentication JavaScript
 * Handles login and signup functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Password visibility toggle
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Toggle eye icon
      const svg = this.querySelector('svg');
      if (type === 'text') {
        svg.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      } else {
        svg.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    });
  }

  // Login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Basic validation
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      // Simulate login (replace with actual API call)
      console.log('Login attempt:', { email });
      
      // For demo purposes, redirect to dashboard
      // window.location.href = '/pages/dashboard.html';
    });
  }

  // Signup form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const terms = document.querySelector('input[name="terms"]').checked;
      
      // Basic validation
      if (!firstName || !lastName || !email  || !password) {
        alert('Please fill in all required fields');
        return;
      }

      if (!terms) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        return;
      }

      if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }

      // Simulate signup (replace with actual API call)
      console.log('Signup attempt:', { firstName, lastName, email });
      
      // For demo purposes, redirect to dashboard
      // window.location.href = '/pages/dashboard.html';
    });
  }

  // // Social login buttons (placeholder functionality)
  // document.querySelectorAll('.social-btn').forEach(btn => {
  //   btn.addEventListener('click', function() {
  //     const provider = this.textContent.trim().replace('Continue with ', '');
  //     console.log(`${provider} login clicked`);
  //     alert(`${provider} login would be implemented here`);
  //   });
  // });
});
