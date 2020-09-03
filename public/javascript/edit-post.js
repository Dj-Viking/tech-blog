const editFormHandler = async (event) => {
  try {
    event.preventDefault();
    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_url = document.querySelector('input[name="post-url"]').value.trim();
    const windowLoc = window.location.toString().split('/');
    const id = windowLoc[5];
    console.log(title);
    console.log(post_url);
    console.log(id);
    const response = await fetch(`/dashboard/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify(
        {
          title: title,
          post_url: post_url
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
document.querySelector('.edit-post-form')
.addEventListener('submit', editFormHandler);