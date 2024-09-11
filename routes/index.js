var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    user     = require("../models/user");
 
//route route
router.get("/",function(req, res){
    res.render("landing");
 });

// show register form
router.get("/register", function(req, res){
    res.render("register");
})

//handle sign up logic
router.post("/register", function(req, res){
    var newuser = new user({username : req.body.username});
    user.register(newuser,req.body.password, function(err, user){
           if(err){
               req.flash("error", err.message);
             res.redirect("register");
           } else{
               passport.authenticate("local")(req, res ,function(){
                req.flash("success", "Welcome To Shitpost "+ user.username);   
                res.redirect("/posts");
               })
           }
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
     {
        successRedirect: "/posts",
        failureRedirect: "/login"
      }) ,function(req, res){
 });

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You Are Logged Out");
   res.redirect("/posts");
});

module.exports = router;