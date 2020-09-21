var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var models = require('../models');
var authService = require('../services/auth');

router.get('/create', function(req, res, next){
     res.render('create');
});
//create a new post
router.post('/create', function(req, res, next){
     let token = req.cookies.jwt;
     if (token){
          authService.verifyUser(token).then(user =>{
               if(user){
                    models.posts.findOrCreate({
                         where: {PostTitle: req.body.PostTitle},
                         defaults: {
                              PostBody: req.body.PostBody,
                              UserId: user.UserId,
                              Deleted: false
                         }
                    }).spread(function(result,created){
                         if(created){
                              res.redirect('/users/profile');
                         } else {
                              res.render('error',{message:'this post already exists'})
                         }
                    });
               }
          });
     }
});

// router.get('/editPost', function(req, res, next){
//      res.render('editPost');
// });
router.post('/update/:id', function(req, res, next){
     let token = req.cookies.jwt;
     if(token){
          authService.verifyUser(token).then(user =>{
               let postId = parseInt(req.params.id);
               if (user){
                    models.posts.update({
                         PostTitle: req.body.PostTitle,
                         PostBody: req.body.PostBody,
                         Deleted: false
                    }, {
                         where: {PostId: postId}
                    }).then(function(result){
                         if(result){
                              res.redirect('/users/profile')
                         } else {
                              res.send('Post can not be deleted')
                         }
                    });
               }
          });
     }
});

router.post('/delete/:id', function(req, res, next){
     let token = req.cookies.jwt;
     if(token){
          authService.verifyUser(token).then(user => {
               let postId = parseInt(req.params.id);
               if(user){
                    models.posts.update({
                         Deleted: true
                    }, {
                         where: {
                              PostId: postId
                         }
                    }).then(function(result){
                         if(result){
                              res.redirect('/users/profile')
                         } else {
                              res.send('post can not be deleted')
                         }
                    });
               }
          });
     }
});
//get all of the users posts in the database
router.get('/posts', function(req, res, next){
     if (token){
          authService.verifyUser(token).then(user =>{
               if(user){
                    models.users.findAll({
                         where: {
                              Deleted: false
                         }, include: {
                              model:models.posts
                         }
                    }).then(usersPosts => {
                         if(user.Admin){
                              let status = 'Administrator'
                              if(user){
                                   let status = 'normal user'
                              }
                              res.render('admin', {
                                   usersPosts,
                                   userAccess: user.Admin,
                                   user, 
                                   status
                              })
                         }
                    })
               } else {
                    res.render('error', {message: 'something went wrong'})
               }
          });
     }
});
module.exports = router;