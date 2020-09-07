const commentErrEl = document.querySelector('#comment-err');
const commentFormHandler = async (event) => {
  try {
    event.preventDefault();
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    const post_id = window.location.toString().split('/')[4].split('?')[0];
    if (!comment_text) {
      commentErrEl.classList.remove('hide-before-error');
      commentErrEl.classList.add('show-after-error');
    }
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify(
        {
          post_id: post_id,
          comment_text: comment_text
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response.json().then(json => console.log(json));
    response.ok ? document.location.reload() : console.log("There was an error"); console.log(response.statusText); setTimeout(()=>{commentErrEl.classList.remove('show-after-error');commentErrEl.classList.add('hide-before-error');},3000);
  } catch (error) {
    console.log(error);
  }
}
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);