const deleteFormHandler = async (event) => {
  try {
    event.preventDefault();
    const windowLoc = window.location.toString().split('/');
    const id = windowLoc[windowLoc.length - 1];
    const response = await fetch(`/dashboard/edit/${id}`, {method: 'DELETE'});
    response.ok ? document.location.replace('/dashboard/') : console.log("There was an error"); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);