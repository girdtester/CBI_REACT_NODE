import React, { useEffect, Component, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Swal from 'sweetalert2';
import GroupList from '../Pages/groups/List';
import AddGroup from '../Pages/groups/Add';
import EditGroup from '../Pages/groups/Edit';
import { Modal } from 'bootstrap';
//import DeleteGroup from '../Pages/groups/Delete';
import { API_URL } from '../config';


import axios from 'axios';


function Groups( ) {
	
	 
	 const [groupData, setGroupUpload] = useState([]);
	 const [groups, setGroups] = useState([]);
	 const [totalPages, setTotalPages] = useState([]);
	 const [currentPages, setCurrentPages] = useState([]);	
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState([]);
	const [modalIdDelete, setModalId] = useState([]);
	const [editSingleData, setEditData] = useState([]);
	const [addedUserGroup, setGroupUser] = useState([]);
	const [page, setPage] = useState(1);
	

  useEffect(() => {
  if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
	if(localStorage.getItem('role')!=='Admin'){
  		window.location="/";
  	}
  
    fetchData();
	fetchUser();
  }, [page]);

  const fetchData = async () => {
    const url = API_URL+'groups?page='+page+"&users_groups=";
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
	  setGroupUpload(response.data.data_user);
	  setGroups(response.data.data);
	  setTotalPages(response.data.totalPages);
	  setCurrentPages(response.data.currentPage);
	  
	  
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchUser = async () => {
    const url = API_URL+'get_users';
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      //console.log(response.data.data);
	  setUserData(response.data.data);
	  
	  
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleNextPage = (page) => {
setPage(page);
};

const handlePrevPage = () => {
   setPage(page - 1);
};
	 

  const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
	  

   
    const handleEdit = async (id) => {
	   //console.log(id);
	   const url = API_URL+'edit_groups/'+id;
		const authToken = 'Bearer '+localStorage.getItem('token');

		try {
		  const response = await axios.get(url, {
			headers: {
			  Authorization: authToken,
			},
		  });
		  console.log(response.data.data.groupusers);		  
		 
		  
      
			if(response.data.data.groupusers.length > 0){
				var user_groups=[]
				for (let i = 0; i < response.data.data.groupusers.length; i++) {
					user_groups.push(response.data.data.groupusers[i].user_id);  
				}
				response.data.data.item.groupUsers=user_groups;
				
			}

			setGroupUser(response.data.data.groupusers);
		  setEditData(response.data.data.item);	  
		} catch (error) {
		  console.error(error.message);
		}
        
        //setIsEditing(true);
    }
	
	const handleDelete = async e => {
		
				
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

					setGroupUpload(groupData.filter(groupData => groupData.id !== modalIdDelete));
                
                		// close the modal
    					const modalElement = document.getElementById('deleteModal');
    					const modalInstance = new Modal(modalElement);
    					modalInstance.hide();
				  
				} catch (error) {
				  console.error(error);
				}
	
               
            }
	
	const handleOpenModal = (id) => {
		console.log(id);
		setModalId(id);
	}
	
  
const navigate = useNavigate();
const handlelogout = () => { 
	
    //clearTimeout(timer); // Clear the auto logout timer
    localStorage.removeItem('token'); // Remove the authentication token from local storage
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
	localStorage.removeItem('username');
	localStorage.removeItem('role');
    navigate('/'); // Redirect to the login page
  };


		
  return (
    <>
	<div className="wrapper">
      <header><Header /><Sidebar handlelogout={handlelogout} /></header>
      <main>
			
                {!isEditing && (                 
                    <GroupList
                        groupData={groupData} 
						groups={groups}  
						totalPages = {totalPages}
						currentPage = {currentPages}
                        handleOpenModal={handleOpenModal}
						handleEdit = {handleEdit}
						handleNextPage={handleNextPage}
						pageNumbers={pageNumbers}
						setGroupUpload={setGroupUpload}
						
                    />
                )}
				{/* Edit */}
				{/*isEditing && (
					
						
					
				)*/}
			
		
		</main>
      <footer></footer>
	</div>
	<AddGroup userData={userData} />	
	
	<EditGroup editSingleData={editSingleData} userData={userData} addedUserGroup={addedUserGroup} fetchData={fetchData}/>
	
	
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
            <button type="button" className="btn btn-theme bg-grey" data-bs-dismiss="modal"  >No</button> 
            <button type="submit" className="btn btn-theme" >Sure</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>
	
    </>
  );
}

export default Groups;
