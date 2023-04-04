import React from 'react';
import {} from 'react-router-dom';
import logo from '../img/logo.png';

function Header({}) {
	

  
   
        return (
		
		 <div className="navbar">
            <div className="topnav">
               <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-list menu-toggle cr" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                  
               </div>
               <ul className="list-unstyled mb-0">
                  <li className="d-inline-flex align-items-center">
                     <span className="bold">{ localStorage.getItem('username') ?? "Admin"} </span>&nbsp; { localStorage.getItem('role') ?? "Director"}
                  </li>
               </ul>
            </div>
         </div>
        
		 
		 )
}

export default Header