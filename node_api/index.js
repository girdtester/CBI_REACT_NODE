const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');



const session = require('express-session');
const { check, validationResult } = require('express-validator');

const app = express();
const flash = require('express-flash');
const querystring = require('querystring');

//added by renu
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({
  // Set the Access-Control-Allow-Headers header
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With.'],
  origin:'*'
}));

// end by renu

app.use(session({
  secret: 'mysecret', // use a secure secret
  resave: false,
  saveUninitialized: true,
}));

// other middleware and route handling code goes here
// create an express app
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const connection = require("./database/db");


const multer = require('multer');
const fs = require('fs');



app.use(express.urlencoded({ extended: true }));
var expressValidator = require('express-validator');

//Post Methods
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploaded_files/');
  }
});

const upload = multer({ storage: storage });
const path = require('path');
const router = express.Router();
app.use(require('connect-flash')());
app.use(flash());

//auth login,signin,password routes here
app.use(authRoutes);
// after login all routes goes here
app.use(userRoutes);

//
app.use(function(req, res, next) {
	
   header='Not found';
   const sessionData = req.session;
  res.render('404',{header,sessionData});
});

app.listen(process.env.port || 5000);
