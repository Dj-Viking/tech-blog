const express = require('express');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection.js');

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require('./utils/helpers.js');
const exphbars = require('express-handlebars');
const hbars = exphbars.create({ helpers });
app.engine('handlebars', hbars.engine);
app.set('view engine', 'handlebars');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: ['Tha Secret Cookie Mang', 'which secret is it?'],
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore(
    {
      db: sequelize
    }
  )
};

app.use(
  session(sess)
);
app.use(
  express.json()
);
app.use(
  express.urlencoded(
    {
      extended: true
    }
  )
);
app.use(
  express.static(
    path.join(
      __dirname, 'public'
    )
  )
);
app.use(routes);

sequelize.sync(
  {
    force: false
  }
)
.then(
  () => {
    console.log('\x1b[33m', `Connecting Database...`, '\x1b[00m');
    app.listen(PORT, () => {
      console.log('\x1b[33m', `Now Listening on port ${PORT}!`, '\x1b[00m');
    });
  }
);
