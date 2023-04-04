import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Swal from 'sweetalert2';
import { API_URL } from '../config';



function Notification() {
    
	const [editData, setEditData] = useState([]);	
	const [addedUserGroup, setGroupUser] = useState([]);
	const [notification, setNotificationChange] = useState();
	
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);
	
 useEffect(() => {
    if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
	if(localStorage.getItem('role')==='Admin'){
  		window.location="/";
  	}
	handleNotification();
  }, []);

  
  
	  
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
	
	const handleNotification = async () => {
		const url = API_URL+'edit_users/'+localStorage.getItem('userId');
		const authToken = 'Bearer '+localStorage.getItem('token');

		try {
		  const response = await axios.get(url, {
			headers: {
			  Authorization: authToken,
			},
		  });
		  //console.log(response.data.data.groupusersNotification);		  
		 
		  setEditData(response.data.data.userpermissiondata);	  
		  //setGroupNotification(response.data.data.groupusersNotification);	
			setGroupUser(response.data.data.groupsUsers);	  
		   
		  
		} catch (error) {
		  console.error(error.message);
		}
	   
    }
	
	const notificationChange = async (e) => {
    e.preventDefault();
		const id = e.target.getAttribute('data-status');
		const notification_value = e.target.getAttribute('data-notification') || 0;
		const target_value = e.target.checked ? "on" : "off";
		
		console.log(target_value);
		
		try {
			const authToken = 'Bearer '+localStorage.getItem('token');
			//console.log(authToken);
			const url = API_URL+'set_notification';
			const response = await axios.post(url, {
				notification_value,
					id,
					target_value
			}, {
			  headers: {
				Authorization: authToken,
			  }
			});
			
		  
		  
		  var result=response.data;
		  setSuccessMessage(result.message);
		  handleNotification();
		  
		  // If the "All Group" switch is turned off, disable all groups
			// Disable notifications for all groups if the "All Group" switch is turned off
      if (id === localStorage.getItem('userId') && target_value === 'off') {
        setGroupUser(addedUserGroup.map(item => ({ ...item, is_notification: 0 })));
      }
	
  
		} catch (error) {
		  //console.log(error.message);
		  setErrorMessage(error.message);
		}
	
    }
	
// Check if all groups have notifications turned on
const allGroupsNotificationOn = addedUserGroup.every(item => item.is_notification === 1);


	
  return (
    <>
	<div className="wrapper">
      <header><Header/><Sidebar handlelogout={handlelogout} /></header>
      <main>
	       <div className="main">
            <div className="main-content">
                    <div className=" bold ft-23 mb-2">Notification Settings</div>
                    <p>Receive email notifications when updates are made to your groups.</p>
              <div className="row">
			  <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
               <div className="col-md-12 col-lg-5">
                  <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                 <th scope="col">All Group</th>
                                  <th scope="col">{allGroupsNotificationOn ? "on" : "off"}</th>
                                  <th scope="col"><div className="form-check form-switch">
								  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" data-status={localStorage.getItem('userId')} data-notification="All" onChange={notificationChange} checked={allGroupsNotificationOn ? "checked" : ""}/>
                         
								</div></th>
                                </tr>
                              </thead>
                              <tbody>
							  {addedUserGroup.map(item => {
							  
							  return (
								<tr key={item.id}>
                                    <td>{item.group_name}</td>
                                    <td>{(item.is_notification) == 1 ? "on" : "off"}</td>
										
                                    <td> <div className="form-check form-switch">
									  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" data-status={item.id} data-notification={item.is_notification} onClick={notificationChange} checked={(item.is_notification === 1) ? "checked" : ""}/>
									</div></td>
                                    
                                   
                                </tr>
								);
							  })}
                               

                                
                              </tbody>
                            </table>
                            </div>
							 
                     
                </div>
               </div>
              </div>
                  
            </div>
            
      
			</main>
      <footer></footer>
	</div>
	 

    </>
  );
}

export default Notification;
