import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import {API_URL} from '../../config.js';
import Swal from 'sweetalert2';

import Select from 'react-select'; 

function UserList({ userData, totalPages, currentPage,handleOpenModal,handleEdit, handleNotification,handleNextPage,pageNumbers,groupData,setUser }) {

const styles = {
    marginLeft: '5px'
  };


	
	const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  


const handleGroupSelectChange = (selectedOptions) => {
const selectedIds = selectedOptions.map(option => option.value);
setSelectedGroupIds(selectedIds);
};


useEffect(() => {
   fetchData_new_change();
}, [selectedGroupIds]);


  const fetchData_new_change = async () => {


    console.log(selectedGroupIds);
    var newGroups = selectedGroupIds.join(',');

   //console.log(newGroups);

    const url = API_URL+'userslist?page=' + currentPage+"&group_ids="+newGroups+"&user_id="+ localStorage.getItem('userId');;
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
	  console.log(response.data);
    setUser(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };



const filteredData = userData.filter(item => {
  if (!item.firstname && !item.lastname && !item.email && !item.role_name ) {
    return false;
  }
  
  const firstnameMatch = item.firstname && item.firstname.toLowerCase().includes(searchQuery.toLowerCase());
  const lastnameMatch = item.lastname && item.lastname.toLowerCase().includes(searchQuery.toLowerCase());
  const emailMatch = item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase());
  const roleMatch = item.role_name && item.role_name.toLowerCase().includes(searchQuery.toLowerCase());

 
  return firstnameMatch || lastnameMatch || emailMatch || roleMatch;
});

const options = groupData.map((group) => ({
    value: group.id,
    label: group.name,
}));




const sendResetPwdLink = async (id,username) => {
		//console.log(username);
		try {
        	const userid = localStorage.getItem('userId');
		  const response = await axios.post(API_URL+'sendpassword', {
			username,
          	userid,
		  });
		  
		  var result=response.data;
		  
		  if(result.message == 'Password reset email sent')
		  {
			  Swal.fire({text:'Reset password link send successfully, Please check your email for reset password'});
		  }
		  else
		  {
			  Swal(result.message);
		  }
  
		} catch (error) {
		  console.log(error.message);
		  Swal.fire({text:error.message});
		}
		
	}


 return (
    <div className="main">
            <div className="main-content">
                    <div className=" bold ft-23 mb-3">Users</div>
                    <div className="row justify-content-end align-items-end">
                     <div className="col-12 mb-3 col-md-12 col-lg-4 col-xl-6">
                        <button className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#adduserModal">+ Add User</button>
                     </div>
                     <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                                <Select
                                className="basic-select"
                                classNamePrefix="select"
                                options={options}
                                value={options.filter(option => selectedGroupIds.includes(option.value))}
                                onChange={handleGroupSelectChange}
                                isMulti
                                isSearchable={true}
                                placeholder="Select group"
                                name="groups[]"
                                />
                        </div>
                     <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                                 <div className="position-relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search s-icon" viewBox="0 0 16 16">
                                   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                 </svg>
                                                                     <input type="text" placeholder="Search" className="login-form-control" name="" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
                                                                 </div>
                    </div>
                  <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                 <th scope="col">ID #</th>
                                  <th scope="col">First Name</th>
                                  <th scope="col">Last Name</th>
                                  <th scope="col">User Type</th>
                                  <th scope="col">Group</th>
                                  <th scope="col">Email</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredData.map((item) => (
								  
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.firstname} </td>
                                    <td>{item.lastname}</td>
                                    <td>{item.role_name}</td>
                                    <td>
									{item.groupDetails.map((group, index) => (
										<div key={index}>
										  {group.group_name}
										</div>
									  ))}
									</td>
                                    <td>{item.email}</td>
                                    <td>
                                       <a onClick={() => handleEdit(item.id)} className="text-primary" data-bs-toggle="modal" data-bs-target="#edituserModal" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                         <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                         <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                       </svg></a>  
                                       <a onClick={() => handleNotification(item.id)} data-bs-toggle="modal" data-bs-target="#editnotificationModal" title="Edit Send Notification Email Group">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                          </svg>
                                       </a> 
                                       <a onClick={() => handleOpenModal(item.id)} className="text-danger"  data-bs-toggle="modal" data-bs-target="#deleteModal" title="Delete">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                          </svg>
                                       </a>


<a onClick={() => sendResetPwdLink(item.id,item.email)} className="text-danger" style={styles} title="Send Reset Password Email">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18.08 14.138">
  <g id="mail-outline" transform="translate(0.5 0.5)">
    <path id="Path_1" data-name="Path 1" d="M5.018,6.75h13.8a1.643,1.643,0,0,1,1.642,1.643v9.854a1.643,1.643,0,0,1-1.642,1.642H5.018a1.643,1.643,0,0,1-1.643-1.642V8.393A1.643,1.643,0,0,1,5.018,6.75Z" transform="translate(-3.375 -6.75)" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
    <path id="Path_2" data-name="Path 2" d="M7.875,11.25l5.6,5.138,5.6-5.138" transform="translate(-4.939 -8.788)" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
  </g>
</svg>


                                       </a>


                                    </td>
                                </tr>
								))}  
                                
                                
                              </tbody>
                            </table>
                            </div>
                       <nav aria-label="..." className="mt-1 text-end">
                  <ul className="pagination d-flex justify-content-end">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handleNextPage(currentPage - 1)} tabIndex="-1" aria-disabled={currentPage === 1}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  </button>
                  </li>
                  {pageNumbers.map(pageNumber => (
                  <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handleNextPage(pageNumber)}>{pageNumber}</button>
                  </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handleNextPage(currentPage + 1)} aria-disabled={currentPage === totalPages}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                  </button>
                  </li>
                  </ul>
                  </nav>
                </div>
            </div>
		)
}

export default UserList