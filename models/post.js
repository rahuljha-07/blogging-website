//SCHEMA SETUP
var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
                                       name:String,
                                       image:String,
                                       description:String,
                                       author : {
                                                  id : {
                                                        type: mongoose.Schema.Types.ObjectId,
                                                        ref: "user"
                                                       },
                                                   username: String
                                                } ,
                                        comments : [
                                                     {
                                                       type: mongoose.Schema.Types.ObjectId,
                                                       ref: "comment"
                                                     }
                                                   ]
                                     });

module.exports = mongoose.model("post",postSchema);