const commentFormHandler = async (event) => {
  try {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    console.log(comment_text, post_id);
    if (!comment_text) {
      window.alert("no comment written!");
      return;
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
    response.ok ? document.location.reload() : console.log("There was an error"); console.log(response.statusText);
  } catch (error) {
    console.log(error);
  }
}