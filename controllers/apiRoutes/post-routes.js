const router = require('express').Router();
const sequelize = require('../../config/connection.js');
const { Post, User, Vote, Comment } = require('../../models');
const { withAuth } = require('../../utils/auth.js');

//get all posts
router.get('/', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request for all posts by users', '\x1b[00m');
  Post.findAll(
    {
      attributes: [
        'id','post_url','title','created_at',
        [sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
        ), 'vote_count']
      ],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: [
            'id', 'comment_text', 'post_id', 'user_id'
          ],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    }
  )
  .then(dbPostData => {
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//get one single post
router.get('/:id', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request for all posts by a single user_id', '\x1b[00m');
  Post.findOne(
    {
      where: {
        id: req.params.id
      },
      attributes: [
        'id', 'post_url', 'title', 'created_at',
        [sequelize.literal(
          '(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'
        ), 'vote_count']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    }
  )
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json(
        {
          message: 'No post found with this user id'
        }
      );
      return;
    } else {
      res.json(dbPostData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//create a post, user_id must be included
router.post('/', withAuth, (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request for user to make a post', '\x1b[00m');
  //console.log(req.body);
  Post.create(
    {
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.session.user_id
    }
  )
  .then(dbPostData => {
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//put an update on a post with an upvote
//user_id is who is voting and post_id is the post the user is voting on
router.put('/upvote', withAuth, (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request for user to make an upvote on a post', '\x1b[00m');
  console.log(`
  
  `);
  if (req.session) {
    Post.upvote(
      {
        ...req.body, user_id: req.session.user_id
      },
      {
        Vote
      }
    )
    .then(updatedPostData => {
      res.json(updatedPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  } 
});

//update a post title
router.put('/:id', withAuth,(req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to update a post title by id ', '\x1b[00m');
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbPostData => {
    if (dbPostData[0] === 0 || !dbPostData) {
      res.status(404).json(
        {
          message: `No post found with the id of ${req.params.id}`
        }
      );
      return;
    } else {
      res.json(dbPostData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//delete a post by id
router.delete('/:id', withAuth, (req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to delete a post', '\x1b[00m');
  Post.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json(
        {
          message: `No post found with the id of ${req.params.id}`
        }
      );
      return;
    } else {
      res.json(dbPostData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  }); 
});

module.exports = router;