const postErrEl = document.querySelector('#post-err');
const newFormHandler = async (event) => {
  try {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_url = document.querySelector('input[name="post-url"]').value.trim();
    //console.log(title, post_url);
    if (!title || !post_url) {
      postErrEl.classList.remove('hide-before-error');
      postErrEl.classList.add('show-after-error');
    }
    const response = await fetch('/api/posts', {
      method: 'POST',
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
    if (response.ok) {
      document.location.replace('/dashboard');
    }
    console.log("There was an error.");
    console.log(response.statusText);
    setTimeout(() => {
      postErrEl.classList.remove('show-after-error');
      postErrEl.classList.add('hide-before-error');
    }, 3000);
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);