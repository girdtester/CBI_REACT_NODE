import React, { useEffect, Component, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Header from '../Pages/Header';
import Sidebar from '../Pages/Sidebar';
import Swal from 'sweetalert2';
import GroupUploadList from '../Pages/groupUpload/List';
import EditGroupUpload from '../Pages/groupUpload/Edit';
import DeleteGroupUpload from '../Pages/groupUpload/Delete';
import { API_URL } from '../config';

import axios from 'axios';


function Groupupload( ) {
	
	 const [data, setData] = useState([]);
	 const [groupData, setGroupUpload] = useState([]);
	 const [totalPages, setTotalPages] = useState([]);
	 const [currentPages, setCurrentPages] = useState([]);	
   const [editData, setSelectedData] = useState(''); 
   
   const handleEdit = (id) => {
        const [editData] = groupData.filter(groupData => groupData.id === id);

        console.log(editData);

        //return editData;

        setSelectedData(editData);
        setIsEditing(true);
    }


    const handleDeletemain = (id) => {
        const [editData] = groupData.filter(groupData => groupData.id === id);
        setSelectedData(editData);
    }

  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);



  const fetchData = async () => {
    // const selectedGroupIds = selectedGroupIds.join(',');

    const url = API_URL+'group-uploads?page=' + page+"&user_id="+ localStorage.getItem('userId')+"&group_ids=";
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });

    console.log(response.data.groups);
    setData(response.data.groups);
	  setGroupUpload(response.data.items);
	  setTotalPages(response.data.totalPages);
	  setCurrentPages(response.data.currentPage);
	  
    } catch (error) {
      console.error(error.message);
    }
  };


useEffect(() => {

if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
	

   fetchData();
}, [page]);


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
      <header><Header/><Sidebar handlelogout={handlelogout} /></header>
      <main>
			
                             
                    <GroupUploadList
                        groupData={groupData}
                        groups={data}
						totalPages = {totalPages}
						currentPage = {currentPages}
                        handleDelete={handleDeletemain}
						handleEdit = {handleEdit}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            pageNumbers={pageNumbers}
            fetchData={fetchData}
            setGroupUpload={setGroupUpload}

                    />
               
		
		</main>
      <footer></footer>
	</div>
	<EditGroupUpload editData = {editData}   groups={data} fetchData={fetchData}/>
	<DeleteGroupUpload  editData = {editData}/ >
	     

 

    </>
  );
}

export default Groupupload;
