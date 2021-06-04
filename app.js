const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('./database/db');

const session = require('express-session');




const middleware = require('./middleware');
const port = 3002;
const message = console.log('server listening on port ' + port);


app.set("view engine", "pug");
app.set("views", "views");

//for serving our static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "yes-yeso",
    resave: true,
    saveUninitialized: false
}));

//routes
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logout');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

//api Routes
const postsApiRoutes = require('./routes/api/posts');
const usersApiRoutes = require('./routes/api/users');





app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/uploads', uploadRoutes);

app.use('/posts', middleware.requireLogin, postRoutes);
app.use('/profile',  middleware.requireLogin, profileRoutes);

app.use('/api/posts', postsApiRoutes);
app.use('/api/users', usersApiRoutes);


app.get("/", middleware.requireLogin, (req,res, next)=>{

    var payload = {
        pageTitle:"Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payload)
});


// run our server 

const server = app.listen(port, ()=>{
    message;
});

