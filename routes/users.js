var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

//display signup
router.get('/signup', function(req, res, next){
  res.render('signup')
});
//display login
router.get('/login', function(req, res, next){
  res.render('login')
});
//log user out
router.get('/logout', function(req, res, next){
  res.cookie('jwt', " ", { expires: new Date(0)});
  res.render('error', {message: 'you have been logged out'});
});


//Create new user if one doesn´t exist
router.post('/signup', function(req, res, next){
  models.users
  .findOrCreate({
    where: {
      Username: req.body.Username
    },
    defaults: {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: authService.hashPassword(req.body.Password),
      Admin: false, 
      Deleted: false
    }
  })
  .spread(function(result, created) {
    if (created) {
      res.redirect('login');
    } else {
      res.redirect('error', {message:'this user exists'});
    }
 });
});
//log user in
router.post('/login', function(req, res, next){
  models.users.findOne({
    where: {Username: req.body.Username}
  }).then(user => {
    if(!user){
      return res.redirect('error', {message:'login failed'});
    } else {
      let passwordMatch = authService.comparePasswords(req.body.Password, user.Password);
      if(passwordMatch){
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        res.redirect('profile');
      } else {
        res.render('error', {message:'wrong password'})
      }
    }
  });
});

//get users profile
router.get('/profile', function(req, res, next){
  let token = req.cookies.jwt;
  if(token){
    authService.verifyUser(token).then(user => {
      if(user){
        let status = 'Normal'
        if(user.Admin){
          status = 'Administrator'
        }
        models.posts.findAll({
          where: {UserId: user.UserId, Deleted: false}
        }).then(posts =>{
          res.render('profile', {
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            UserId: user.UserId,
            Username: user.Username,
            userAccess: user.Admin, 
            status: status, 
            posts
          });
        })
      } else {
        res.render('error', {message: 'invalid token'});
      }
    })
  } else {
    res.render('error', {message: 'you are not logged in'});
  }
});
//get users for admin
router.get('/admin/', function(req, res, next){
  let token = req.cookies.jwt;
  if(token){
    authService.verifyUser(token).then(user => {
      if(user.Admin){
        models.users.findAll({
          where: {Deleted: false}
        }).then(users => {
          res.render('users', {users:users})
        })
      } else {
        res.render('error', {message: 'you are not authorized'})
      }
    })
  } else {
    res.render('error', {message: 'you are not logged in'})
  }
});
//display profile
router.get('/profile', function(req, res, next){
  res.render('profile');
});
//GET A SINGLE USER FOR ADMIN
router.get('/admin/editUser/:id', function(req, res, next){
  let token = req.cookies.jwt;
  if(token){
    authService.verifyUser(token).then(user => {
      if(user && user.Admin){
        models.users.findByPk(parseInt(req.params.id))
        .then(userFound => {
          let status = 'normal'
          if(userFound.Admin){
            status = 'Administrator'
          }
          res.render('user', {
            FirstName: userFound.FirstName,
            LastName: userFound.LastName,
            Email: userFound.Email,
            Username: userFound.Username,
            UserId: userFound.UserId,
            status: status
          });
        });
      } else {
        res.render('error', {message: 'you are not authorize'});
      }
    });
  }
});
//Delete users for admin
router.post('/delete/:id', function(req, res, next){
  let token = req.cookies.jwt;
  if(token) {
    authService.verifyUser(token).then(user => {
      let userId = parseInt(req.params.id);
      if (user){
        models.users.update({
          Deleted: true
        }, {
          where: {
            UserId: userId
          }
        }).then(function(result){
          if(result){
            res.redirect('/users/profile');
          } else {
            res.send('user can not be deleted');
          }
        });
      }
    });
  }
});
module.exports = router;
