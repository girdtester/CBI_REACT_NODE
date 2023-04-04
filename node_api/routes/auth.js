const express = require('express');
var app = express();
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
var expressValidator = require('express-validator');
const querystring = require('querystring');
//Post Methods
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploaded_files/');
  }
});

const cors = require('cors');

app.use(cors());

const upload = multer({ storage: storage });

const connection = require("../database/db");

const bcrypt = require('bcryptjs');

const User = require('../models/user');
const tbl_group = require('../models/tbl_group');
const tbl_group_files = require('../models/tbl_group_files');
const tbl_files = require('../models/tbl_files');
const authController = require('../controllers/auth');
const sendNotificationController = require('../controllers/send_notification_email');
const isAuth = require('../middleware/is-auth');
const sendEmailController = require('../controllers/send_email');



//after login check creditial
router.post('/loginpost',authController.loginpost);

//after forgot password send email
router.post('/sendpassword',cors(),authController.sendpassword);
router.post('/resetpassword/:id',authController.resetpassword);

//cron file

router.get('/send_notification_mail',sendNotificationController.send_notification_mail);

router.get('/send_email',sendEmailController.sendmail);

router.get('/', function(req, res) {
  //res.sendFile('login.html', {root: path.join(__dirname, '/user')});
  message='';
 /* const email = 'admin@gmail.com';
  const name = 'admin';
  const password = 'admin@13';
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const groupData = {
        username: email,
        username: name,
        password: password,
        pass_crypt: hashedPw,
      };
      connection.query('INSERT INTO users SET ?', groupData, function(error, results, fields) {
        if (error) throw error;
      });
       
    })*/
  let login_error = req.flash('login_error');
   res.render('login',{message,login_error});
});
module.exports = router;
