const newFormHandler = async (event) => {
  try {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_url = document.querySelector('input[name="post-url"]').value.trim();

    console.log(title, post_url);
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
  } catch (error) {
    console.log(error);
  }
};
document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);