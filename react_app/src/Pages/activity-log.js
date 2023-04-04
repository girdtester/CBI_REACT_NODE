import React, { useEffect, Component, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Activity from '../Pages/activitylogs/List';
import { API_URL } from '../config';




function Activitylogs() {
	
	const [activityData, setActivity] = useState([]);	
	 const [totalPages, setTotalPages] = useState([]);
	 const [currentPages, setCurrentPages] = useState([]);	
	 const [page, setPage] = useState(1);
	 
useEffect(() => {
	if(localStorage.getItem('token')==null){
  		window.location="/";
  	}
	if(localStorage.getItem('role')!='Admin'){
  		window.location="/";
  	}
   fetchData();
}, [page]);

  const fetchData = async () => {
    const url = API_URL+'activity-logs?page=' + page;
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      
	  
	  setActivity(response.data.items);
	  setTotalPages(response.data.totalPages);
	  setCurrentPages(response.data.currentPage);
	  
	  
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
	   <Activity activityData = {activityData} totalPages = {totalPages} currentPages = {currentPages} handleNextPage={handleNextPage}
            pageNumbers={pageNumbers}/>
		</main>
      <footer></footer>
    </>
  );
}

export default Activitylogs;
