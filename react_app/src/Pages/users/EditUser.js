import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js';


function EditUser({roleData,groupData,editSingleData,addedUserGroup  }) {
	
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
	const [formData, setFormData] = useState({ 
	    firstName: editSingleData.firstname, 
        old_firstName: editSingleData.firstname,
	    lastName: editSingleData.lastname,
        old_lastName: editSingleData.lastname,
		user_groups: editSingleData.user_groups,
        old_user_groups: editSingleData.user_groups,
		email: editSingleData.email,
        old_email: editSingleData.email,
		password: editSingleData.password,
        old_password: editSingleData.password,
		role: editSingleData.role,
        old_role: editSingleData.role,
	    id: editSingleData.id    
	  });

  useEffect(() => {
    setFormData({
		firstName: editSingleData.firstname,
        old_firstName: editSingleData.firstname,
		lastName: editSingleData.lastname,
        old_lastName: editSingleData.lastname,
		user_groups: editSingleData.user_groups,
        old_user_groups: editSingleData.user_groups,
		email: editSingleData.email,
        old_email: editSingleData.email,
		password: editSingleData.password,
        old_password: editSingleData.password,
		role: editSingleData.role,
        old_role: editSingleData.role,
		id: editSingleData.id      
		});
  }, [editSingleData]);

  const groupInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // const handleSelectChange = (e) => {
  //   const options = e.target.options;
// 	const { name, value } = e.target;
  //   const selectedValues = [];
  //   for (let i = 0; i < options.length; i++) {
  //     if (options[i].selected) {
  //       selectedValues.push(options[i].value);
  //     }
  //   }
  //   setFormData({ ...formData, [name]: selectedValues });
  // };

 
 const handleSelectChange = (selectedOptions) => {
  const selectedValues = selectedOptions.map((option) => option.value);
  setFormData({ ...formData, user_groups: selectedValues });
};

	const options_new = groupData.map((group) => ({
	value: group.id,
	label: group.name,
	}));
   


  const handleSubmit = async (event) => {
    event.preventDefault();
   if(event.target.password.value != event.target.confirm_password.value)
	{
		setErrorMessage('Password and confirm does not match');
	}
	else
	{
		
		let user_groups= [];
		if(formData.user_groups == undefined)
		{
			for (let i = 0; i < groupData.length; i++) {
					user_groups.push(groupData[i].id);  
			}
		}
		else
		{
			const suer = formData.user_groups;
		
			if(suer.join(',') == 'All')
			{
				for (let i = 0; i < groupData.length; i++) {  
					user_groups.push(groupData[i].id); 
				}
			}
			else
			{
				user_groups= formData.user_groups;
			}
		}
		formData.user_groups = user_groups; 
    try {

      const response = await axios.post(API_URL+`update_users`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
     
	  setErrorMessage(error.message);
    }
	}
  };

//set required attribute
const [inputAttributes, setInputAttributes] = useState({});
const handleRequired = async (event) => { 
	const value = event.target.value;
    const newAttributes = {};

    // Add any desired attributes here based on the input value
    if (value.length >= 1) {
      newAttributes.required = true;
    }
	else
	{
    	newAttributes.required = false;
	}
	console.log(newAttributes);
    setInputAttributes(newAttributes);
 }

 return (
<div className="modal fade" id="edituserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit User</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
         <form onSubmit={handleSubmit}>
        <div className="row">
		<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">First Name</label>
                                            
											<input type="text" name="firstName"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  value={formData.firstName} required />
                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">Last Name</label>
                                            <input type="text" name="lastName"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  value={formData.lastName} required />
                                        </div>
         </div>
         <div className="col-md-6">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">User Type</label>
                                            <select  className=" form-select form-control form-control" name="role"  onChange={handleInputChange} ref={groupInputRef}  value={formData.role} required="" >
																	
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
                                            <input type="text" name="email"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  value={formData.email} required/>
                                        </div>
         </div>
         <div className="col-md-6">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">Group</label>
                                            <Select
																						  className="basic-select"
																						  classNamePrefix="select"
																						  options={options_new}
																						 value={options_new.filter(option1 => formData.user_groups && formData.user_groups.includes(option1.value))}

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
                                            <input type="password" name="password"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  onKeyUp={handleRequired} {...inputAttributes}/>
                                        </div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
                                            <label className="bold mb-2">Confirm Password</label>
                                            <input type="password" name="confirm_password"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  {...inputAttributes}/>
                                        </div>
         </div>
         <div className="col-12 text-center">
            <button type="submit" className="btn btn-theme">Save changes</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>
)
}

export default EditUser