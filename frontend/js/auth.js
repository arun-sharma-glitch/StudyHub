/**
 * StudyHub - Authentication JavaScript
 * Handles login and signup functionality
 */

document.addEventListener('DOMContentLoaded', function () {

  // Password visibility toggle
  const togglePassword =
    document.getElementById('togglePassword')

  const passwordInput =
    document.getElementById('password')

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener('click', function () {

        const type =
          passwordInput.getAttribute('type')
            === 'password'
            ? 'text'
            : 'password'

        passwordInput.setAttribute(
          'type',
          type
        )

        const svg =
          this.querySelector('svg')

        if (type === 'text') {

          svg.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
          `

        } else {

          svg.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
          `

        }

      }
    )

  }

  // Login Form

  const loginForm =
    document.getElementById('loginForm')

  if (loginForm) {

    loginForm.addEventListener(
      'submit',

      async function (e) {

        e.preventDefault()

        const email =
          document
            .getElementById('email')
            .value
            .trim()

        const password =
          document
            .getElementById('password')
            .value

        if (!email || !password) {
          alert('Please fill all fields')
          return
        }
        console.log(
          'Login Attempt',
          { email }
        )

        // Login API 
        try {
          const response =
            await fetch('/api/auth/login',{ method: 'POST', headers: {'Content-Type':'application/json' },

                body: JSON.stringify({
                  email,
                  password
                })
              }
            )

          const data =
            await response.json()
          if (!response.ok) {
            throw new Error(
              data.message ||
              'Login Failed'
            )
          }
          console.log(
            'Login Success',
            data
          )

         
          window.location.href =
            '/dashboard'

        }
        catch (error) {
          console.error(error)
          alert(error.message)
        }
      }
    )
  }

  // Signup Form

  const signupForm =
    document.getElementById('signupForm')

  if (signupForm) {

    signupForm.addEventListener('submit', async function (e) {

        e.preventDefault()

        const firstName =
          document
            .getElementById('firstName')
            .value
            .trim()

        const lastName =
          document
            .getElementById('lastName')
            .value
            .trim()

        const email =
          document
            .getElementById('email')
            .value
            .trim()

        const password =
          document
            .getElementById('password')
            .value

        

        if (
          !firstName ||
          !lastName ||
          !email ||
          !password
        ) {

          alert(
            'Please fill all fields'
          )

          return

        }

        

        if (
          password.length < 8
        ) {

          alert(
            'Password must be at least 8 characters'
          )

          return

        }

        try {

          const userData =
            await registerUser(
              firstName,
              lastName,
              email,
              password
            )

          console.log(
            'User Registered',
            userData
          )

          alert(
            'Account Created Successfully'
          )

          window.location.href =
            '/login'

        }

        catch (error) {
          console.error(error)
          alert(error.message)
        }

      }

    )

  }

})


// Register API

async function registerUser(
  firstName,
  lastName,
  email,
  password
) {

  const response =
    await fetch(
      '/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json'
        },
        body:
          JSON.stringify({
            firstName,
            lastName,
            email,
            password
          })
      }
    );

  const data =
    await response.json()

  if (!response.ok) {

    throw new Error(
      data.message ||
      'Registration Failed',
      console.log('Registration Error', data)
    )

  }

  return data

}