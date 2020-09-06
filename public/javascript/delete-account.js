const deleteBtnHandler = async (event) => {
  try {
    event.preventDefault();
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    const response = await fetch(`/dashboard/delete-account/`, {
      method: 'DELETE',
      body: JSON.stringify(
        {
          email,
          password
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    response.ok ? document.location.replace('/') : console.log("There was an error"); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
}
document.querySelector('.login-form').addEventListener('submit', deleteBtnHandler);