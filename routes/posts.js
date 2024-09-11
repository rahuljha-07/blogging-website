var express    = require("express"),
    router     = express.Router(),
    post       = require("../models/post"),
    middleware = require("../middleware"); // no need to add index.js bc by default it adda itself
 
 
 //index- show all posts
 router.get("/", function(req,res){
     // get all posts from db
     post.find({},function(err,allposts){
     if(err){
         console.log(err);
     } else {
         res.render("posts/index",{posts:allposts}); 
     }
      });
  });
 
 // create -add new posts to db
 router.post("/", middleware.isloggedin, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc  = req.body.description;
    var author ={
                 id: req.user._id,
                 username: req.user.username
                }
    var newposts = {name:name, image:image, description:desc, author:author};
    // crate a new post and save to db
    post.create(newposts,function(err,newlyCreated){
          if(err){
              console.log(err);
          } else{
              //redirect back to post page 
             res.redirect("/posts");  // the default is to redirect as get request
              //when we do redirect the default is to redirect 
         }
    });
 });
 
 //new- show form to create new post
 router.get("/new", middleware.isloggedin, function(req,res){
     res.render("posts/new");
  });
 
 //show- show us more info about that post
  router.get("/:id", function(req,res){
      // find the post with provided id
      post.findById(req.params.id).populate("comments").exec(function(err,foundPost){
              if(err){
                  console.log(err);
              } else {
                  // render show template with that post 
                  res.render("posts/show",{post:foundPost});
              }
      });
   }); 

 // edit post route
  router.get("/:id/edit", middleware.checkpostowner, function(req, res){
         post.findById(req.params.id, function(err, foundpost){
            res.render("posts/edit", {post:foundpost});
             });
        });
 
 // update post route  
 router.put("/:id", middleware.checkpostowner, function(req ,res){
        //find and update the correct post
        post.findByIdAndUpdate(req.params.id, req.body.post, function(err , updatedpost){
            if(err){
                res.redirect("/posts");
            } else{
               res.redirect("/posts/"+ req.params.id);
            }
        })
 });

// destroy post route
 router.delete("/:id", middleware.checkpostowner, function(req,res){
     post.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/posts");
         } else{
             res.redirect("/posts");
         }
     });
 });

module.exports = router;
  