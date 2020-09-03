const editFormHandler = async (event) => {
  try {
    event.preventDefault();
    const title = document.querySelector('input[name="post-title"]').value.trim();
    const windowLoc = window.location.toString().split('/');
    const id = windowLoc[windowLoc - 1];
    const response = await fetch(`/dashboard/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify(
        {
          title: title
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response.ok 
    ? document.location.reload() 
    : console.log("There was an error."); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('edit-post-form')
.addEventListener('submit', editFormHandler);