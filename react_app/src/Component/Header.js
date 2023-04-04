import React, {Component} from 'react';
import {} from 'react-router-dom';

import user from '../img/icon/user.svg';
import logoWhite from '../img/logo-white.png';
import upload from '../img/icon/upload.svg';
import download from '../img/icon/download.svg';
import groupUpload from '../img/icon/group-upload.svg';
import logout from '../img/icon/logout.svg';
import groups from '../img/icon/groups.svg';
import profile from '../img/profile.png';
import users from '../img/icon/user.svg';

export default class Header extends Component {
	

  
    render(){
        return (
		
		
		   <div className="navbar">
            <div className="topnav">
               <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-list menu-toggle cr" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                  &nbsp;<span className="text-dark"> View Upload</span>
               </div>
               <ul className="list-unstyled mb-0">
                  <li className="d-inline-flex align-items-center">
                     <img src={user} className="img-fluid me-1" alt="img" /> Hi, Admin
                  </li>
               </ul>
            </div>
         </div>,
         <div className="sidebar-left">
            <div className="sidebar-left-pad">
               <div className="colse-sidebar text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                     <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
               </div>
               <div className="text-center"><img src={logoWhite} className="img-fluid s-logo" alt="img" /></div>
               <div className="sidebar-ul">
                  <div className="text-center p-box">
                     <img src={profile} className="img-fluid sm-profile" alt="img" />
                     <div className="text-white mb-2 text-uppercase bold">ADMIN</div>
                     <p className="text-white">Director Manager</p>
                     <hr className="sm-hr" />
                  </div>
                  <ul className="list-unstyled">
                     <li className="active">
                        <a href="dashboard" >
                           <div className="sm-icon"><img src={upload} className="img-fluid me-2 sm-icon-img" alt="img" /></div>
                           Upload Files
                        </a>
                     </li>
                     
                     <li>
                        <a href="download-logs" >
                           <div className="sm-icon"><img src={download} className="img-fluid me-2 sm-icon-img" alt="img" /></div>
                           Download logs
                        </a>
                     </li>
                     <li>
                        <a href="group-uploads" >
                           <div className="sm-icon"><img src={groupUpload} className="img-fluid me-2 sm-icon-img" alt="img" /></div>
                           Group Uploads
                        </a>
                     </li>
                     <li>
                        <a href="groups" >
                           <div className="sm-icon"><img src={groups} className="img-fluid me-2 sm-icon-img" alt="img"/></div>
                           Groups
                        </a>
                     </li>
					 
					  <li>
                        <a href="users" >
                           <div className="sm-icon"><img src={users} className="img-fluid me-2 sm-icon-img" alt="img"/></div>
                           Users
                        </a>
                     </li>
					 
                  </ul>
               </div>
               <div className=" text-danger" >
                  <div className="cr sm-logout" onClick=""><img src={logout} className="img-fluid me-2" alt="img" />Logout</div>
               </div>
            </div>
         </div>
		 
		 )
    }
}