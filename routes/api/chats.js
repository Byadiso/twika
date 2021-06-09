const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest:"uploads/" });
const path = require("path");
const fs = require("fs");

const  User = require('../../schemas/UserSchema');
const  Post = require('../../schemas/PostSchema');
const  Chat = require('../../schemas/ChatSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));



router.post('/', async(req,res, next)=>{ 
   
    if(!req.body.users){
        console.log("users param not sent to the server with request ");
        return res.sendStatus(400);
    }

    var users= JSON.parse(req.body.users);

    
    if(users.length == 0){
        console.log("users array is empty ");
        return res.sendStatus(400);
    }


    users.push(req.session.user);

    var chatData = {
        users: users,
        isGroupChat: true
    };

    Chat.create(chatData)
    .then(chats=>res.status(200).send(chats))
    .catch(error => {
        console.log(error);
        res.sendStatus(4004)
    })
 });



 

router.get('/', async(req,res, next)=>{ 

    Chat.find({ users: { $elemMatch : {$eq: req.session.user._id} }})
    .populate("users")
    .then((results => res.status(200).send(results)))
    .catch(error =>{
        console.log(error);
        res.sendStatus(400)
    })    
 });

    
module.exports = router;

