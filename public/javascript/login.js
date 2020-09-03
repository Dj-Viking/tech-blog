const signupFormHandler = async (event) => {
  try {
    event.preventDefault();
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').valuek.trim();
    const password = document.querySelector('#password-signup').value.trim();
    if (!username || !email || !password) throw new Error("Can't submit that in the form as credentials");
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(
        {
          username: username,
          email: email,
          password: password
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response.ok ? console.log("Thanks for logging in. Welcome Back!") : console.log("There was an error."); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.signup-form')
.addEventListener('submit', signupFormHandler);

const loginFormHandler = async (event) => {
  try {
    event.preventDefault();
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    if (!email || !password) throw new Error("Can't leave those fields blank.");
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(
        {
          email: email,
          password: password
        }
      ),
      headers: {'Content-Type': 'application/json'}
    });
    response.ok ? document.location.replace('/') : console.log("There was an error."); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.login-form')
.addEventListener('submit', loginFormHandler);