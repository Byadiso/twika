const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require ("bcrypt");
const  User = require('../schemas/UserSchema');

const router = express.Router();

router.get('/',(req,res, next)=>{ 
    var payload =  {
    pageTitle:"inbox ",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    
};
    res.status(200).render("inboxPage", payload);
});


router.get('/',(req,res, next)=>{ 
    var payload =  {
    pageTitle:"new message ",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    
};
    res.status(200).render("newMessage", payload);
});

    
module.exports = router;

