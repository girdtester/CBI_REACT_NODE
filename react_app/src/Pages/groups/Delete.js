import React, { useEffect, Component, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {API_URL} from '../../config.js';
	

function DeleteGroup({ modalIdDelete, groupData }) {
	 
	 //const [groupData, setGroupUpload] = useState([]);
	 
	 const handleDelete = async e => {
		e.preventDefault();
       
				
				const url = API_URL+'delete_groups/'+modalIdDelete;
				const authToken = 'Bearer '+localStorage.getItem('token');

				try {
				  const response = axios.get(url, {
					headers: {
					  Authorization: authToken,
					},
				  });
				  
				   //const [groupData] = groupData.filter(groupData => groupData.id === id);

					Swal.fire({
						icon: 'success',
						title: 'Deleted!',
						text: `data has been deleted.`,
						showConfirmButton: false,
						timer: 1500,
					});

					setGroupUpload(groupData.filter(groupData => groupData.id !== id));
				  
				} catch (error) {
				  console.error(error);
				}
	
               
            }
        
   
	
 return (
<div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog ">
    <div className="modal-content">
      
      <div className="modal-body">
         <form onSubmit={handleDelete}>
		 
        <div className="row pt-4 pb-4">
         <div className="col-md-12 text-center">
                                            <h4 className="bold mb-4">Are you sure you want to delete this item</h4>
         </div>
         
         <div className="col-12 text-center">
            <button type="button" className="btn btn-theme bg-grey">No</button>&nbsp;
            <button type="submit" className="btn btn-theme">Sure</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>

)
}

export default DeleteGroup