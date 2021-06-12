const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest:"uploads/" });
const path = require("path");
const fs = require("fs");

const  User = require('../../schemas/UserSchema');
const  Chat = require('../../schemas/ChatSchema');
const  Message = require('../../schemas/MessageSchema');
const  Notification = require('../../schemas/NotificationSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));



router.get('/', async(req,res, next)=>{ 
   
 Notification.find({ userTo: req.session.user._id, notificationType: { $ne: "newMessage"}})
 .populate("userTo")
 .populate("userFrom")
 .sort({ createdAt: -1})
 .then((results)=>res.status(200).send(results))
 .catch(error => {     
    console.log(error);
    res.sendStatus(400)

})

 });

 
module.exports = router;

