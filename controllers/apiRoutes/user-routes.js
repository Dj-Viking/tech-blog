const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

//get all users
router.get('/', (req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to get all users', '\x1b[00m');
  User.findAll(
    {
      attributes: {
        exclude: ['password']
      }
    }
  )
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// get one single user
router.get('/:id', (req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to get a user by id', '\x1b[00m');
  User.findOne(
    {
      attributes: {
        exclude: ['password']
      },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: [
            'id', 'title', 'post_url', 'created_at'
          ]
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        },
        {
          model: Comment,
          attributes: [
            'id', 'comment_text', 'created_at'
          ],
          include: {
            model: Post,
            attributes: ['title']
          }
        }
      ]
    }
  )
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: `No user found with the id of ${req.params.id}`});
      return;
    } else {
      res.json(dbUserData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//add a user
router.post('/', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request to post a user', '\x1b[00m');
  console.log(`
  
  `);
    User.create(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      }
    )
    .then(dbUserData => {
      req.session.save(
        () => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          res.json(dbUserData);
        }
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("duplicate or wrong format");
    });
});

//user login post route
router.post('/login', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request user login', '\x1b[00m');
  console.log(`
  
  `);
  User.findOne(
    {
      where: {
        email: req.body.email
      }
    }
  )
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: `No user with the email ${req.body.email}`});
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect Password' });
      return;
    }

    req.session.save(
      () => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        console.log(req.session);
        res.json({user: dbUserData, message: "You are now logged in!"});
      }
    );
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//logout route, destroys sesison variables and resets the cookie
router.post('/logout', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request user logout', '\x1b[00m');
  console.log(`
  
  `);
  if (req.session.loggedIn) {
    req.session.destroy(
      () => {
        res.status(204).end();
      }
    );
  } else {
    res.status(404).end();
  }
});

//update a user's password
router.put('/:id', (req, res) => {
  console.log(`
  
  `)
  console.log('\x1b[33m', 'client request to update a user', '\x1b[00m');
  User.update(
    req.body,
    {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbUserData => {
    if (!dbUserData[0] === 0) {
      res.status(404).json({ message: `No user found with the id of ${req.params.id}`});
      return;
    } else {
      res.json(dbUserData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//delete a user
router.delete('/:id', (req, res) => {
  console.log(`
  
  `);
  console.log('\x1b[33m', 'client request to delete a user by id', '\x1b[00m');
  User.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({message: `No user found with the id of ${req.params.id}`});
      return;
    } else {
      res.json(dbUserData);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;