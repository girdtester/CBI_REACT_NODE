  	import React from 'react';
	

function NotificationLogList({ notificationLog, totalPages, currentPage,handleNextPage,handlePrevPage,pageNumbers,setNotificationLog }) {
 return (
    <div className="main">
            <div className="main-content">
                    <div className=" bold ft-23 mb-3">Notification Log</div>
                  <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                 <th scope="col">Date #</th>
                          <th scope="col">Group Id</th>
                          <th scope="col">Action By</th>
                          <th scope="col">Event</th>
                                </tr>
                              </thead>
                              <tbody>
                                {notificationLog.map((item) => (
								  
                                <tr key={item.id}>
								  <td>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(item.notify_date).getMonth()]} {new Date(item.notify_date).getDate()}, {new Date(item.notify_date).getFullYear()} {new Date(item.notify_date).toLocaleTimeString()}</td>
								  <td>{item.name}</td>
								  <td>{item.username}</td>
								  <td>{item.description}</td>
                          
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

export default NotificationLogList