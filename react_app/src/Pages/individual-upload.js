import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import IndiviualUploadList from '../Pages/groupUpload/individual-upload';



function IndiviualUpload() {
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
      <header><Header/><Sidebar handlelogout={handlelogout} /></header>
      <main>
	   <IndiviualUploadList />
		</main>
      <footer></footer>
    </>
  );
}

export default IndiviualUpload;
