import React, { useEffect, Component, useState } from 'react';
import Swal from 'sweetalert2';
import {API_URL} from '../../config.js';

import { useParams } from 'react-router-dom';

import axios from 'axios';

function IndividualUploadList() {

let displayinline = 'inline';
let contentRight = { justifyContent: 'right!important' };
let width = 68;
let btnDesign = {
backgroundColor: '#3BB3F6',
    color: '#fff'
};


     const { id } = useParams();
     const [data, setData] = useState([]);
     const [maindata, setDatamain] = useState([]);
const [inputValues, setInputValues] = useState({});
       useEffect(() => {
       
       if(localStorage.getItem('token')===null){
  		window.location="/";
  	}
	
    fetchData();
  }, []);
  const fetchData = async () => {
   const url = API_URL+'group_upload_info/'+id;
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });

      if(response.data.item.length==0){
        window.location.href = '/group-uploads';
      }

    setData(response.data.item);
    setDatamain(response.data.item[0]);

    
     
      //const maindata=data[0];
      
    } catch (error) {
       window.location.href = '/group-uploads';
      console.error(error);
    }
  };

const [selectedItems, setSelectedItems] = useState([]);

const handleCheckboxChange = (event, item) => {
  if (event.target.checked) {
    setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
  } else {
    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selectedItem) => selectedItem.id !== item.id));
  }
};



const handleDownload = async (id,changed_name,title) => {
const downloaded_files = [];
  
  
    downloaded_files.push({
      id: id,
      name: `${changed_name}_`+ title
    });
  

  const data = JSON.stringify({
    "file_id": downloaded_files.map(file => file.id),
    "user_id": localStorage.getItem('userId')
  });

  const config = {
    method: 'post',
    url: API_URL+'download',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data : data,
    responseType: 'blob'
  };

  axios(config)
    .then(function (response) {
      downloaded_files.forEach((file) => {
        const url = URL.createObjectURL(new Blob([response.data]));
		console.log(file);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Files downloaded successfully!',
        confirmButtonText: 'OK'
      });
      
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};


const handleDelete = () => {
	if(selectedItems.length == data.length)
    {
    		Swal.fire({
                title: 'Are you sure?',
                 text: 'If you want to delete all file then group will be delete automatically!',
                 icon: 'warning',
                 buttons: true,
                 dangerMode: true,
                 })
                  .then((willDelete) => {
                         if (willDelete) {
							 
							 
                         	const url = API_URL+'delete_group_upload_info';
                                     const authToken = 'Bearer '+localStorage.getItem('token');

                                        try {
											let files = [];
											selectedItems.forEach((data) => {
													files.push(data.id);
												  });
												console.log(files);
												  

												const body = JSON.stringify({
													file_id: files,
													folderId: id,
												  });
												  console.log(body);
												  
												  const config = {
													method: 'post',
													url: API_URL+'delete_group_upload_info',
													headers: {
													  'Authorization': `Bearer ${localStorage.getItem('token')}`,
													  'Accept': 'application/json',
													  'Content-Type': 'application/json',
													},
													data : body,
													responseType: 'blob'
												  };

												  axios(config)
													.then(function (response) {
		
                                               // Remove the deleted item from the data state
                                              window.location.href='/group-uploads';
                                        
                                        		Swal.fire({
																		icon: 'success',
																		title: 'Deleted!',
																		text: `data has been deleted.`,
																		showConfirmButton: false,
																		timer: 1500,
																	});
													});

                                             }
                                           catch (error) {
                                                    console.error(error);
                                            } 
                               
                      } 
                  });

    	
    }
	else
    {
		try {
		let files = [];
		selectedItems.forEach((data) => {
			files.push(data.id);
		  });
		  
		  const body = JSON.stringify({
			file_id: files,
			folderId: id,
		  });
		  console.log(body);
		  
		  const config = {
			method: 'post',
			url: API_URL+'delete_group_upload_info',
			headers: {
			  'Authorization': `Bearer ${localStorage.getItem('token')}`,
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			},
			data : body,
			responseType: 'blob'
		  };

		  axios(config)
			.then(function (response) {
    
          // Remove the deleted item from the data state
		  selectedItems.forEach((data) => {
			
			setData(prevData => prevData.filter(item => item.id !== data.id));
		  });
          
			});
        }
         catch (error) {
            console.error(error);
        }
    
    }
};




const handleDeleteSingle = async (id) => {
console.log(data.length);

	if(data.length <= 1)
    {
    		Swal.fire({
                title: 'Are you sure?',
                 text: 'If you want to delete all file then group will be delete automatically!',
                 icon: 'warning',
                 buttons: true,
                 dangerMode: true,
                 })
                  .then((willDelete) => {
                         if (willDelete) {					 
							 
                         	const url = API_URL+'delete_files_groups/'+id;
                            const authToken = 'Bearer '+localStorage.getItem('token');
                            try {
								let file_id = id;
								const response =  axios.get(url, {
			  											headers: {
														Authorization: authToken,
			  										}
										});	
                                          //console.log(response);
		
                                               // Remove the deleted item from the data state
                                                  
                                        window.location.href='/group-uploads';
                                        
                                        		
                               }
                               catch (error) {
                                                    console.error(error.message);
                               } 
                               
                      } 
                  });

    	
    }
	else
    {
		try {
		const authToken = 'Bearer '+localStorage.getItem('token');
			console.log(authToken);
			let file_id = id;
			const response = await axios.get(API_URL+'delete_files_groups/'+id,{
			  headers: {
				Authorization: authToken,
			  }
			});
		  
												
                                                 
          //console.log(response);
    
          // Remove the deleted item from the data state	  
			if(response.data.message === "File deleted successfully")
            {
            setData(prevData => prevData.filter(item => item.id !== id));
            }
			
		  
          
			
        }
         catch (error) {
            console.error(error);
        }
    
    }
};


const handleInputKeyDown = (event) => {
  if (event.key === "Enter") {
    const { value, dataset } = event.target;
    const { id } = dataset;

     const formData = new FormData();
      formData.append('user_id',localStorage.getItem('userId'));
      formData.append('title',event.target.value);
      formData.append('id',id);


     
     try {

      const response =  axios.post(API_URL+`updatesingle_files/${id}`, formData, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });  

        // Swal.fire({
        //     icon: 'success',
        //     title: 'Success!',
        //     text: 'title changed successfully!',
        //     confirmButtonText: 'OK'
        //   });
     
     window.location.reload();
    } catch (error) {
      console.error(error);
    } 
  }
};

const saveTitle = async () => { 

const key = Object.keys(inputValues)[0]; // "46"
const values = inputValues[key].title; // "test2"   
    
     const formData = new FormData();
      formData.append('user_id',localStorage.getItem('userId'));
      formData.append('title',values);
      formData.append('id',key);   

//console.log(formData);
     try {

      let response = await axios.post(API_URL+`updatesingle_files/${key}`, formData, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });  
     
		
     //console.log(response.data.message);
    
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'title changed successfully!',
            confirmButtonText: 'OK'
          });
     
   
    		fetchData();
  		if(response.data.message === "success")
        {
        window.location.reload();
        }
     			
        
    } catch (error) {
      console.error(error);
    } 
  
};

 useEffect(() => {    
       
    		fetchData();
  		}, []);

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const { id } = dataset;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: {
        ...prevInputValues[id],
        [name]: value
      }
    }));
  };

const [openBoxes, setOpenBoxes] = useState([]);

const openBox = (id) => {
  if (!openBoxes.includes(id)) {
    setOpenBoxes([...openBoxes, id]);
  }
}

const closeBox = (id) => {
  setOpenBoxes(openBoxes.filter(boxId => boxId !== id));
}

  
    return (
	  <div className="main">
            <div className="main-content">
                <div className="">
                    <div className=" bold ft-23 mb-4">Upload's Title</div>

                
                   
                       </div>
                       <div className="row justify-content-center">
                         <div className="col-md-12 col-lg-10 col-xl-10 col-xxl-10 col-12">
                                              <div className="form-group mb-2">
                                            <label className=" mb-0"><span className="bold">Name of uploader :</span> {maindata.username}</label>
                                        </div>
                                         <div className="form-group mb-2">
                                            <label className=" mb-0"><span className="bold">Date uploaded :</span> {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(maindata.created_date).getMonth()]} {new Date(maindata.created_date).getDate()}, {new Date(maindata.created_date).getFullYear()} {new Date(maindata.created_date).toLocaleTimeString()}</label>
                                        </div>
                                        <div className="form-group mb-2">
                                            <label className=" mb-0"><span className="bold">Description :</span> {maindata.description}</label>
                                        </div>
                                           <div className="row mt-3">
                                           

                           <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th scope="col"><label className="container1 mt-23">
                                      <input type="checkbox" 
               checked={selectedItems.length === data.length}
               onChange={(event) => setSelectedItems(event.target.checked ? data : [])} />
                                         <span className="checkmark"></span>
                                            </label></th>
                                  <th scope="col">ID #</th>
                                  <th scope="col">File</th>
                                  <th scope="col">Title</th>
                                  <th scope="col">Size</th>
                                    <th scope="col"></th>
                                </tr>
                              </thead>
                              <tbody>
                               {data.map((item) => ( 
                                <tr>
                                    <td><label className="container1 mt-10">
                                              <input type="checkbox" 
                 checked={selectedItems.includes(item)}
                 onChange={(event) => handleCheckboxChange(event, item)} />

                                              <span className="checkmark"></span>
                                            </label></td>
                                    <td>{item.id}</td>
                                    <td>{item.title} </td>
									{!openBoxes.includes(item.id) ?
                                    <td>{item.changed_name}   
                                     {localStorage.getItem('role') === 'Guest' ?
                                     maindata.uploader_id == localStorage.getItem('userId') && (
									<span onClick={() => openBox(item.id)} title="Edit">  
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 117.74 122.88">
        <path class="st0" d="M94.62,2c-1.46-1.36-3.14-2.09-5.02-1.99c-1.88,0-3.56,0.73-4.92,2.2L73.59,13.72l31.07,30.03l11.19-11.72 c1.36-1.36,1.88-3.14,1.88-5.02s-0.73-3.66-2.09-4.92L94.62,2L94.62,2L94.62,2z M41.44,109.58c-4.08,1.36-8.26,2.62-12.35,3.98 c-4.08,1.36-8.16,2.72-12.35,4.08c-9.73,3.14-15.07,4.92-16.22,5.23c-1.15,0.31-0.42-4.18,1.99-13.6l7.74-29.61l0.64-0.66 l30.56,30.56L41.44,109.58L41.44,109.58L41.44,109.58z M22.2,67.25l42.99-44.82l31.07,29.92L52.75,97.8L22.2,67.25L22.2,67.25z"/>
      </svg>
											</span> )
										:
                                        <span onClick={() => openBox(item.id)} title="Edit">  
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 117.74 122.88">
        <path class="st0" d="M94.62,2c-1.46-1.36-3.14-2.09-5.02-1.99c-1.88,0-3.56,0.73-4.92,2.2L73.59,13.72l31.07,30.03l11.19-11.72 c1.36-1.36,1.88-3.14,1.88-5.02s-0.73-3.66-2.09-4.92L94.62,2L94.62,2L94.62,2z M41.44,109.58c-4.08,1.36-8.26,2.62-12.35,3.98 c-4.08,1.36-8.16,2.72-12.35,4.08c-9.73,3.14-15.07,4.92-16.22,5.23c-1.15,0.31-0.42-4.18,1.99-13.6l7.74-29.61l0.64-0.66 l30.56,30.56L41.44,109.58L41.44,109.58L41.44,109.58z M22.2,67.25l42.99-44.82l31.07,29.92L52.75,97.8L22.2,67.25L22.2,67.25z"/>
     
      </svg>
											</span>
										}
									</td> 
:
<td><input type="text" name="title" value={inputValues[item.id] ? inputValues[item.id].title : ""} data-id={item.id} onChange={handleInputChange} onKeyDown={(e) => {if (e.keyCode === 13) {handleInputKeyDown(e, item);}}} className="border-0 form-control pt-1 pb-1" placeholder="change title" style={{ display: displayinline, width : `${width}%` }} />
   
    <span onClick={saveTitle} title="Save">
        <svg id="Layer_1" width="16" height="16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 457.57"><defs></defs>
        <path class="cls-1" d="M0,220.57c100.43-1.33,121-5.2,191.79,81.5,54.29-90,114.62-167.9,179.92-235.86C436-.72,436.5-.89,512,.24,383.54,143,278.71,295.74,194.87,457.57,150,361.45,87.33,280.53,0,220.57Z"/>
        </svg>
      </span>
         
      <span onClick={() => closeBox(item.id)} title="Cancel">
       <svg id="Layer_1" width="10" height="10" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 122.878 122.88"><defs></defs>
        <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z"/>
        </svg>
      </span>
</td>

                                    }
                                    <td>{item.size} KB
                                  </td>
                                     <td >
                                     <a href="#" className="text-primary" onClick={() => handleDownload(item.id,item.changed_name,item.title)} title="Download">  
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-download" viewBox="0 0 16 16">
                              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                            </svg>
                            </a>
                            {localStorage.getItem('role') !== 'Guest' && (  
                           <a href="#" className="text-danger" onClick={() => handleDeleteSingle(item.id)} title="Delete">  
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                            </a>
                            )}
                                  </td>
                                </tr>
                                ))}  
                               
                               
                               
                              </tbody>
                            </table>
                            </div>


                                           </div>
                                           </div>
                                            


												

                                        </div>
                        </div>
                       
                    </div>
			)
}

export default IndividualUploadList