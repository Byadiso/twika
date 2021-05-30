const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const  User = require('../../schemas/UserSchema');
const  Post = require('../../schemas/PostSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));

router.put('/:userId/follow', async(req,res, next)=>{ 
    
    //    var userId = req.session.user._id;
    var userId= req.params.userId;

    var user = await User.findById(userId);

    if(user == null) return res.sendStatus(404);


    var isFollowing = user.followers && user.followers.includes(req.session.user._id);

    var option = isFollowing ? "$pull" : "$addToSet";

    // insert user like 
    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    });

     User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id }})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    });

    res.status(200).send(req.session.user);



 });


 
router.put('/:userId/following', async(req,res, next)=>{ 
    User.findById(req.params.userId)
    .populate()
    .then(results =>{
        res.status(200).send(results);  
    })
    .catch((error)=>{
        console.log(error);
        res.status(400);
    })
 });

 

router.post('/:id/retweet', async(req,res, next)=>{ 

    var postId = req.params.id;
    var userId = req.session.user._id;
    

    // try and retweet
    var deletedPost = await Post.findOneAndDelete({ postedBY: userId, retweetData: postId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);

    })

    // var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = deletedPost != null ?  "$pull" : "$addToSet";

    var repost = deletedPost;

    if(repost == null){
        repost = await Post.create({ postedBy: userId, retweetData: postId})
          .catch( error => {
              console.log(error);
              res.sendStatus(400);
          })
    }

    // insert user like 
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    // insert post like 
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
 });


 async function getPosts(filter){

     var results = await Post.find(filter)
     .populate("postedBy")
     .populate("retweetData")
     .populate("replyTo")
     .sort({ "createdAt": -1})
     .catch(error => console.log(error))

     results = await User.populate(results, {path : "replyTo.postedBy"});
     return await User.populate(results, {path : "retweetData.postedBy"});
 }


    
module.exports = router;

