const express = require('express');
const router = express.Router();

const ensureAuthenticated = (req,res,next) => {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
};

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
