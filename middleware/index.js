var post    = require("../models/post"),
    comment = require("../models/comment");
// all the middleware goes here

var middlewareobj = {};

middlewareobj.checkpostowner = function(req, res, next){
        // is user logged in?
        if(req.isAuthenticated()){
                                   //does user own the post?
                                   post.findById(req.params.id, function(err, foundpost){
                                   if(err){
                                           req.flash("error", "post not found");
                                           res.redirect("/posts");
                                          } else {
                                                  //does the user own the post?
                                                  if(foundpost.author.id.equals(req.user._id)) {
                                                       next();
                                                       } else {
                                                               req.flash("error", "you dont have permission for that");
                                                               res.redirect("back");
                                                              } 
                               
                                                  }
                                    });
                                  } else {
                                          req.flash("error", "need to be logged in");
                                          res.redirect("back");
                                          }
    }
    
middlewareobj.checkcommentowner = function(req, res, next){
        // is user logged in?
        if(req.isAuthenticated()){
                                  //does user own the post?
                                  comment.findById(req.params.comment_id, function(err, foundcomment){
                                          if(err){
                                                  res.redirect("/posts");
                                                 } else{
                                                         //does the user own the comment?
                                                         if(foundcomment.author.id.equals(req.user._id)) {
                                                                                    next();
                                                                                  } else {
                                                                                           req.flash("error", "you dont have permission to do that");
                                                                                           res.redirect("back");
                                                                                         }
          
                                                                }
                                                          });
      
                                    } else {
                                             req.flash("error", "need to be logged in");
                                             res.redirect("back");
                                            }
   }


middlewareobj.isloggedin = function(req,res,next){
    if(req.isAuthenticated()){
                              return next();
                             } else {
                                     req.flash("error", "you need to be login to to that");
                                     res.redirect("/login");
                                    }
}




module.exports = middlewareobj;