import React, { useEffect, Component, useState } from 'react';
import { Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js';
import { Modal } from 'bootstrap';
	

function AddGroup({ userData }) {
	
	const [group_name, setGroupName] = useState([]);
	//const [users, setUserName] = useState([]);	
	const [user, setSelectedUsers] = useState([]);
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
	const navigate = useNavigate();
	
	const handleSelectChange = (selectedOptions) => {
	const selectedValues = selectedOptions.map(option => option.value);
	setSelectedUsers(selectedValues);
	};

  
	 	const handleAddSubmit = async e => {
    e.preventDefault();
	let users= [];
	if(user.join(',') == 'All')
	{
		for (let i = 0; i < userData.length; i++) {
		  
			users.push(userData[i].id);
		  
		}
	}
	else
	{
		users= user;
	}
	//console.log(users);
	
        
		try {
			const authToken = 'Bearer '+localStorage.getItem('token');
			console.log(authToken);
			
			const response = await axios.post(API_URL+'addgroup', {
			  users,
			  group_name
			}, {
			  headers: {
				Authorization: authToken,
			  }
			});

		  
		  var result=response.data;
		  console.log(result);
		  if(result.data != undefined)
		  {
			  
			  console.log(result);
			  setSuccessMessage(result.message);
			 window.location.reload();
			  
		  }
		  else
		  {
			  setErrorMessage(result.message);
		  }
		  
		  
  
		} catch (error) {
		  console.log(error.response.status);
		  if(error.response.status == 401)
		  {
			  setErrorMessage('User is not autherized, Please login again');
		  }
		  else
		  {
			  setErrorMessage(error.message);
		  }
		  
		}
    }


const options = userData.map((group) => ({
value: group.id,
label: group.username,
}));

 return (
<div className="modal fade" id="addgroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Add Group</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
	 
      <div className="modal-body">
	   
         <form onSubmit={handleAddSubmit}>
        <div className="row">
		
		<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
       
    </div>
	
         <div className="col-md-12">
		
            <div className="form-group">
                                            <label className="bold mb-2">Group Name</label>
                                            <input type="text" name="" placeholder="Enter group name" className="form-control" onChange={e => setGroupName(e.target.value)} required />
                                        </div>
         </div>
         <div className="col-md-12">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">Users</label>
                                             




<Select
  className="basic-select"
  classNamePrefix="select"
  options={options}
  value={options.filter(option => user.includes(option.value))}
  onChange={handleSelectChange}
  isMulti
  isSearchable={true}
  placeholder="Select an option"
/>



                                        </div>
         </div>
         
         <div className="col-12 text-center">
            <button type="submit" className="btn btn-theme">Add</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>


)
}

export default AddGroup