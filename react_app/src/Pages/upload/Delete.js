  	import React from 'react';
import axios from 'axios';
	


function DeleteUpload({ editData,files,handleDeleteFile,deleteModalVisible,modalIdDeleteFile }) {
  
const fileNames = files.map(file => file.name);

  //console.log(fileNames);
  //console.log(modalIdDeleteFile);
// const handleDeleteFile = (fileIndex) => {
// const newFiles = [...files];
// newFiles.splice(fileIndex, 1);
// files(newFiles);
// };


 return (<>
    {deleteModalVisible && (
<div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog ">
    <div className="modal-content">
      
      <div className="modal-body">
         <form>
        <div className="row pt-4 pb-4">
         <div className="col-md-12 text-center">
                                            <h4 className="bold mb-4">Are you sure you want to delete this item</h4>
         </div>
         
         <div className="col-12 text-center">
            <button type="button" className="btn btn-theme bg-grey" data-bs-dismiss="modal">No</button> 
          <button type="button" className="btn btn-theme" onClick={() => handleDeleteFile(modalIdDeleteFile)} data-bs-dismiss="modal">Sure</button>

         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>
 )}
 </>
)
}

export default DeleteUpload