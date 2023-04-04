import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Swal from 'sweetalert2';
import GroupUpload from '../Pages/upload/Add';

function Dashboard() {

useEffect(() => {
  	if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
   
  }, []);

   const navigate = useNavigate();
const handlelogout = () => { 	
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
      <header><Header/><Sidebar handlelogout={handlelogout}/></header>
	  
      <main>
		<GroupUpload/>
	  </main>
    
	
	</div>
   
    </>
  );
}

export default Dashboard;
