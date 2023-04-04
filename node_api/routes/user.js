const express = require('express');
var app = express();
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
var expressValidator = require('express-validator');
const querystring = require('querystring');
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

var path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'views');

//Post Methods
const cors = require('cors');

app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const folderPath = path.join(__dirname, '../uploaded_files', req.body.title);
    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  }
});


const { check, validationResult } = require('express-validator');
const upload = multer({ storage: storage });
const connection = require("../database/db");
const bcrypt = require('bcryptjs');
//Models used for run queries 
const User = require('../models/user');
const tbl_group = require('../models/tbl_group');
const tbl_group_files = require('../models/tbl_group_files');
const tbl_files = require('../models/tbl_files');
tbl_group_files.belongsTo(tbl_files, { as: 'file', foreignKey: 'file_id' });
//Is AUth is for is user logged in or not check middware
const isAuth = require('../middleware/is-auth');
//controller import here where actually logic return there
const userController = require('../controllers/user');

//make nodejs api by renu
router.get('/index',isAuth, userController.index);
router.post('/upload_files',isAuth,upload.array('files'),userController.uploadfiles);
router.get('/group-uploads',isAuth,userController.groupuploads);
//update  upload files
router.get('/edit/:id',isAuth,userController.edit_files);
router.post('/update_files/:id',isAuth,userController.update_files);
router.post('/updatesingle_files/:id',isAuth,userController.updatesingle_files);
router.get('/delete_files/:id',isAuth,userController.delete_files);
router.get('/group_upload_info/:id',isAuth,userController.group_upload_info);
router.post('/edit_group_upload_info/:id',isAuth,userController.edit_group_upload_info);
router.post('/delete_group_upload_info',isAuth,userController.delete_group_upload_info);
router.post('/download',cors(),isAuth,userController.download_filename);
router.get('/download-logs',isAuth,userController.downloadlogs);
router.get('/role',isAuth,userController.get_role);
router.get('/userslist',isAuth,userController.users);
router.post('/adduser',isAuth,check('email').isEmail(),userController.add_user);
router.get('/edit_users/:id',isAuth,userController.edit_users);
router.post('/update_users',isAuth,userController.update_users);
router.get('/get_users',isAuth,userController.get_users);
router.get('/delete_users/:id',isAuth,userController.delete_users);
router.get('/activity-logs',isAuth,userController.activitylogs);
router.get('/groups',isAuth,userController.groups);
router.post('/addgroup',isAuth,userController.submit_groups);
router.get('/edit_groups/:id',isAuth,userController.edit_groups);
router.post('/update_groups',isAuth,userController.update_groups);
router.get('/delete_groups/:id',isAuth,userController.delete_groups);
router.get('/delete_files_groups/:id',isAuth,userController.delete_files_groups);
router.post('/set_user_group_notification',isAuth,userController.set_user_group_notification);
router.post('/set_notification',isAuth,userController.set_notification);
router.get('/notification_log',isAuth,userController.notificationlogs);
//end api
module.exports = router;
