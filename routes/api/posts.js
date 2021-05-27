const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const  User = require('../../schemas/UserSchema');
const  Post = require('../../schemas/PostSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req,res, next)=>{      
  var results = await getPosts({});
  res.status(200).send(results)
});



router.get('/:id', async (req,res, next)=>{   
    var postId = req.params.id;
    var results = await getPosts({_id: postId});
    results = results[0];
    res.status(200).send(results)

 });

router.post('/', async(req,res, next)=>{  
    if(!req.body.content){
        console.log("content param not sent with request ")
        return res.sendStatus(400);
    }      



    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    
    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo
    }
    Post.create(postData)
    .then( async newPost =>{
        newPost = await User.populate(newPost, { path: "postedBy" })
        res.status(201).send(newPost);
    })
    .catch(error =>{
        console.log(error);
        res.sendStatus(400);
    });
  
});



router.put('/:id/like', async(req,res, next)=>{ 
    
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";
    // insert user like 
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    // insert post like 
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
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

