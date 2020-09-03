const router = require('express').Router();
const sequelize = require('../config/connection.js');
const { Post, User, Comment } = require('../models');

//get homepage
router.get('/', (req, res) => {
  console.log(`
  `);
  console.log("\x1b[33m", "checking the request session property object values", "\x1b[00m");
  console.log(req.session);
  Post.findAll(
    {
      attributes: [
        'id', 'post_url', 'title', 'created_at',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
          ), 'vote_count'
        ]
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
  .then(dbPostData => {
    console.log(`
    `);
    console.log("\x1b[33m", "homepage render", "\x1b[00m");
    console.log(`
    `);
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn
    });
  })  
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

//get login page
router.get('/login', (req, res) => {
  console.log(`
  `);
  console.log("\x1b[33m", "Client request for loginpage render", "\x1b[00m");
  console.log(`
  `);
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

//get a single post
router.get('/post/:id', (req, res) => {
  console.log(`
  `);
  console.log("\x1b[33m", "client request for single post", "\x1b[00m");
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
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json(
        {
          message: `No post found with the id of ${req.params.id}`
        }
      );
      return;
    }
    const post = dbPostData.get({ plain: true });
    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});
module.exports = router;