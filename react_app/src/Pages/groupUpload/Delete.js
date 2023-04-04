import React from 'react';
import axios from 'axios';
import {API_URL} from '../../config.js';
	


function DeleteGroupUpload({ editData }) {
  
const handleDelete = async (id) => {
    const url = API_URL+'delete_files/' + id;
    const authToken = 'Bearer ' + localStorage.getItem('token');
   

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: authToken,
            },
        });
    if(response.data.message === "File deleted successfully")
    {
    	window.location.href = '/group-uploads';
    }
      
        
    } catch (error) {
        console.error(error);
    }
};

 return (
<div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog ">
    <div className="modal-content">
      
      <div className="modal-body">
         <form>
        <div className="row pt-4 pb-4">
         <div className="col-md-12 text-center">
                                            <h4 className="bold mb-4">Are you sure you want to delete this item</h4>
         </div>
         
         <div className="col-12 text-center">
            <button type="button" className="btn btn-theme bg-grey" data-bs-dismiss="modal">No</button> 
          <button type="button" className="btn btn-theme" onClick={() => handleDelete(editData.id)}>Sure</button>

         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>


)
}

export default DeleteGroupUpload