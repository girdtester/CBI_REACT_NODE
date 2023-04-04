import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Modal } from 'bootstrap';
import axios from 'axios';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import UserList from '../Pages/users/List';
import AddUser from '../Pages/users/Add';
import EditUser from '../Pages/users/EditUser'; 
import EditNotification from '../Pages/users/EditNotification';
import DeleteUser from '../Pages/users/DeleteUser';
import Swal from 'sweetalert2';
import { API_URL } from '../config';



function Users() {
	
	const [roleData, setRoleData] = useState([]);
	const [groupData, setGroupData] = useState([]);
	const [userData, setUser] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	 const [currentPages, setCurrentPages] = useState([]);
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
 
	fetchUser();
    fetchData();	
  }, [page]);

  const fetchData = async () => {
    const url = API_URL+'role';
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
	  setRoleData(response.data.data);
	  
    } catch (error) {
      
    }
  };
  
  
  
  const fetchUser = async () => {
    const url = API_URL+'userslist?page='+page+"&group_ids=";
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
	  setUser(response.data.items);	
	  setGroupData(response.data.groups);	  	  
	  setTotalPages(response.data.totalPages);
	  setCurrentPages(response.data.currentPage);
	  
	  
    } catch (error) {
      
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


const handleOpenModal = (id) => {
		
		setModalId(id);
	}
	
	const handleDelete = async e => {
		
				
				const url = API_URL+'delete_users/'+modalIdDelete;
				const authToken = 'Bearer '+localStorage.getItem('token');

				try {
				  const response = axios.get(url, {
					headers: {
					  Authorization: authToken,
					},
				  });
				  
					Swal.fire({
						icon: 'success',
						title: 'Deleted!',
						text: `data has been deleted.`,
						showConfirmButton: false,
						timer: 1500,
					});

					setUser(userData.filter(userData => userData.id !== modalIdDelete));
                
                 
                 		// close the modal
    					const modalElement = document.getElementById('deleteModal');
    					const modalInstance = new Modal(modalElement);
    					modalInstance.hide();
                
                
				  
				} catch (error) {
				  console.error(error);
				}
	
               
            }
			
	const handleEdit = async (id) => {
	  
	   const url = API_URL+'edit_users/'+id;
		const authToken = 'Bearer '+localStorage.getItem('token');

		try {
		  const response = await axios.get(url, {
			headers: {
			  Authorization: authToken,
			},
		  });

      var user_groups=[]
		  for (let i = 0; i < response.data.data.userpermissiondata.length; i++) {
					user_groups.push(response.data.data.userpermissiondata[i].group_id);

						
			}
			
			response.data.data.userpermissiondata[0].user_groups=user_groups;			
		  setEditData(response.data.data.userpermissiondata[0]);	  
		  setGroupUser(response.data.data.groupsUsers);	  
		   
		  
		} catch (error) {
		  console.error(error.message);
		}
        
        //setIsEditing(true);
    }
	
	const handleNotification = async (id) => {
		const url = API_URL+'edit_users/'+id;
		const authToken = 'Bearer '+localStorage.getItem('token');

		try {
		  const response = await axios.get(url, {
			headers: {
			  Authorization: authToken,
			},
		  });
		  
			var user_groups=[]
			for (let i = 0; i < response.data.data.groupsUsers.length; i++) {
				
				if(response.data.data.groupsUsers[i].is_notification === 1)
				{
					user_groups.push(response.data.data.groupsUsers[i].id);
					console.log("onefirst"+user_groups.push(response.data.data.groupsUsers[i].id));

				}				
						
			}
			
			response.data.data.groupsUsers.notification=user_groups;
			setGroupUser(response.data.data.groupsUsers);  
		  setEditData(response.data.data.userpermissiondata[0]);	  
		 		   
		  
		} catch (error) {
		  console.error(error.message);
		}
	   
    }
			
  return (
    <>
	<div className="wrapper">
      <header><Header/><Sidebar handlelogout={handlelogout} /></header>
      <main>
	 <UserList userData={userData}
				totalPages = {totalPages}
				currentPage = {currentPages}
				handleOpenModal= {handleOpenModal}
				handleEdit= {handleEdit}
				handleNotification= {handleNotification}
				handleNextPage={handleNextPage}
				pageNumbers={pageNumbers}
				groupData = {groupData}
				setUser = {setUser}
				/>
			</main>
      <footer></footer>
	</div>
	 
	 
<AddUser roleData = {roleData} groupData = {groupData}/>
 <EditUser roleData = {roleData} 
			groupData = {groupData} 
			editSingleData= {editSingleData} 
			addedUserGroup= {addedUserGroup}
			fetchData={fetchData}
/>
     
 <EditNotification	
			editSingleData= {editSingleData} 
			addedUserGroup= {addedUserGroup}	
			fetchData={fetchData}		
			/> 
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
            <button type="submit" className="btn btn-theme">Sure</button>
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

export default Users;
