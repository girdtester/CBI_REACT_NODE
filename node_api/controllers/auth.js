const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const multer = require('multer');
const fs = require('fs');
var expressValidator = require('express-validator');
const querystring = require('querystring');
const bcrypt = require('bcryptjs');
const connection = require("../database/db");

const tbl_user_permission = require('../models/tbl_user_permission');
const tbl_groups_users = require('../models/tbl_groups_users');



const nodemailer = require('nodemailer');
const crypto = require("crypto");
const sendgridTransport = require('nodemailer-sendgrid-transport');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
});


exports.loginpost = async (req, res, next) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT users.*,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON users.role = tbl_role_type.id WHERE users.email = $1 AND users.password = $2',
    [username, password],
    async (error, results) => {
		//console.log(results.rows[0]);
		
		
      if (error) {
       const message = 'An error occurred';
        return res.status(200).json({ message: message });
      } else if (results.rows.length > 0) {
        if(results.rows[0].is_active==0){
          req.flash('login_error', 'Your account is de-activated');
          return res.status(200).json({ message: 'Your account is de-activated' });
        }

        const loginHash =  results.rows[0].pass_crypt;
		
		//console.log(loginHash);
		
        const enteredPassword = req.body.password; 
        if(bcrypt.compare(enteredPassword, loginHash)){
         
          req.session.role = results.rows[0].role;
          req.session.users = results.rows[0];

          //console.log(req.session);
		  
		  const token = jwt.sign(
						{
						  email: results.rows[0].email,
						  userId: results.rows[0].id
						},
						'somesupersecretsecret',
						{ expiresIn: '8h' }
					  );
			// activity log
				let desc="Login by user id #"+results.rows[0].id;
                     
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Login",
							description:desc,
							user_id: results.rows[0].id,
							added_by: results.rows[0].id,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
        
        
        
          if(req.session.role==1){
            req.session.loggedIn = true;
			
			const test= await connection.query(
			  'UPDATE users SET token = $1 WHERE id = $2 returning *',
			  [token,results.rows[0].id]
			);
			
			const sessionData = {
			  role: results.rows[0].role_name,
			  users: test.rows[0],			  
			  loggedIn: true
			};
			
            return res.status(200).json({
				status: 'success',
				data: sessionData,
			  });
          }else{
          
         
          

			const groups = await connection.query(
			  'SELECT group_id FROM tbl_groups_users WHERE user_id = $1',
			  [results.rows[0].id]
			);

			
			const userGroups = groups.rows.map(row => row.group_id);
           
            
            req.session.users_groups = userGroups;

			//console.log(req.session);
         
            req.session.loggedIn = true;
			
            const test= await connection.query(
			  'UPDATE users SET token = $1 WHERE id = $2 returning *',
			  [token,results.rows[0].id]
			);
			
			const sessionData = {
			  role: results.rows[0].role_name,
			  users: test.rows[0],					
			  users_groups: userGroups,			  
			  loggedIn: true
			};
			
            
			return res.status(200).json({status: 'success',data: sessionData});
          } 
        }
      } else {
        const message = 'Invalid username or password';
        req.flash('login_error', 'Invalid username or password');
         return res.status(200).json({ message: 'Invalid username or password' });
      }
    }
  );
};



exports.sendpassword = async (req, res, next) => {
  const { username } = req.body;
  const token = crypto.randomBytes(20).toString("hex");
  connection.query(
    'SELECT * FROM users WHERE email = $1',
    [username],
    async (error, results) => {
      if (error) {
       const message = 'An error occurred';
        return res.status(200).json({ message: error.message});

      } else if (results.rows.length > 0) {
        
        const passwordResetLink = 'http://portal.cbiconsultants.com:3000/reset-password/' + username;
        try {
			const test= await connection.query(
			  'UPDATE users SET reset_token = $1 WHERE email = $2 returning *',
			  [token,username]
			);
          await sendPasswordResetEmail(username,test.rows[0].username, passwordResetLink, token);
        	
        	// activity log
        let desc;
        		if(req.body.userid !== undefined)
                {
                	 desc="Send reset password link in email id #"+username+ " of user id # "+test.rows[0].id+ " by  user id #"+ req.body.userid || test.rows[0].id;
                }
        		else
                {
                	 desc="Send reset password link in email id #"+username+ " of user id # "+test.rows[0].id+ " by  himself";
                }
				
                     
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Send Reset Password Link",
							description:desc,
							user_id: req.body.userid || test.rows[0].id,
							added_by: req.body.userid || test.rows[0].id,                       	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
        
		  return res.status(200).json({message: 'Password reset email sent'});
        } catch (error) {
          
		  return res.status(200).json({message: error.message});
        }
        


      } else {
        
        return res.status(200).json({message: 'email address not found'});
      }
    }
  );
};

async function sendPasswordResetEmail(email, name, passwordResetLink, token) {

try {	
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cristancarry@gmail.com',
    pass: 'pijpznwttvubpodl'
  }
});
  
  
  
 const send= transporter.sendMail({
          to: email,
          from: 'mailto:info@cbiportal.com',
          subject: 'Password reset',
          html: `<h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>You have requested a password reset. Please use the following link to reset your password:</p>
    <p><a href="http://portal.cbiconsultants.com:3000/reset-password/${token}">Password Reset link</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,</p>
    <p>Your Support Team</p>
           
          `
        });
		} catch (error) {
  console.error(error); // log the error message
  return res.status(200).json({message: error.message});
}
  
}

exports.resetpassword = async (req, res, next) => {
	const token = req.params.id;
	//console.log(token);
	const password = req.body.newPassword;
	try {	
		const test= await connection.query('SELECT * FROM users WHERE reset_token = $1',[token]);
				 
			//console.log((test.rows[0].id).length);		 
		if((test.rows[0].length) !== 0)
		{
					const hashedPw = await bcrypt.hash(password, 12);
					connection.query(
					  'UPDATE users SET  password = $1, pass_crypt= $2 WHERE reset_token = $3 returning *',
					  [password,hashedPw,token],async (error, results) => {
						  if(error) {return res.status(200).json({message: error.message}); }
						  else
						  {
							  const test= await connection.query(
								  'UPDATE users SET reset_token = $1 WHERE reset_token = $2 returning *',
								  ['',token]
								);
                          
                          		// activity log
                let desc="Reset password of user id #"+test.rows[0].id;

                        const activityData = { 
                            timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
                            event: "Reset Password",
                            description:desc,
                            user_id: test.rows[0].id,
                            added_by: test.rows[0].id,                        	
                            group_id: 0,                        							
                            upload_title: null,
                            folder_id:0
                      };
                  //console.log(activityData);
              connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
                    if (error) { return res.status(200).json({ message: error.message }); }
                  });
                          
                          
							  return res.status(200).json({message: 'Success'});
						  }

					  })

		}
		else
		{
			return res.status(200).json({message: 'Invalid reset link'});
		}
			
	} catch (error) {
  console.error(error); // log the error message
  return res.status(200).json({message: 'Invalid reset links'});
}	
	
}



