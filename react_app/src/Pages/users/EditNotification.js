import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js';

function EditNotification({ editSingleData,addedUserGroup}) {


	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
const [formData, setFormData] = useState({   
	user_groups: addedUserGroup.notification,
	old_user_groups: addedUserGroup.notification,
	assigned_groups: addedUserGroup,
    user_id: editSingleData.id    
  });

  useEffect(() => {
    setFormData({
		user_groups: addedUserGroup.notification,
    	old_user_groups: addedUserGroup.notification,
		assigned_groups: addedUserGroup,
		user_id: editSingleData.id       
    }); 
  }, [editSingleData]);

  const groupInputRef = useRef(null);

const handleSelectChange = (selectedOptions) => {
const selectedValues = selectedOptions.map((option) => option.value);
setFormData({ ...formData, user_groups: selectedValues });
};

const options_new = addedUserGroup.map((group) => ({
	value: group.id,
	label: group.group_name,
	}));


  const handleSubmit = async (event) => {
    event.preventDefault();
	let user_groups= [];
		console.log(formData.user_groups);
		
		if(formData.user_groups == undefined)
		{
			for (let i = 0; i < addedUserGroup.length; i++) {
				  
					user_groups.push(addedUserGroup[i].id);
				  
				}
		}
		else
		{
			console.log(formData.user_groups);	
			
			const suer = formData.user_groups;
			console.log(suer);
			if(suer.join(',') == 'All')
			{
				for (let i = 0; i < addedUserGroup.length; i++) {
				  
					user_groups.push(addedUserGroup[i].id);
				  
				}
			}
			else
			{
				user_groups= formData.user_groups;
			}
		}
		formData.user_groups = user_groups;
		
    try {

      const response = await axios.post(API_URL+`set_user_group_notification`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
        
      
	  var result=response.data;
		 
		  if(result.data != undefined)
		  {
			  
			  //console.log(result);
			  setSuccessMessage(result.message);
			  window.location.reload();
			  
		  }
		  else
		  {
			  setSuccessMessage(result.message);
			  window.location.reload();
		  }
	  
	 

    } catch (error) {
      console.error(error);
	  setErrorMessage(error.message);
    }
  };
  
  
 return (
<div className="modal fade" id="editnotificationModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit Notification</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
	  <form onSubmit={handleSubmit}>
	  
        <div className="row">
		<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
         <div className="col-md-12">
            <div className="form-group">
                                            <label className="bold mb-0">ID# : {formData.user_id}</label>
                                        </div>
         </div>
          <div className="col-md-12">
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

export default EditNotification