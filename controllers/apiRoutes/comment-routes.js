const router = require('express').Router();
const { Comment } = require('../../models');

//get all comments
router.get('/', (req, res) => {
  Comment.findAll()
  .then(dbCommentData => res.json(dbCommentData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//post a comment
router.post('/', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request for user to post a comment', '\x1b[00m');
  console.log(`
  
  `);
  console.log(req.session);
  console.log("\x1b[33m", "checking the value of req.session.user_id", "\x1b[00m");
  console.log(req.session.user_id);
  console.log(req.body);

  if (req.session.user_id) {
    Comment.create(
      {
        ...req.body, user_id: req.session.user_id
      }
    )
    .then(dbCommentData => {
      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("there was a problem with your comment request");
    });
  } else if (!req.session.user_id || req.session.user_id === null) {
    res.status(400).json({message: 'You must be logged in to do that.'});
    return;
  }
});

//delete a comment
router.delete('/:id', (req, res) => {
  Comment.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json(
        {
          message: `no coment found with the id of ${req.params.id}`
        }
      );
      return;
    } else {
      res.json(dbCommentData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;