Making route files requires those route files be included in the app.js file
You do this by app.get and app.use


const { Router } = require("express");

//Router for admin users - authenticated 
Router.get("/route", function(req, res, next){
     let token = req.cookies.jwt;
     if (token) {
          authService.verifyUser(token)
          .then(founderUser => {
               if (founderUser) {
                    if (founderUser.Admin) {
                    //Our statements for the route goes here
               } else {
                    res.send("Not an admin");
               }
          } else {
               res.send("Token was invalid")
          }
          })
     } else {
          res.send("token doesn´t exist")
     }
})

//Get all
router.get('/', function(req, res, next) {
});
//Get one
router.get('/:id', function(req, res, next) {
});
//Create one
router.post('/create', function(req, res, next) {
});
//Delete one
router.delete('/:id', function(req, res, next) {
});
//Update one
router.put('/:id', function(req, res, next) {
});

