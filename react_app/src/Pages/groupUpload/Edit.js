import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import {API_URL} from '../../config.js';


function EditGroupUpload({  editData,groups,fetchData  }) {  


const [formData, setFormData] = useState({ 
    title: editData.title, 
	old_title: editData.title, 
    description: editData.description, 
	old_description: editData.description, 
    group_id: editData.group_id,
	old_group_id: editData.group_id, 
    id: editData.id,
    user_id:localStorage.getItem('userId')
  });

  useEffect(() => {
    setFormData({
      title: editData.title,
      old_title: editData.title, 
      description: editData.description, 
      old_description: editData.description, 
      group_id: editData.group_id,
      old_group_id: editData.group_id, 
      id: editData.id,
      user_id:localStorage.getItem('userId'),
    });
  }, [editData]);

  const titleInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axios.post(API_URL+`update_files/${formData.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
        
      fetchData();
      const modalEl = document.querySelector('#editugroupModal');
        modalEl.click();
	  

    } catch (error) {
      console.error(error);
    }
  };
  

 return (
<div className="modal fade" id="editugroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit Upload </h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">  
       <form onSubmit={handleSubmit}>     

       <input type="hidden" name="id" value={editData.id}/> 

       <input type="hidden" name="user_id" value={localStorage.getItem('userId')}/>    
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
				{editData.id
  ? <label className="bold mb-0">ID# : {editData.id.toString().padStart(4, '0')}</label>
  : null
}
			</div>
         </div>
         <div className="col-md-6">
            <div className="form-group">
				<label className="bold  mb-2">Title</label>
				<input type="text" name="title"  className="form-control" onChange={handleInputChange} ref={titleInputRef}  value={formData.title} />
			</div>
		</div>

		

		<div className="col-md-6">
			<div className="form-group">
				<label className="bold  mb-2"> Select a Group </label>
						<select className=" form-select form-control form-control" name="group_id"  onChange={handleInputChange} ref={titleInputRef}  value={formData.group_id}>
						<option value="">All Groups</option>
						{groups.map(item => (
						<option key={item.id} value={item.id}>
						{item.name}
						</option>
						))}
</select>
			</div>
		</div>
                       
		 <div className="col-md-12">
			<div className="form-group">
                                            
			   <label className="bold mb-2"> Description</label>
				<textarea rows="5" name="description" onChange={handleInputChange} ref={titleInputRef}  value={formData.description}  className="form-control"></textarea>
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

export default EditGroupUpload