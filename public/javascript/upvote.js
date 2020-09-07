const upvoteErrEl = document.querySelector('#upvote-err');
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
    if (response.ok){
      document.location.reload() 
    } else {
      console.log("There was an error."); 
      console.log(response.statusText);
      //piggybacking off of this resolved promise to sequence hiding and unhiding an element 
      Promise.resolve()
      .then(//show DOM error message
        ()=>{
          upvoteErrEl.classList.remove('hide-before-error');
          upvoteErrEl.classList.add('show-after-error');
        }
      ).then(//wait three seconds
        ()=>{
          // console.log("waiting 3 seconds");
          setTimeout(
            () => {
              // console.log("waited 3 seconds");
            }, 3000
          );
        }
      ).then(//hide DOM error message
        ()=>{
          setTimeout(
            () => {
              upvoteErrEl.classList.remove('show-after-error');
              upvoteErrEl.classList.add('hide-before-error');
            }, 3000
          );
        }
      )
      .catch(err => console.log(err));
    }
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);