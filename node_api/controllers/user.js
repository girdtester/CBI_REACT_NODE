const express = require('express');
const router = express.Router();

const multer = require('multer');

const fs = require('fs');
var path = require('path');
const { check, validationResult } = require('express-validator');

const querystring = require('querystring');
const bcrypt = require('bcryptjs');
const connection = require("../database/db");
const User = require('../models/user');
const tbl_group = require('../models/tbl_group');
const tbl_group_files = require('../models/tbl_group_files');
const tbl_files = require('../models/tbl_files');
const tbl_role_type = require('../models/roles');


const flash = require('express-flash');
const app = express();
app.use(flash());


// group upload
exports.uploadfiles = async (req, res, next) =>  {
  res.set('Access-Control-Allow-Origin', '*');
	try{	
		const uploadedFiles = req.files;
		const group_uplod=req.body.groups;
		const files_name=req.body.files_name;
    	const files_title=req.body.files_title;
	
		const group_data= await connection.query('SELECT * FROM tbl_group WHERE id= $1',[group_uplod]);
		
		
		
		const folderData = {
			title: req.body.title,
			description: req.body.description,
			user_id: req.body.user_id,
			created_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
			group_id: req.body.groups,
		};
		
		
		connection.query('INSERT INTO tbl_upload_folders (title, description, user_id, created_date,is_active, is_deleted,group_id) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *', [folderData.title, folderData.description, folderData.user_id, folderData.created_date,'1','0',folderData.group_id],(err, result) => {
				if(err) 
				{ 
					return res.status(200).json({ message: err.message }); 
				}	
				
				const folderId = result.rows[0]['id'];
	
				for (let i = 0; i < uploadedFiles.length; i++) {
					const file = uploadedFiles[i];
					const fileData = {                   	
                    
						changed_name: req.body.files_name[i],	
                    	title: req.body.files_title[i],
						size: req.body.files_size[i],											
						file_name: file.filename,
						user_id: req.body.user_id,
						created_date: new Date().toISOString().slice(0, 19).replace('T', ' '), 
						type: file.mimetype.split('/')[1],						
						folder_id:folderId
					};
					
					//console.log(folderData);
					
					  if (req.body.files_title[i] !== undefined && req.body.files_title[i] !== null && req.body.files_title[i] !== ''){
					
					connection.query('INSERT INTO tbl_files (title,changed_name,file_name, user_id, created_date, type, is_active, is_deleted,folder_id, size) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) returning *', [fileData.title, fileData.changed_name, fileData.file_name, fileData.user_id, fileData.created_date, fileData.type,'1','0',fileData.folder_id,fileData.size],(error, results) => {				
						if(error) 
						{ 
							return res.status(200).json({ message: error.message }); 
						}					
						
				
						const groupData = {
							group_id: group_uplod,
							file_id: folderId
						  };
					
						connection.query('INSERT INTO tbl_group_files (group_id,file_id) VALUES ($1,$2) ', [groupData.group_id,groupData.file_id], function(error, results, fields) {
									if (error) { return res.status(200).json({ message: error }); }
								  });
					});
					
					// activity log				
				const description= "Upload "+file.originalname+" to "+group_data.rows[0].name;
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Upload",
							description:description,
							user_id: req.body.user_id,
							added_by: req.userId,
							file_name: file.originalname,
							group_id: group_uplod,
							upload_title: req.body.title,
							folder_id:folderId
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'notification'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
					  
				}

				}
				
        
      });
	 return res.status(200).json({message: 'success', data: req.body});
 }
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
	
}

exports.groupuploads = async (req, res, next) => {
 try {
  const userId = req.query.user_id;
  const page = req.query.page ? req.query.page : 1; // current page number
  const itemsPerPage = 20;
  const startIndex = (page - 1) * itemsPerPage;
  const selectedGroupIds = req.query.group_ids ? req.query.group_ids.split(',') : [];
  let data;
  let countQuery;
  let countParams;

   let whereClause = '';

   if (selectedGroupIds.length > 0) {
      whereClause = `AND tbl_upload_folders.group_id IN (${selectedGroupIds.join(',')})`;
   }

  if (userId === '1') {
    data = await connection.query(`
      SELECT tbl_upload_folders.*, tbl_group.name as group_name, tbl_group.is_active, users.username as uploaded_by
      FROM tbl_upload_folders
      LEFT JOIN tbl_group ON tbl_upload_folders.group_id = tbl_group.id
      LEFT JOIN users ON users.id = tbl_upload_folders.user_id
      WHERE tbl_upload_folders.is_deleted = 0 ${whereClause}
      ORDER BY tbl_upload_folders.id DESC
      LIMIT $1 OFFSET $2
    `, [itemsPerPage, startIndex]);

    countQuery = `
      SELECT COUNT(*) AS total_count
      FROM tbl_upload_folders
      WHERE is_deleted = 0 ${whereClause}
    `;
    countParams = [];
  } else {
    data = await connection.query(`
      SELECT tbl_upload_folders.*, tbl_group.name as group_name, tbl_group.is_active, users.username as uploaded_by
      FROM tbl_upload_folders
      LEFT JOIN tbl_groups_users ON tbl_upload_folders.group_id = tbl_groups_users.group_id
      LEFT JOIN tbl_group ON tbl_groups_users.group_id = tbl_group.id
      LEFT JOIN users ON users.id = tbl_upload_folders.user_id
      WHERE tbl_upload_folders.is_deleted = 0 AND tbl_groups_users.user_id = $1 ${whereClause}
      ORDER BY tbl_upload_folders.id DESC
      LIMIT $2 OFFSET $3
    `, [userId, itemsPerPage, startIndex]);

    countQuery = `
      SELECT COUNT(*) AS total_count
      FROM tbl_upload_folders
      LEFT JOIN tbl_groups_users ON tbl_upload_folders.group_id = tbl_groups_users.group_id
      WHERE tbl_upload_folders.is_deleted = 0 AND tbl_groups_users.user_id = $1 ${whereClause}
    `;
    countParams = [userId];
  }

  const totalItems = (await connection.query(countQuery, countParams)).rows[0].total_count;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const items = data.rows;

  let seconddata;
  if (req.body.users_groups !== undefined) {
    [seconddata] = await connection.query(`
      SELECT tbl_upload_folders.*, tbl_group.name as group_name, tbl_group.is_active, users.username as uploaded_by
      FROM tbl_upload_folders
      LEFT JOIN tbl_group ON tbl_upload_folders.group_id = tbl_group.id
      LEFT JOIN users ON users.id = tbl_upload_folders.user_id
      WHERE tbl_upload_folders.is_deleted = 0 AND group_id IN ($1)
      ORDER BY tbl_upload_folders.id DESC
    `, [req.body.users_groups]);
  } else {
    if (userId !== '1') {
      seconddata = await connection.query(`
        SELECT tbl_group.*
        FROM tbl_group
        LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id
        WHERE tbl_group.is_active = 1 AND tbl_groups_users.user_id = $1
      `, [userId]);
    } else {
      seconddata = await connection.query(`
        SELECT * FROM tbl_group WHERE is_active = 1
      `);
    }
  }
    
    const groups = seconddata.rows;
    const header = 'View Group Uploads';
    const successMessage = req.flash('success_msg');
    
    return res.status(200).json({
  currentPage: page,
  itemsPerPage,
  totalItems,
  totalPages,
  startIndex,
  endIndex: startIndex + items.length - 1,
  items,
  groups, // This is the array you are returning
  header,
  successMessage
});

  } catch (error) {
    console.error(error);
    res.status(200).json({ message: error.message });
  }
}

exports.edit_files = async (req, res, next) =>  {
	try{
		let data;
		if(req.userId != '1')
		{
			data = await connection.query(
			'SELECT tbl_group.* FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id  WHERE is_active = 1 and tbl_groups_users.user_id= $1',
			[req.userId]
			);
		}
		else
		{
			data = await connection.query('SELECT * FROM tbl_group WHERE is_active=1');
		}
    
    const id = req.params.id;
	console.log(id);
    const editdata = await connection.query(
    'SELECT * FROM tbl_upload_folders WHERE id = $1',
    [id]
    );
    const item = editdata.rows[0];
    header='Edit File';
    sessionData = req.session;
    res.status(200).json({ data:data.rows,item,header,sessionData});
	}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.update_files = async (req, res, next) =>  { 
try{
	const id = req.params.id;
	
	const { title, author } = req.body;
	
	const query =   'UPDATE tbl_upload_folders SET title = $1, description = $2, group_id = $3 WHERE id = $4 returning *';
    connection.query(query, [req.body.title, req.body.description,req.body.group_id,id], function (error, results, fields) {
         if (error) { return res.status(200).json({message:error.message}); }

          const description= " Title: "+req.body.title+" description: "+ req.body.description+" group: "+req.body.group_id;
           		  
		  connection.query('DELETE FROM tbl_group_files WHERE file_id = $1', [id]);
		  
		  const groupData = {
						group_id: req.body.group_id,
						file_id: id
					  };
					  
					  connection.query('INSERT INTO tbl_group_files (group_id,file_id) VALUES ($1,$2) ', 							[groupData.group_id,groupData.file_id], function(error, results, fields) {
						if (error) { return res.status(200).json({ message: error }); }
					  });
    
    
    			// activity log				
				let desc = "Update group uploads id # " + id;

				if (req.body.title !==  req.body.old_title) {
  					desc += " title, ";
				}

				if (req.body.description !== req.body.old_description) {
  					desc += " description, ";
				}

				if (req.body.group_id !== req.body.old_group_id) {
  					desc += " group ";
				}

    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Group uploads - Edit",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: req.body.group_id || 0,                        							
							upload_title: req.body.title || null,
							folder_id:id
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });

    
    
    
    	
         
          return res.status(200).json({ dassta:results.rows});
    });
}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.delete_files = async (req, res, next) =>  {
	
  const id = req.params.id;
  try {
    const file = await connection.query('SELECT * FROM tbl_upload_folders WHERE id= $1',[id]);
	
    if (!file) {
      return res.status(200).json({message:"File not found"});
       req.flash('success_msg', 'File not found');
    }
	await connection.query('UPDATE tbl_upload_folders SET is_deleted =1 WHERE id= $1',[id]);
    
    // activity log				
       let desc = "Delete group uploads id # " + id;    					
       const activityData = { 
             timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
             event: "Group uploads - Delete",
             description:desc,
             user_id: req.userId,
             added_by: req.userId,                        	
             group_id: req.body.group_id || 0,                        							
             upload_title: req.body.title || null,
             folder_id:id
        };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
              
              
              
				  });
  
    
    return res.status(200).json({ message:'File deleted successfully' });

  } catch (error) {
    return res.status(200).json({message:error.message});
  }

}

exports.group_upload_info = async (req, res, next) =>  {
  try{  
    const id = req.params.id;
	console.log(id);
    const editdata = await connection.query(
    'SELECT tbl_files.*, tbl_upload_folders.title as upload_title,tbl_upload_folders.user_id as uploader_id, tbl_upload_folders.description, tbl_upload_folders.created_date, users.username FROM tbl_files LEFT JOIN tbl_upload_folders ON tbl_upload_folders.id = tbl_files.folder_id LEFT JOIN users ON tbl_files.user_id = users.id WHERE tbl_upload_folders.id = $1 AND  tbl_files.is_deleted =0',
    [id]
    );
	
	console.log(editdata);
    const item = editdata.rows;
    header='Edit File';
    sessionData = req.session;
    res.status(200).json({ item,header});
	}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.updatesingle_files = async (req, res, next) =>  {  
  try{
    
    const id = req.body.id;
    const { title } = req.body;
	const file_data= await connection.query('SELECT * FROM tbl_files WHERE id= $1',[id]);
	const folder_data=  await connection.query('SELECT * FROM tbl_upload_folders WHERE id= $1',[file_data.rows[0].folder_id]);	
	const group_data= await connection.query('SELECT * FROM tbl_group WHERE id= $1',[folder_data.rows[0].group_id]);
	
    const query = 'UPDATE tbl_files SET changed_name = $1 WHERE id = $2 returning *';
  
    connection.query(query, [title,id], function (error, results, fields) {
      if (error) { 
        return res.status(200).json({message:error.message}); 
      }
      
      // activity log
		const description= "Update's title changed from "+file_data.rows[0].changed_name+" to "+title+ " at group uploads id # "+file_data.rows[0].folder_id;
		const activityData = { 
			timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
			event: "Uploads - Update title",
			description:description,
			user_id: file_data.rows[0].user_id,
			added_by: req.userId,
			file_name: file_data.rows[0].changed_name,
			group_id: folder_data.rows[0].group_id,
			upload_title: folder_data.rows[0].title,
			folder_id:file_data.rows[0].folder_id
	  };
		//console.log(activityData);
  
		connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'notification'], function(error, results, fields) {
			if (error) { return res.status(200).json({ message: error.message }); }
		  });
  
      
    });
  return res.status(200).json({ message: "success"});
  }
  catch (error) {
    console.error(error);
    res.status(200).json({ message: error.message });
  }
}

exports.download_filename = async (req, res, next) => {
  try {
    console.log(req.body);
    const fileId = req.body.file_id;

    for (let i = 0; i < fileId.length; i++) {
      const file = parseInt(fileId[i]);
	  console.log(i+'_'+file);
			const fildata = await connection.query(
				'SELECT tbl_files.*,tbl_upload_folders.title as upload_title,tbl_upload_folders.user_id as upload_by,tbl_upload_folders.group_id From tbl_files LEFT JOIN tbl_upload_folders ON tbl_upload_folders.id = tbl_files.folder_id WHERE tbl_files.id= $1',
				[file]
			  );
      
			const downloadData = {
			  userId: req.body.user_id,
			  fileId: fileId[i],
			  currentDateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
			  title: fildata.rows[0].title,
			  upload_title: fildata.rows[0].upload_title,
			  group_id: fildata.rows[0].group_id,
			  downloaded_by: req.body.user_id,
			  uploaded_by: fildata.rows[0].upload_by.toString(),
			  };
			  
			  connection.query(
			  'INSERT INTO tbl_download (user_id, file_id, current_datetime, title,upload_title, group_id, downloaded_by, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)',
			  [
			  downloadData.userId,
			  downloadData.fileId,
			  downloadData.currentDateTime,
			  downloadData.title,
			  downloadData.upload_title,
			  downloadData.group_id,
			  downloadData.downloaded_by,
			  downloadData.uploaded_by,
			  ],
			  (err, result) => {
			  if (err) {
				console.error(err);
			  } else {
				console.log(`File downloaded and download information inserted into database.`);
			  }
			  }
			  );
			  			  
			  // activity log	
				
				const group_data= await connection.query('SELECT * FROM tbl_group WHERE id= $1',[fildata.rows[0].group_id]);	
				const description= "Download "+fildata.rows[0].title+" file from "+group_data.rows[0].name;
				const activityData = { 
					timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
					event: "Uploads - Download",
					description:description,
					user_id: fildata.rows[0].user_id,
					added_by: req.userId,
					file_name: fildata.rows[0].title,
					group_id: fildata.rows[0].group_id,
					upload_title: fildata.rows[0].upload_title,
					folder_id:fildata.rows[0].folder_id
			  };
	  
		//console.log(activityData);
		  
		connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'notification'], function(error, results, fields) {
			if (error) { return res.status(200).json({ message: error.message }); }			
			
		  });
		  


    }

     const successMessage = 'Files downloaded successfully';
     res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

exports.delete_files_groups = async (req, res, next) =>  {
  const id = req.params.id;
  try {
    const file = await connection.query('SELECT * FROM tbl_files WHERE id= $1',[id]);
	
    if (!file) {
      return res.status(200).json({message:"File not found"});
       req.flash('success_msg', 'File not found');
    }
	await connection.query('UPDATE tbl_files SET is_deleted =1 WHERE id= $1',[id]);
  
  const folder = await connection.query('SELECT * FROM tbl_files WHERE folder_id = $1 and is_deleted = 0',[file.rows[0].folder_id]);
console.log(folder.rows);
if (folder.rows.length === 0) {
  await connection.query('UPDATE tbl_upload_folders SET is_active = 0 ,is_deleted = 1  WHERE id = $1', [file.rows[0].folder_id]);
}

  
  
    // activity log
		
		const folder_data= await connection.query('SELECT * FROM tbl_upload_folders WHERE id= $1',[file.rows[0].folder_id]);
		const group_data= await connection.query('SELECT * FROM tbl_group WHERE id= $1',[folder_data.rows[0].group_id]);	
		const description= "Delete "+file.rows[0].title+" from "+group_data.rows[0].name;
		const activityData = { 
			timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
			event: "Uploads - Delete",
			description:description,
			user_id: file.rows[0].user_id,
			added_by: req.userId,
			file_name: file.rows[0].changed_name,
			group_id: folder_data.rows[0].group_id,
			upload_title: folder_data.rows[0].title,
			folder_id:file.rows[0].folder_id
	  };
	  
  //console.log(activityData);
  
connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'notification'], function(error, results, fields) {
	if (error) { return res.status(200).json({ message: error.message }); }
	
	return res.status(200).json({message:'File deleted successfully'});
  });
  
    

  } catch (error) {
    return res.status(200).json({message:error.message});
  }

}

// end group upload section

// download
exports.downloadlogs = async (req, res, next) =>  {
  try {
    const itemsPerPage = 20; // number of items to display per page
    //const currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
    const currentPage = req.query.page ? req.query.page : 1; // current page number
    const offset = (currentPage - 1) * itemsPerPage;
    const query = `
      SELECT tbl_download.*, tbl_files.title, users.username, tbl_files.changed_name, tbl_files.type, tbl_files.created_date
      FROM tbl_download
      LEFT JOIN tbl_files ON tbl_download.file_id = tbl_files.id
      LEFT JOIN users ON tbl_download.downloaded_by = users.id
      ORDER BY tbl_download.current_datetime DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await connection.query(query, [itemsPerPage, offset]);
    const items = result.rows;
    const totalCount = await connection.query('SELECT COUNT(*) FROM tbl_download');
    const totalItems = parseInt(totalCount.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage; // starting index for the current page
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1); // ending index for the current page
    const header = 'Download logs';
    const sessionData = req.session;
    return res.status(200).json({
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      items,
      header,	
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: error.message });
  }
}
// end download log

//user section
exports.get_role = async (req, res, next) => {
	try {
		
		const results = await connection.query('SELECT * FROM tbl_role_type',[]);
		  if (results.rows.length === 0) {
			  // user not found
			  return res.status(200).json({ message: 'Data not found' });
			}
			else
			{
				
				return res.status(200).json({
				message: 'success',
				data: results.rows,
			  });
			}

		
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.users = async (req, res, next) =>  {
  
	try {
		
		const itemsPerPage = 20; // number of items to display per page
		const currentPage = req.query.page ? req.query.page : 1; // current page number
		const offset = (currentPage - 1) * itemsPerPage;
		const selectedGroupIds = req.query.group_ids ? req.query.group_ids.split(',') : [];


		
			let alldata;  
		if(selectedGroupIds.length > 0)
		{
			 alldata = await connection.query('SELECT users.*,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON users.role = tbl_role_type.id LEFT JOIN tbl_groups_users ON users.id = tbl_groups_users.user_id  WHERE users.is_active =1 AND tbl_groups_users.group_id = ANY($1::int[]) and users.id != 1 order by users.created_at DESC LIMIT $2 OFFSET $3',[selectedGroupIds,itemsPerPage, offset]);
		}
		else
		{
			 alldata = await connection.query('SELECT users.*,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON users.role = tbl_role_type.id  WHERE users.is_active =1 and users.id != 1 order by users.created_at DESC LIMIT $1 OFFSET $2',[itemsPerPage, offset]);
		}
		
		console.log(alldata);
		
		await Promise.all(alldata.rows.map(async (groupusers) => {
		  const result = await connection.query('SELECT tbl_group.name as group_name,tbl_group.id as group_id FROM tbl_groups_users LEFT JOIN tbl_group ON tbl_groups_users.group_id = tbl_group.id WHERE tbl_groups_users.user_id = $1',[groupusers.id]);
		  groupusers.groupDetails = result.rows;
		}));

	
		console.log(alldata.rows);
		let successMessage = req.flash('success_msg');
		
		
		const totalCount = await connection.query('SELECT COUNT(*) FROM users WHERE is_active=1 and id > 1');		
		const totalItems = parseInt(totalCount.rows[0].count);
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage; // starting index for the current page
		const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1); // ending index for the current page
	   
		const items = alldata.rows; // items for the current page
		
		let group;
		if(req.userId == 1)
		{
			 group = await connection.query('SELECT * FROM tbl_group WHERE is_active=1');	
		}
		else
		{			 
			 group = await connection.query('SELECT tbl_group.* FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id  WHERE tbl_group.is_active = 1 and tbl_groups_users.user_id= $1',[req.userId]);	
		}
		
		console.log(group);
		 header='Users';
		const sessionData = req.session;
		return res.status(200).json({
		currentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		startIndex,
		endIndex,
		items,
		groups:group.rows,
		header,
		successMessage
		}); 
	
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}

   
}

exports.add_user = async (req, res, next) => {
	
	try {		
		const user_groups= req.body.user_groups;
		let fileId='';
		const email = req.body.email;
		const username = req.body.firstName+' '+req.body.lastName;
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const password = req.body.password;
		const role = req.body.role;		
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(200).json({ message: 'Please input all data' });
		}
		
		const getdata= await connection.query('SELECT email From users WHERE email = $1 and is_active=1', [email]);
		//console.log(getdata.rows);
		if(getdata.rows != '')
		{
			return res.status(200).json({ message: 'Email id already exist' });
		}
		
		//console.log(user_permission);		
		bcrypt.hash(password, 12).then(hashedPw => {			
				const newUser = {
					username: username,
					email: email,				
					password: password,
					pass_crypt: hashedPw,
					created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),					
					is_active: '1',
					role: role,
					user_group: user_groups.join(','),
					firstname: firstName,
					lastname: lastName
				};
				
					
				connection.query('INSERT INTO users (username, email,  password, pass_crypt, created_at,  is_active, role, user_groups, firstname, lastname) VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9, $10) returning *', [newUser.username, newUser.email, newUser.password, newUser.pass_crypt, newUser.created_at,  newUser.is_active,  newUser.role, newUser.user_group, newUser.firstname, newUser.lastname], async (err, result) => {
					
					  if (err) {
						return res.status(200).json({ message: err });
					  } else {
						console.log(result);
							
								fileId = result.rows[0]['id'];					
								let group_names=[];
								
								const groupQueries = user_groups.map(async (group) => {
									const getGroup = await connection.query('SELECT * FROM tbl_group WHERE id = $1', [group]);
									const groupData = getGroup.rows[0];
									group_names.push(groupData.name);
									return connection.query('INSERT INTO tbl_groups_users (user_id, group_id,created_at,type) VALUES ($1, $2, $3,$4)', [fileId, groupData.id, new Date().toISOString().slice(0, 19).replace('T', ' '),'user']);
								});

								await Promise.all(groupQueries);
							
                       // activity log	
                      const getRole = await connection.query('SELECT * FROM tbl_role_type WHERE id = $1', [role]);
					  const role_name = getRole.rows[0].role_name; // Access the role name from the first row of the result

                      let desc = "Added user with first name " + firstName + ", last name " + lastName + ", email id " + email + ", user type " +                       role_name + " and groups- " + group_names.join(',');
				      
    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Users - Add",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
				
						return res.status(200).json({message: 'User added successfully', data: result.rows[0]});
				
					  }
				})			
		})
			
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.edit_users = async (req, res, next) =>  {
	try {
	const userid = req.params.id;
	
	console.log(userid);
	
	
	
	const userpermissiondata = await connection.query(
    'SELECT users.*,tbl_groups_users.group_id FROM users  LEFT JOIN tbl_groups_users ON users.id = tbl_groups_users.user_id WHERE users.id = $1',
    [userid]
    );	
	
	const groupusers = await connection.query(
		'SELECT tbl_groups_users.*, tbl_group.name as group_name FROM tbl_groups_users  LEFT JOIN tbl_group ON tbl_groups_users.group_id = tbl_group.id  WHERE user_id = $1',
		[userid]
		);
		
	const groupusersNotification = await connection.query(
		'SELECT tbl_users_notification.*, tbl_group.name as group_name FROM tbl_users_notification  LEFT JOIN tbl_group ON tbl_users_notification.group_id = tbl_group.id  WHERE user_id = $1',
		[userid]
		);
		
	const userData = {
						
						groupsUsers: groupusers.rows,						
						userpermissiondata: userpermissiondata.rows,						
					};
					
	return res.status(200).json({
		message: 'success',
		data: userData,
	  });
  }
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.update_users = async (req, res, next) => {
	
	try {
		
		const user_groups=req.body.user_groups;      
		const email = req.body.email;
		const username = req.body.firstName+' '+req.body.lastName;      
		const role = req.body.role;
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const ids = req.body.id;
		const password = req.body.password;
		const hashedPw = bcrypt.hash(password, 12);
		
		console.log(req.body);
		
		const errors = validationResult(req);
		  if (!errors.isEmpty()) {
			return res.status(200).json({ message: 'All fields required' });
		  }
    
    	const getdata= await connection.query('SELECT email From users WHERE email = $1 and is_active = 1 and id != $2', [email,ids]);
		//console.log(getdata.rows);
		if(getdata.rows != '')
		{
			return res.status(200).json({ message: 'Email id already exist' });
		}
    
    
       bcrypt.hash(password, 12).then(hashedPw => {		
		const query =   'UPDATE users SET username = $1, firstname = $2, lastname = $3, role = $4, user_groups = $5, email = $6, password = $7, pass_crypt= $8, updated_at = $9 WHERE id = $10 returning *';
		connection.query(query, [username,firstName,lastName,role,user_groups.join(','),email, password, hashedPw, new Date().toISOString().slice(0, 19).replace('T', ' '),ids], function (error, results, fields) {
			if (error)
			{
				return res.status(200).json({ message: 'All fields required' });
			}
		
			
			 connection.query('delete from tbl_groups_users WHERE user_id = $1',[ids]);
                            
        					
							for (let gr = 0; gr < user_groups.length; gr++) {
								const groupData = {
								  user_id: ids,
								  group_id: user_groups[gr],
								  created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), 
								};	

									

								 connection.query('INSERT INTO tbl_groups_users (user_id, group_id,created_at,type) VALUES ($1, $2, $3,$4)', [groupData.user_id, groupData.group_id, groupData.created_at,'user']);

								}
						
			// activity log	                     

                      let desc = "Update user id #" + ids;
        if (req.body.firstName !==  req.body.old_firstName) {
  desc += " first name, ";
}

if (req.body.lastName !== req.body.old_lastName) {
  desc += " last name, ";
}

if (req.body.user_groups !== req.body.old_user_groups) {
  desc += " user groups, ";
}
        
if (req.body.email !== req.body.old_email) {
  desc += " email id, ";
}
        
if (req.body.password !== req.body.old_password) {
  desc += " password, ";
}
        
if (req.body.role !== req.body.old_role) {
  desc += " user type ";
}
               				      
    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Users - Edit",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
				
					return res.status(200).json({message: 'success', data: results.rows});
			  
		});
		})
        
        
       
	
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
	
};

exports.get_users = async (req, res, next) =>  {
	try {
	
	const users = await connection.query('SELECT users.username,users.id,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON tbl_role_type.id = users.role WHERE is_active = 1 AND role != 1');
					
	return res.status(200).json({
		message: 'Fetched data successfully.',         
		message: 'success',
		data: users.rows,
	  });
  }
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.delete_users = async (req, res, next) =>  {
try{	
	const id = req.params.id;
	connection.query('UPDATE users SET is_active=0 WHERE id = $1 returning *', [id], function (error, results, fields) {
	if (error) 
	  {
		  return res.status(200).json({ message: 'Somthing wrong' });
	  }
	  else
	  {	
			connection.query('UPDATE tbl_groups_users SET is_active=0 WHERE user_id = $1 returning *', [id]);
      		// activity log				
       let desc = "Delete user id # " + id;    					
       const activityData = { 
             timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
             event: "Users - Delete",
             description:desc,
             user_id: req.userId,
             added_by: req.userId,                        	
             group_id: 0,                        							
             upload_title: null,
             folder_id:0
        };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
      
      
			return res.status(200).json({message: 'User deleted successfully', data: results.rows[0]});
	  }
	});
}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.set_user_group_notification = async (req, res, next) =>  {
  try{  
		
		const user_groups = req.body.user_groups;
		const added_by = req.userId;		
		const user_id = req.body.user_id;
		//console.log(req.body)

		
		
		for (let i = 0; i < user_groups.length; i++) {			
			
					 const query = 'UPDATE tbl_groups_users SET is_notification = $1 WHERE id= $2 returning *';
			
				connection.query(query, [1,user_groups[i]], function (error, results, fields) {
				  if (error) { 
					return res.status(200).json({message:error.message}); 
				  }
				})		
		}
		
		let str = user_groups; // input string
		//console.log(str);
		let strValues = str.map(Number).join(",");
		//console.log(strValues);

		  connection.query('UPDATE tbl_groups_users SET is_notification = $1 WHERE user_id = $2 and id NOT IN (' + strValues + ')returning *', [0,user_id], function (error, results, fields) {
				  if (error) { 
					return res.status(200).json({message:error.message}); 
				  }
				})
  
  			// activity log
				if (req.body.user_groups !==  req.body.old_user_groups) {
                     let desc = "Update user's id # " + user_id+ " send email notification email groups";
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Users - Edit send notification email group",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
                }

		
		 res.status(200).json({ message: 'Notification updated successfully' });
		
	}
	catch (error) {
		console.error(error);
		return res.status(200).json({ message: error.message });
	}
}

//groups
exports.submit_groups = async (req, res, next) => {
	
	try {		
		
		let fileId='';
		 const group_uplod = req.body.users;
		const group_name=req.body.group_name;
		
		//console.log(req.body);
		
		const errors = validationResult(req);
		  if (!errors.isEmpty()) {
			return res.status(200).json({ message: 'All fields required' });
		  }

		if(group_name!=''){
		  const fileData = {
			  name: group_name,
			  is_active: "1",
			  created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), 
		  };
		  
			//console.log(fileData);
			connection.query('INSERT INTO tbl_group (name, is_active, created_at) VALUES ($1, $2, $3) returning *', [fileData.name, fileData.is_active, fileData.created_at],(err, result) => {			
				if (err) {
					return res.status(200).json({ message: err });
				} 
				else {
					fileId = result.rows[0]['id'];	
					for (let gr = 0; gr < group_uplod.length; gr++) {
					const groupData = {
					  user_id: group_uplod[gr],
					  group_id: fileId,
					  created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), 
					};	

						

					 connection.query('INSERT INTO tbl_groups_users (user_id, group_id,created_at,type) VALUES ($1, $2, $3,$4)', [groupData.user_id, groupData.group_id, groupData.created_at,'group']);

					}
                
                	// activity log	                      
                      let desc = "Added group with group name " + group_name;
                		if (group_uplod != '') {
  									desc += " and assigned user id for this group #"+group_uplod.join(', ');
						}
				      
    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Groups - Add",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
                
					return res.status(200).json({message: 'Group added successfully', data: result.rows[0]});
				}
			});
		}
			
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.edit_groups = async (req, res, next) =>  {
	try {
		const groupid = req.params.id;
		
		const user = await connection.query('SELECT users.username,users.id,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON tbl_role_type.id = users.role WHERE is_active = 1 AND role != 1');
		
		
		const editdata = await connection.query(
		'SELECT tbl_group.*, users.username, tbl_groups_users.user_id,tbl_groups_users.group_id FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_groups_users.group_id = tbl_group.id LEFT JOIN users ON users.id = tbl_groups_users.user_id WHERE tbl_group.id = $1',
		[groupid]
		);
		
		const item = editdata.rows[0];
		
		const groupusers = await connection.query(
		'SELECT tbl_groups_users.*, users.username FROM tbl_groups_users  LEFT JOIN users ON users.id = tbl_groups_users.user_id WHERE tbl_groups_users.group_id = $1',
		[item['id']]
		);
	
		const userData = {
						users: user.rows,
						item: item,
						groupusers: groupusers.rows,						
					};
					
	return res.status(200).json({
		message: 'success',
		data: userData,
	  });
	
	
	
  }
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
}

exports.update_groups = async (req, res, next) =>  {
 try {
	const ids = req.body.id;
	const group_name=req.body.group_name;
    const group_uplod=req.body.users;
	
	const errors = validationResult(req);
		  if (!errors.isEmpty()) {
			return res.status(200).json({ message: 'All fields required' });
		  }
     
		connection.query('UPDATE tbl_group SET name = $1, updated_at = $2 WHERE id = $3 returning *', [group_name,new Date().toISOString().slice(0, 19).replace('T', ' '),ids], function (error, results, fields) {
		if (error) 
		  {
			  return res.status(200).json({ message: 'Somthing wrong' });
		  }
		  else
		  {	
          		if(group_uplod !== undefined)
                {
				  connection.query('DELETE FROM tbl_groups_users WHERE group_id = $1', [ids]);
					  
					for (let gr = 0; gr < group_uplod.length; gr++) {
					const groupData = {
					  user_id: group_uplod[gr],
					  group_id: ids,
					  created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), 
					};	

						

					 connection.query('INSERT INTO tbl_groups_users (user_id, group_id,created_at,type) VALUES ($1, $2, $3, $4)', 		                            [groupData.user_id, groupData.group_id, groupData.created_at,'group']);

					}
                }
          
          			// activity log	                      
                      let desc = "Update group id #" + ids;
                		if (req.body.group_name !== req.body.old_group_name) {
  									desc += " group name #"+req.body.group_name+", ";
						}
          				
          				if ((req.body.users).join(', ') !== (req.body.old_users).join(', ')) {
  									desc += " assigned user id #"+(req.body.users).join(', ');
						}
				      
    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Groups - Edit",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
                
          
					return res.status(200).json({message: 'Group updated successfully', data: results.rows[0]});
				  
		  }
		  
        });
      
   
    }
	catch (error) {
		console.error(error);
		res.status(200).json({ message: 'An error occurred' });
	}
	
}

exports.groups = async (req, res, next) =>  {
try {
	
	const itemsPerPage = 20; // number of items to display per page
    const currentPage = req.query.page ? req.query.page : 1; // current page number
    const offset = (currentPage - 1) * itemsPerPage;
	const selectedGroupIds = req.query.users_groups ? req.query.users_groups.split(',') : [];
	
	
	const alldata = connection.query('SELECT users.username,users.id,tbl_role_type.role_name FROM users LEFT JOIN tbl_role_type ON tbl_role_type.id = users.role WHERE is_active = 1 AND role != 1');
	
	
    console.log(selectedGroupIds.length);

     let data_user;
    if(selectedGroupIds.length > 0){
     data_user = await connection.query(
		  'SELECT tbl_group.* FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id WHERE tbl_group.is_active = 1 AND tbl_groups_users.group_id = ANY($1::int[])  GROUP BY tbl_group.id order by tbl_group.created_at DESC LIMIT $2 OFFSET $3',
		  [selectedGroupIds,itemsPerPage, offset]
		);
	  
    } else {
		if(req.userId != '1')
		{
			data_user = await connection.query(
			'SELECT tbl_group.* FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id  WHERE tbl_group.is_active = 1 and tbl_groups_users.user_id= $1 order by tbl_group.created_at DESC LIMIT $2 OFFSET $3',
			[req.userId,itemsPerPage, offset]
			);
		}
		else
		{
			data_user = await connection.query('SELECT * FROM tbl_group WHERE is_active=1 order by tbl_group.created_at DESC LIMIT $1 OFFSET $2',[itemsPerPage, offset]);
		}	
    }
	
	console.log(data_user);
	
	

    const grouplist=data_user.rows;
	
	

    const secondData = await connection.query('SELECT * FROM tbl_groups_users LEFT JOIN tbl_group ON tbl_groups_users.group_id = tbl_group.id LEFT JOIN users ON tbl_groups_users.user_id = users.id');
    data_user.rows.forEach(group => {
       group.files = secondData.rows.filter(file => file.group_id === group.id);
    });
	
	
	let groupdata;

	if(req.userId != '1')
	{
		
		 groupdata = await connection.query('SELECT * FROM tbl_groups_users LEFT JOIN tbl_group ON tbl_groups_users.group_id = tbl_group.id LEFT JOIN users ON tbl_groups_users.user_id = users.id WHERE tbl_groups_users.user_id = $1',[req.userId]);	
		 
	}
	else
	{
		
		 groupdata = await connection.query('SELECT * FROM tbl_group WHERE is_active=1');
		console.log(secondData);
		
	}
    
	
	const data = groupdata.rows;
	
	
    
    const totalCount = await connection.query('SELECT COUNT(*) FROM tbl_group where is_active=1');
    const totalItems = parseInt(totalCount.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage; // starting index for the current page
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1); // ending index for the current page
    const items = data_user.rows; // items for the current page
     header='Groups';
    const sessionData = req.session;
    let successMessage = req.flash('success_msg');
    res.setHeader('My-Header', 'some value');
    res.status(200).json({
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    items,
    data,
    header,
    data_user:grouplist,
    successMessage
    });
	
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
	
}

exports.delete_groups = async (req, res, next) =>  {
try{	
	const id = req.params.id;
	connection.query('UPDATE tbl_group SET is_active=0 WHERE id = $1 returning *', [id], function (error, results, fields) {
	if (error) 
	  {
		  return res.status(200).json({ message: 'Somthing wrong' });
	  }
	  else
	  {	
			connection.query('DELETE from tbl_groups_users WHERE group_id = $1 returning *', [id]);
      				// activity log	                      
                      let desc = "Delete group id #" + id;
                						      
    					console.log(desc);
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Groups - Delete",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
      
			return res.status(200).json({message: 'success', data: results.rows[0]});
	  }
	  
	})
}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}	
	
}

// activity logs
exports.activitylogs = async (req, res, next) =>  {
	try{
	  const itemsPerPage = 20; // number of items to display per page
	  const currentPage = req.query.page ? req.query.page : 1;  // current page number
	  const offset = (currentPage - 1) * itemsPerPage;
	  const data = await connection.query(
		'SELECT tbl_activity_log.*, users.username,users.role,tbl_role_type.role_name,tbl_group.name FROM tbl_activity_log LEFT JOIN users ON tbl_activity_log.added_by = users.id LEFT JOIN tbl_role_type ON users.role = tbl_role_type.id LEFT JOIN tbl_group ON tbl_activity_log.group_id = tbl_group.id ORDER BY tbl_activity_log.timestamp DESC LIMIT $1 OFFSET $2',[itemsPerPage,offset]
	  );
	  console.log(data);
		const items = data.rows;
		const totalCount = await connection.query('SELECT COUNT(*) FROM tbl_activity_log');
		const totalItems = parseInt(totalCount.rows[0].count);
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage; // starting index for the current page
		const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1); // ending index for the current page
	  header='Activity logs';
	  const sessionData = req.session;
	  res.status(200).json({
		currentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		startIndex,
		endIndex,
		items,
		header
	  });
	  
 }
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

//notification for user

exports.set_notification = async (req, res, next) =>  {
  try{  
		
		const is = req.body.id;
		const notification_value = req.body.notification_value;
		const target_value = req.body.target_value;
		//console.log(notification_value);
		let is_notification;
  		let desc;
		if(notification_value == 'All')
		{
			if(target_value == "on")
			{
				let query = 'UPDATE tbl_groups_users SET is_notification = $1 WHERE user_id= $2 returning *';
				
				let result= await connection.query(query, [1,is]);
				let group_id = result.rows.map(group => group.group_id);					
				
				desc = "ON users id #"+is+" group notification of group id #" +group_id;
				
			}
			else
			{
				let query = 'UPDATE tbl_groups_users SET is_notification = $1 WHERE user_id= $2 returning *';			
				let result=await connection.query(query, [0,is]);
				let group_id = result.rows.map(group => group.group_id);	
				  desc = "OFF users id #"+is+" group notification of group id #"+group_id;
				
			}
			
			
		}
		else
		{
			if(notification_value == 1)
			{
				 is_notification = 0;
			}
			else
			{
				 is_notification = 1;
			}
			
			let query = 'UPDATE tbl_groups_users SET is_notification = $1 WHERE id= $2 returning *';
			
			let results= await connection.query(query, [is_notification,is]);
			  if(is_notification === 0)
				{
					desc = "OFF users id #"+is+" group notification of group id #"+results.rows[0].group_id;
				}
				else
				{
					desc = "ON users id #"+is+" group notification of group id #"+results.rows[0].group_id;
				}
			
		}
		
		 	// activity log
				
                     
						const activityData = { 
							timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
							event: "Notifications - Edit by own",
							description:desc,
							user_id: req.userId,
							added_by: req.userId,                        	
                            group_id: 0,                        							
							upload_title: null,
							folder_id:0
					  };
				  //console.log(activityData);
			  connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'activitydata'], function(error, results, fields) {
					if (error) { return res.status(200).json({ message: error.message }); }
				  });
                
	
		res.status(200).json({ message: 'Notification updated successfully' });
		
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.notificationlogs = async (req, res, next) =>  {
	try{
	  const itemsPerPage = 20; // number of items to display per page
	  const currentPage = req.query.page ? req.query.page : 1;  // current page number
	  const offset = (currentPage - 1) * itemsPerPage;
	  let data;
	  let totalCount;
	  if(req.userId == '1')
	  {
		   data = await connection.query(
			'SELECT tbl_notification_log.*, users.username,tbl_group.name FROM tbl_notification_log LEFT JOIN users ON tbl_notification_log.action_by = users.id LEFT JOIN tbl_group ON tbl_notification_log.group_id = tbl_group.id ORDER BY tbl_notification_log.notify_date DESC LIMIT $1 OFFSET $2',[itemsPerPage,offset]
			);
			totalCount = await connection.query('SELECT COUNT(*) FROM tbl_notification_log');
	  }
	  else
	  {
		  //console.log("2");
		   data = await connection.query(
			'SELECT tbl_notification_log.*, users.username,tbl_group.name FROM tbl_notification_log LEFT JOIN users ON tbl_notification_log.action_by = users.id LEFT JOIN tbl_group ON tbl_notification_log.group_id = tbl_group.id WHERE tbl_notification_log.user_id = $1 ORDER BY tbl_notification_log.notify_date DESC LIMIT $2 OFFSET $3',[req.userId,itemsPerPage,offset]
			);
			
			totalCount = await connection.query('SELECT COUNT(*) FROM tbl_notification_log WHERE user_id =$1',[req.userId]);
		  
	  }
	  
	  
		const items = data.rows;
		
		
		//const totalItems = parseInt(data.rows.count);
		const totalItems = parseInt(totalCount.rows[0].count);
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage; // starting index for the current page
		const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1); // ending index for the current page
	  header='Notification logs';
	  const sessionData = req.session;
	  res.status(200).json({
		currentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		startIndex,
		endIndex,
		items,
		header
	  });
	  
 }
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

//extra api not use
exports.edit_group_upload_info = async (req, res, next) =>  {
  try{  
		const id = req.params.id;
		console.log(id);
		const query =   'UPDATE tbl_files SET changed_name = $1 WHERE id = $2 returning *';
		connection.query(query, [req.body.title,id], function (error, results, fields) {
         if (error) { return res.status(200).json({message:error.message}); }

          const description= " Title: "+req.body.title;
           const activityData = { 
				timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
				event: "File Updated",
				description:description,
				user_id: req.body.user_id,
				added_by: req.userId
		  };
          
    });
		
		res.status(200).json({ message:"Update successfully"});
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}

exports.delete_group_upload_info = async (req, res, next) =>  {
	
  try{ 
  
 const { file_id, folderId } = req.body;
    //console.log(file_id.length);
		let filename = [];
		for (let i = 0; i < file_id.length; i++) {
        
        	
			const file = parseInt(file_id[i]);			
			connection.query('UPDATE tbl_files SET is_deleted = 1 WHERE id = $1 returning *', [file], function (error, results, fields) {
				console.log(results.rows);
            		filename.push(results.rows[0].title);
					if (error) { return res.status(200).json({message:error.message}); }
					})
		
		}
		console.log(filename);
		const folder = await connection.query('SELECT * FROM tbl_files WHERE folder_id = $1 and is_deleted = 0',[parseInt(folderId)]);
			console.log(folder.rows.length);		
		if (folder.rows.length === 0) {
		    connection.query('UPDATE tbl_upload_folders SET is_active = 0 ,is_deleted = 1  WHERE id = $1', [parseInt(folderId)]);
		}
					
					
		
		
		
		// activity log
		
		const folder_data= await connection.query('SELECT * FROM tbl_upload_folders WHERE id= $1',[folderId]);
		const group_data= await connection.query('SELECT * FROM tbl_group WHERE id= $1',[folder_data.rows[0].group_id]);	
		const description= "Delete "+filename.join(", ")+" from "+group_data.rows[0].name;
		const activityData = { 
			timestamp:new Date().toISOString().slice(0, 19).replace('T', ' '), 
			event: "Uploads - Delete",
			description:description,
			user_id: folder_data.rows[0].user_id,
			added_by: req.userId,
			file_name: filename.join(", "),
			group_id: folder_data.rows[0].group_id,
			upload_title: folder_data.rows[0].title,
			folder_id:folderId
	  };
	  
  //console.log(activityData);
  
connection.query('INSERT INTO tbl_activity_log (timestamp, event, description, user_id, added_by,file_name,group_id,upload_title,folder_id,activity_type) VALUES ($1,	$2, $3, $4, $5,$6,$7,$8,$9,$10)', [activityData.timestamp, activityData.event, activityData.description, activityData.user_id, activityData.added_by,activityData.file_name,activityData.group_id,activityData.upload_title,activityData.folder_id,'notification'], function(error, results, fields) {
	if (error) { return res.status(200).json({ message: error.message }); }
	
	return res.status(200).json({message:'File deleted successfully'});
  });
  
	}
	catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}


exports.index = async (req, res, next) =>  { 
 try{
  let groups;
		if(req.userId != '1')
		{
			groups = await connection.query(
			'SELECT tbl_group.* FROM tbl_group LEFT JOIN tbl_groups_users ON tbl_group.id = tbl_groups_users.group_id  WHERE tbl_group.is_active = 1 and tbl_groups_users.user_id= $1',
			[req.userId]
			);
		}
		else
		{
			groups = await connection.query('SELECT * FROM tbl_group WHERE is_active=1');
		}
    header='Files';
    sessionData = req.session;
   return res.status(200).json({ data:groups.rows,header});
}
catch (error) {
		console.error(error);
		res.status(200).json({ message: error.message });
	}
}