import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js';


function AddUser({ roleData , groupData}) {
	const [firstName, setFirstName] = useState([]);
	const [lastName, setLastName] = useState([]);
	const [role, setRole] = useState([]);	
	const [user_group, setSelectedGroup] = useState([]);
	const [email, setEmail] = useState([]);
	const [password, setPassword] = useState([]);
	const [confirmPassword, setConfirmPassword] = useState([]);
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
	
	
	const navigate = useNavigate();
	

	const handleSelectChange = (selectedOptions) => {
		const selectedValues = selectedOptions.map(option => option.value);
		setSelectedGroup(selectedValues);
	};


  
  
	const handleAddSubmit = async e => {
    e.preventDefault();
	if(password != confirmPassword)
	{
		setErrorMessage('Password and confirm does not match');
	}
	else
	{
		let user_groups = [];
		if(user_group.join(',') == 'All' || user_group == '')
		{
			for (let i = 0; i < groupData.length; i++) {
			  
				user_groups.push(groupData[i].id);
			  
			}
		}
		else
		{
			user_groups= user_group;
		}
		
		console.log(user_groups);
        
		try {
			const authToken = 'Bearer '+localStorage.getItem('token');
			console.log(authToken);
			
			const response = await axios.post(API_URL+'adduser', {
				firstName,
				lastName,
				email,
				role,
				password,
				user_groups
			}, {
			  headers: {
				Authorization: authToken,
			  }
			});
		  
		  
		  var result=response.data;
		  if(result.data != undefined)
		  {
			  setSuccessMessage(result.message);
			  window.location.reload();
			  
		  }
		  else
		  {
			  setErrorMessage(result.message);
		  }
  
		} catch (error) {
		  console.log(error.data.message);
		  setErrorMessage(error.message);
		}
	}
    }
	
const options = groupData.map((group) => ({
	value: group.id,
	label: group.name,
}));
	
 return (
 <div className="modal fade" id="adduserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
         <form onSubmit={handleAddSubmit}>
        <div className="row">
		<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">First Name</label>
                                            <input type="text" name="" placeholder="Enter first name" className="form-control"onChange={e => setFirstName(e.target.value)} required />
                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">Last Name</label>
                                            <input type="text" name="" placeholder="Enter last name" className="form-control" onChange={e => setLastName(e.target.value)} required />
                                        </div>
         </div>
         <div className="col-md-6">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">User Type</label>
                                             

                                             <select className="form-control" aria-label="Default select example" data-live-search="true" onChange={e => setRole(e.target.value)} required>
                                                        <option value="" selected>Select User Type</option>
														{roleData.map(item => (
															<option key={item.id} value={item.id}>
															  {item.role_name}
															</option>
														  ))}
                                                      </select>


                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">Email</label>
                                            <input type="text" name="" placeholder="Enter email" className="form-control" onChange={e => setEmail(e.target.value)} required/>
                                        </div>
         </div>
         <div className="col-md-6">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">Group</label>



<Select
  className="basic-select"
  classNamePrefix="select"
  options={options}
  value={options.filter(option => user_group.includes(option.value))}
  onChange={handleSelectChange}
  isMulti
  isSearchable={true}
  placeholder="Select an option"
/>


                                            
                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">New Password</label>
                                            <input type="password" name="" placeholder="Enter password" className="form-control" onChange={e => setPassword(e.target.value)} required/>
                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">Confirm Password</label>
                                            <input type="password" name="" placeholder="Enter confirm password" className="form-control" onChange={e => setConfirmPassword(e.target.value)} required/>
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

export default AddUser