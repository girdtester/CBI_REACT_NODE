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



exports.send_notification_mail = async (req, res, next) => {
  
  const token = crypto.randomBytes(20).toString("hex");
  
  await connection.query(
    'SELECT tbl_activity_log.*,users.username  as uploader_name FROM tbl_activity_log LEFT JOIN users ON tbl_activity_log.added_by = users.id WHERE tbl_activity_log.is_notify = 0 and tbl_activity_log.activity_type = $1',
    ['notification'],
	
    async (error, results) => {
		//console.log(results.rows);
      if (error) {
       const message = 'An error occurred';
        return res.status(200).json({ message: error.message});

      } else if (results.rows.length > 0) {
		try {
		  const result = results.rows;
			 for (let i = 0; i < result.length; i++) {
				 const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
				 connection.query('UPDATE tbl_activity_log SET is_notify = 1, notify_date=$1 WHERE id= $2 returning *', [timestamp,result[i].id]);			 
				 
					const imageLink = 'http://localhost:5000/uploaded_files/'+result[i].file_name;				
					
					const group_user= await connection.query('SELECT tbl_groups_users.*,users.email,users.username  FROM tbl_groups_users LEFT JOIN users ON tbl_groups_users.user_id = users.id WHERE tbl_groups_users.is_notification = 1 and tbl_groups_users.group_id= $1',[result[i].group_id]);
					
					let groupUser = [];
					
					for (let j = 0; j < group_user.rows.length; j++) {					
						
						groupUser.push(group_user.rows[j].user_id);
						const desc = `<p>Upload title : ${result[i].upload_title} </p>
										<p>Uploader/Downlaoder/Deleter Name : ${result[i].uploader_name} </p>
										<p>File name : ${result[i].file_name} </p>
										<p>Activity : ${result[i].description} </p>
										`;
														  
						    // activity log
								
								const activityData = { 
									timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
									event: result[i].event,
									description:result[i].description,
									user_id: group_user.rows[j].user_id,
									added_by: result[i].added_by,
									file_name: result[i].file_name,
									group_id: result[i].group_id,
									upload_title: result[i].upload_title,
									folder_id:result[i].folder_id,
							  };
								//console.log(activityData);
						  
								connection.query('INSERT INTO tbl_notification_log (notify_date, event, description, user_id, action_by,file_name,group_id,upload_title,folder_id) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id], function(error, results, fields) {
									if (error) { return res.status(200).json({ message: error.message }); }
								  });
					  
							sendNotificationEmail(group_user.rows[j].username, group_user.rows[j].email, imageLink, token, desc);
					  
					}
					
					 // activity log
             		if(groupUser.length > 0)
                    {
					let desc = "Send email notification of group id # " + result[i].group_id+ " to user id #"+groupUser.join(', ');
    					
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Send Email Notification",
							description:desc,
							user_id: 1,
							added_by: 1,                        	
                            group_id: result[i].group_id,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
				  
                    }

					
						
			}
			return res.status(200).json({message: 'email sent'});
        } catch (error) {
          
		  return res.status(200).json({message: error.message});
        }
        


      } else {
        
        return res.status(200).json({message: 'Something wrong'});
      }
    }
  );
};

async function sendNotificationEmail(name, email, imageLink, token,description) {
	console.log("1");

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
          subject: 'Notification Email',
          html: `<h1>File Changes Request</h1>
        <p>Hi ${name},</p>        
      `+description
        });
		} catch (error) {
  console.error(error); // log the error message
  return res.status(200).json({message: error.message});
}
  
}

