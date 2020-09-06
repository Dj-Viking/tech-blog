const router = require('express').Router();
const sequelize = require('../config/connection.js');
const { Post, User, Comment } = require('../models');
const { withAuth } = require('../utils/auth.js');

//get all posts on the dashboard page
router.get('/', withAuth, (req, res) => {
  console.log(`
  `);
  console.log("\x1b[33m", "client request to get to the dashboard", "\x1b[00m");
  console.log(`
  `);

  Post.findAll(
    {
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id', 'post_url', 'title', 'created_at',
        [sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
        ), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id', 'comment_text', 'post_id', 'user_id', 'created_at'
          ],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    }
  )
  .then(dbPostData => {
    const posts = dbPostData.map(post => post.get({ plain: true }));
    
    console.log(posts);
    res.render('dashboard', {
       posts, 
       loggedIn: true
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//get a single post on the dashboard page
router.get('/edit/:id', withAuth, (req, res) => {
  console.log(`
  `);
  console.log("\x1b[33m", "client request to get to edit-post page", "\x1b[00m");
  console.log(`
  `);

  Post.findOne(
    {
      where: {
        id: req.params.id
      },
      attributes: [
        'id', 'post_url', 'title', 'created_at',
        [sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
        ), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id', 'comment_text', 'post_id', 'user_id', 'created_at'
          ],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    }
  )
  .then(editPostData => {
    const post = editPostData.get({ plain: true });

    res.render('edit-post', 
      {
        post,
        loggedIn: true
      }
    );
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//get delete account page
router.get('/delete-account', withAuth, (req, res) => {
  console.log(req.session);
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request to get delete account page', '\x1b[00m');
  console.log(`
  
  `);
  User.findOne(
    {
      where: {
        id: req.session.user_id
      }
    }
  )
  .then(dbUserData => {
    console.log(dbUserData);

  })
  .catch(err => console.log(err));
  res.render('delete-account', {
    loggedIn: true,
    user_id: req.session.user_id
  });
});
//delete user account
router.delete('/delete-account/', withAuth, (req, res) => {
  console.log('\x1b[33m', 'checking request session before destroy', '\x1b[00m');
  console.log(req.session);
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request to get delete user account', '\x1b[00m');
  console.log(`
  
  `);
  if (req.body.email) {
    User.findOne(
      {
        where: {
          email: req.body.email
        }
      }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({message: `there was an error try again`});
        return;
      }
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({message: 'Incorrect Password' });
        return;
      }
      if (req.session.loggedIn) {
        req.session.destroy(
          () => {
            res.status(204).end();
          }
        );
      }
      console.log('\x1b[33m', 'checking req.session after destroy', '\x1b[00m');
      console.log(req.session);
      User.destroy(
        {
          where: {
            email: req.body.email
          }
        }
      );  
    })
    .catch(err => console.log(err));
  } else {
    res.status(500).json({message: "no email sent"});
  }
});

//edit a post from dashboard page
router.put('/edit/:id', withAuth, (req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to update a post title by id ', '\x1b[00m');
  Post.update(
    {
      title: req.body.title,
      post_url: req.body.post_url
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
      res.json(dbPostData).render('edit-post',
        {
          post: dbPostData.get({plain: true}),
          loggedIn: true
        }
      );
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//delete a post from the dashboard page
router.delete('/edit/:id', withAuth, (req, res) => {
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
          message: 'No post found with this id.'
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