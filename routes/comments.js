var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    post       = require("../models/post"),
    comment    = require("../models/comment"),
    middleware = require("../middleware"); // no need to add index.js bc by default it adda itself

//comments new
router.get("/new" , middleware.isloggedin, function(req, res){
    // find post by id
    post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {post:post})
        }
    })
});

//comments create
router.post("/", middleware.isloggedin, function(req ,res){
 // loookup post using id
   post.findById(req.params.id, function(err , post){
          if(err){
              console.log(err);
              res.redirect("/posts");
           } else {
               //console.log(req.body.comment);
               comment.create(req.body.comment , function(err, comment){
                   if(err){
                       req.flash("error", "something went wrong");
                       console.log(err);
                   } else {
                       //add username and id to comment
                       comment.author.id =req.user._id;
                       comment.author.username =req.user.username;
                       //save comment
                       comment.save();
                       post.comments.push(comment);
                       post.save();
                       req.flash("success", "Comment Added");
                       res.redirect('/posts/' + post._id);
                   }
               });             
          }
   }); 
});

// edit comment route
router.get("/:comment_id/edit", middleware.checkcommentowner, function(req, res){
   comment.findById(req.params.comment_id, function(err, foundcomment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {post_id : req.params.id, comment: foundcomment});
       }
   });
});

// update comment route
router.put("/:comment_id", middleware.checkcommentowner, function(req, res){
     comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatecomment){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/posts/"+ req.params.id);
       }
     });
});

// destroy comment route
router.delete("/:comment_id", middleware.checkcommentowner, function(req, res){
        //find by id and remove
        comment.findByIdAndRemove(req.params.comment_id, function(err){
            if(err){
                res.redirect("back");
            } else{
                req.flash("success", "Comment Deleted");
                res.redirect("/posts/"+ req.params.id);
            }           
        });
});

module.exports = router;