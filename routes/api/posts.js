const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const  User = require('../../schemas/UserSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));


router.get('/',(req,res, next)=>{      
   
});

router.post('/', async(req,res, next)=>{        
  
});

    
module.exports = router;

