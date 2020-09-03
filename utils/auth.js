const withAuth = (req, res, next) => {
  !req.session.user_id ? res.redirect('/login') : next();
};

module.exports = {
  withAuth
};