import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import {API_URL} from '../../config.js';
import { Link } from 'react-router-dom';  

 

function GroupUploadList({ groupData, groups, totalPages, currentPage, handleDelete, handleEdit,handleNextPage,handlePrevPage,pageNumbers,fetchData,setGroupUpload }) {
   

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
 
const handleGroupSelectChange = (selectedOptions) => {
const selectedIds = selectedOptions.map(option => option.value);
setSelectedGroupIds(selectedIds);
};

const options = groups.map((group) => ({
value: group.id,
label: group.name,
}));



useEffect(() => {
   fetchData_new_change();
}, [selectedGroupIds]);


  const fetchData_new_change = async () => {


    console.log(selectedGroupIds);
    var newGroups = selectedGroupIds.join(',');

   console.log(newGroups);

    const url = API_URL+'group-uploads?page=' + currentPage+"&user_id="+ localStorage.getItem('userId')+"&group_ids="+newGroups;
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
    setGroupUpload(response.data.groups);
	setGroupUpload(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };



const filteredData = groupData.filter(item => {
  if (!item.title && !item.group_name && !item.uploaded_by) {
    return false;
  }
  
  const titleMatch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
  const descriptionMatch = item.group_name && item.group_name.toLowerCase().includes(searchQuery.toLowerCase());
  const uploadedMatch = item.uploaded_by && item.uploaded_by.toLowerCase().includes(searchQuery.toLowerCase());

  //check if item belongs to selected group(s)
  // const selectedGroups = Array.from(document.querySelectorAll('select[name="groups[]"]')).map(select => select.value);
  // if (selectedGroups.length > 0) {
  //   const itemGroupIds = typeof item.group_id === 'string' ? item.group_id.split(',').map(id => id.trim()) : [];
  //   const groupMatch = itemGroupIds.some(id => selectedGroups.includes(id));
  //   if (!groupMatch) {
  //     return false;
  //   }
  // }

  return titleMatch || descriptionMatch || uploadedMatch;
});




  

    return ( 
	 <div className="main">
            <div className="main-content"> 
                    <div className=" bold ft-23 mb-3"> File Uploads</div>
                    <div className="row justify-content-end align-items-end">
                     
                     <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                      
                  <Select 
  className="basic-select"
  style={{ minHeight: '42px!important', borderRadius: '10px!important' }}  
  classNamePrefix="select"
  options={options}
  value={options.filter(option => selectedGroupIds.includes(option.value))}
  onChange={handleGroupSelectChange}
  isMulti
  isSearchable={true}
  placeholder="Select a group"
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
                          <th scope="col">Title</th>
                          <th scope="col">Group</th>
                          <th scope="col">Uploaded By</th>
                          <th scope="col">Date Created</th>
                          <th scope="col">Action</th>
                          </tr>
                          </thead>
                          <tbody>
                          {filteredData.map(item => ( 

                          <tr key={item.id}>
                          <td><Link to={`/individual-upload/${item.id}`}><u>{item.id.toString().padStart(4, '0')}</u></Link></td>


                          <td><Link to={`/individual-upload/${item.id}`}>{item.title}</Link></td>
                          <td><Link to={`/individual-upload/${item.id}`}>{item.group_name}</Link></td>
                          <td><Link to={`/individual-upload/${item.id}`}>{item.uploaded_by}</Link></td>
                          <td><Link to={`/individual-upload/${item.id}`}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(item.created_date).getMonth()]} {new Date(item.created_date).getDate()}, {new Date(item.created_date).getFullYear()} {new Date(item.created_date).toLocaleTimeString()}</Link></td>
                          <td>
                          <a href="#" onClick={() => handleEdit(item.id)} className="text-primary" data-bs-toggle="modal" data-bs-target="#editugroupModal" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                           <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                           <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg></a>  

                          <a href="#" onClick={() => handleDelete(item.id)} className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
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

export default GroupUploadList