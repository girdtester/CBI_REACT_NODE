import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js'; 
import { Modal } from 'bootstrap';



function EditGroup({  userData, editSingleData, addedUserGroup,fetchData  }) { 

  const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
	const [formData, setFormData] = useState({ 
	group_name: editSingleData.name, 
    old_group_name: editSingleData.name, 
	users: editSingleData.groupUsers || [],
    old_users: editSingleData.groupUsers || [],
	id: editSingleData.id    
	});

  useEffect(() => {
    setFormData({
       group_name: editSingleData.name,  
    	old_group_name: editSingleData.name, 
    users: editSingleData.groupUsers,
    old_users: editSingleData.groupUsers,
    id: editSingleData.id    
    });
   fetchData();
  }, [editSingleData]);

  const groupInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  
	const options_new = userData.map((group) => ({
	value: group.id,
	label: group.username,
	}));



  // const handleSelectChange = (e) => {
  //   const options = e.target.options;
	// const { name, value } = e.target;
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
  setFormData({ ...formData, users: selectedValues });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
		
//console.log(formData);
	 try {

      const response = await axios.post(API_URL+`update_groups`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
        
      console.log(response.data);
	  var result=response.data;
		  console.log(result);
		  if(result.data != undefined)
		  {
			  
			  //console.log(result);
			  setSuccessMessage(result.message);
			  fetchData();
          		

				const modalEl = document.querySelector('#editgroupModal');
			  	modalEl.click();
	
				
				

			  
		  }
		  else
		  {
			  setErrorMessage(result.message);
		  }
	  
	 

    } catch (error) {
      console.error(error);
	  setErrorMessage(error.message);
    }
	
  };
  



 return (
<div className="modal fade" id="editgroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit Group</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
          <form onSubmit={handleSubmit}>
        <div className="row">
		<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div> 
	
	<input type="hidden" name="id" value={editSingleData.id}/> 
	
         <div className="col-md-12">
            <div className="form-group">
                                            <label className="bold mb-2">Group Name</label>
                                            <input type="text" name="group_name"  className="form-control" onChange={handleInputChange} ref={groupInputRef}  value={formData.group_name} />
                                        </div>
         </div>
         <div className="col-md-12">
             <div className="form-group">
                                            <label className="bold text-dark mb-2">Users</label>
                                           
																						<Select
																						  className="basic-select"
																						  classNamePrefix="select"
																						  options={options_new}
																						 value={options_new.filter(option1 => formData.users && formData.users.includes(option1.value))}

																						  onChange={handleSelectChange}
																						  isMulti
																						  isSearchable={true}
																						  placeholder="Select an option"
																						/>


                                        </div>
         </div>
         
         <div className="col-12 text-center">
            <button type="submit" className="btn btn-theme">Save Changes</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>


)
}

export default EditGroup