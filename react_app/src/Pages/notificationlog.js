import React, { useEffect, Component, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Swal from 'sweetalert2';
import NotificationLogList from '../Pages/notificationLogs/List';
import { API_URL } from '../config';


import axios from 'axios';


function NotificationLog( ) {
	
	 
	 const [notificationLog, setNotificationLog] = useState([]);
	 const [totalPages, setTotalPages] = useState([]);
	 const [currentPages, setCurrentPages] = useState([]);	
	 const [page, setPage] = useState(1);
	

  useEffect(() => {
  	if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
    fetchData();	
  }, [page]);

  const fetchData = async () => {
    const url = API_URL+'notification_log?page='+page;
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
	  setNotificationLog(response.data.items);	  
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


		
  return (
    <>
	<div className="wrapper">
      <header><Header /><Sidebar handlelogout={handlelogout} /></header>
      <main>
			
                            
                    <NotificationLogList
                        notificationLog={notificationLog} 
						
						totalPages = {totalPages}
						currentPage = {currentPages}                       
						handleNextPage={handleNextPage}
						pageNumbers={pageNumbers}
						setNotificationLog={setNotificationLog}
                    />
                
		</main>
      <footer></footer>
	</div>
	
    </>
  );
}

export default NotificationLog;
