  	import React from 'react';
	

function DeleteUser({  }) {
 return (
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
            <button type="button" className="btn btn-theme bg-grey">No</button>&nbsp;
            <button type="button" className="btn btn-theme">Sure</button>
         </div>
        </div>
     </form>
      </div>
      
    </div>
  </div>
</div>
)
}

export default DeleteUser