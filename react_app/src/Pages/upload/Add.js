import React, { useEffect, Component, useState,useRef  } from 'react';
import axios from 'axios';
import DeleteUpload from './Delete';
//import 'bootstrap-select/dist/js/bootstrap-select.min.js';
//import $ from 'jquery';
import {API_URL} from '../../config.js';



function GroupUpload({}) {
 const [groups_list, setData] = useState([]);
 const [files, setFiles] = useState([]);

const [deleteModalVisible, setDeleteModalVisible] = useState(true);

	useEffect(() => {
	   fetchData();
	}, []);


  const [isDataLoaded, setIsDataLoaded] = useState(false);


  const fetchData = async () => {
    const url = API_URL+'index';
    const authToken = 'Bearer '+localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      console.error(response.data.data);
      setIsDataLoaded(true);
      setData(response.data.data);


    } catch (error) {
      console.error(error);
    }
  };

const handleFileSelect = (event) => {
  const newFiles = Array.from(event.target.files);
//console.log(newFiles);
  setFiles([...files, ...newFiles]);
};
 
const handleDeleteFile = (fileIndex) => {
console.log(fileIndex);
  const newFiles = [...files];
  newFiles.splice(fileIndex, 1);
  setFiles(newFiles);
  //setDeleteModalVisible(false); 
};

 const [formData, setFormData] = useState({ title: '', description: '', groups: '', file: '', files: [] });
  const titleInputRef = useRef(null);

  const handleReset = (event) => {
    event.preventDefault();
    setFormData({ title: '', description: '', groups: '', file: '', files: [] });
    if (titleInputRef.current) {
      titleInputRef.current.value = '';
    }
    setFiles([]);


  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);


  formData.append('user_id',localStorage.getItem('userId'));

  try {
    const response = await axios.post(API_URL+'upload_files', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log(response.data);
    window.location.href = '/group-uploads';
	
    // clear form and files state
    //event.target.reset();
   // setFiles([]);
  } catch (error) {
    console.error(error);
  }
};

const [editData, setSelectedData] = useState(''); 

   const handleEdit = (id) => {
        const [editData] = id;
        setSelectedData(editData);
    }
   
   const [modalIdDeleteFile, setModalId] = useState([]);
   const handleOpenModal = (id) => {
		//console.log(id);
		setModalId(id);
	}


    return (	
	  <div className="main" >
            <div className="main-content">
             <form onSubmit={handleSubmit}>  
            	<div className="">
                    <div className=" bold ft-23 mb-4">Upload Files</div>  

                	<div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="bold  mb-2">Title</label>
                                <input type="text" placeholder="Enter title" required className="form-control" name="title"  onChange={handleInputChange} ref={titleInputRef}  value={formData.title}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="bold  mb-2"> Group </label>


                                 <select className=" form-select form-control" required aria-label="Default select example" data-live-search="true" name="groups">
 
  {groups_list.map(item => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
                            </div>
                        </div>                       
                        <div className="col-md-12">
                            <div className="form-group">                                            
                               <label className="bold mb-2"> Description</label>
                                <textarea rows="5" name="description" placeholder="Enter file description"  required className="form-control" onChange={handleInputChange} ref={titleInputRef}  value={formData.description}></textarea>
                            </div>
                        </div>
                    </div> 
               	</div>
               	<div className="row justify-content-center">
                    <div className="col-md-12 col-lg-10 col-xl-8 col-xxl-6 col-12">
                        <div className="text-end">
                                 

                         

                      <div className="mb-3">
                      <label className="btn btn-theme">
                      + Browse to Add File
                      <input type="file" multiple name="files" id="fileInput" style={{ display: "none" }} onChange={handleFileSelect} />
                      </label>
                      </div>

                       	</div>


                       	<div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
	                              <thead>
	                                <tr>
	                                  <th scope="col">File Name</th>
	                                  <th scope="col">Change Title</th>
	                                  <th scope="col">File Type</th>
	                                  <th scope="col">Size</th>										
	                                  <th scope="col">Action</th>
	                                </tr>
	                              </thead>
	                              <tbody>
							{files.map((file, index) => (
							<tr key={index}>
							<td>
							<a target="_blank" href="#">
							<u>{file.name}</u>
							</a>
							</td>
							<td><input type="text" name='files_name[]'  placeholder="Rename the file" class="border-0 form-control pt-1 pb-1" /></td>
							<td>{file.type}</td>
							<td>{(file.size/1024).toFixed(2)} KB</td>
							<td>
							
            					<input type='hidden' name='files_size[]' value={(file.size/1024).toFixed(2)} />
								<input type='hidden' name='files_title[]' value={file.name} required/>



							<a href="#" onClick={() => handleOpenModal(index)} className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" >
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
                       	</div>
                    </div>
                    <div className="col-12 text-center mt-4 d-flex justify-content-between">
                          <button className="btn btn-theme bg-grey"  onClick={handleReset}>Clear form</button>
                          <button className="btn btn-theme">Submit</button>
                    </div>
                </div>
               </form>
			</div>
       <DeleteUpload  editData = {editData} files={files} handleDeleteFile={handleDeleteFile} deleteModalVisible={deleteModalVisible} modalIdDeleteFile={modalIdDeleteFile}/ >

		</div>
			)
}

export default GroupUpload