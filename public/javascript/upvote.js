const upvoteClickHandler = async (event) => {
  try {
    event.preventDefault();
    const windowLoc = window.location.toString().split('/');
    const id = windowLoc[4];
    //console.log(id);
    const response = await fetch('/api/posts/upvote', {
      method: 'PUT',
      body: JSON.stringify(
        {
          post_id: id
        }
      ),
      headers:{'Content-Type': 'application/json'}
    });
    response.ok ? document.location.reload() : console.log("There was an error."); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.upvote-btn')
.addEventListener('click', upvoteClickHandler);