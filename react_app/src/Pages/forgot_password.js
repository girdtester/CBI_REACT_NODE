import React, {useEffect, useState} from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
import axios from 'axios';
import logos from '../img/logo.png';
import mailoutline from '../img/icon/mail-outline.svg';
import { API_URL } from '../config'; 
import { Link } from 'react-router-dom';  


function ForgotPassword (){
	
	const [username, setUsername] = useState('');	
	const [errorMessage, setErrorMessage] = useState(''); // Add the errorMessage state variable
	const [successMessage, setSuccessMessage] = useState([]);
	
	
	const navigate = useNavigate();
	
	const handleSubmit = async e => {
    e.preventDefault();
	
        console.log(username);
        
		try {
		  const response = await axios.post(API_URL+'sendpassword', {
			username,			
		  });
		  
		  var result=response.data;
		  
		  if(result.message == 'Password reset email sent')
		  {
			  setSuccessMessage('Email reset link send successfully, Please check your email for reset password')
		  }
		  else
		  {
			  setErrorMessage(result.message);
		  }
  
		} catch (error) {
		  console.log(error.message);
		  setErrorMessage(error.message);
		}
    }
  
 
  
  return (   
	<div className="App">
		<header className="App-header">	
			 
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-md-12 col-12 col-lg-6">
                    <div className="login-box">
                       <div className="container h-100">
                            <div className="row d-flex justify-content-center h-100 align-items-center">
                                <div className="col-md-12 col-lg-12 col-xl-8">
                                    <img src="img/logo.png" className="img-fluid mb-4" alt="img" />
                                    <p className="bold ft-32 mb-2 text-dark">Forgot password</p>
                                    <p className="mb-4 mb-lg-5">Welcome back! Please enter your details.</p>
									<div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group position-relative">
                                            <label className="bold text-dark mb-2">Email</label>
                                            <img src={mailoutline} className="img-fluid login-fc-icon" />
                                            <input type="text" name="" placeholder="Enter your email" className="login-form-control" onChange={e => setUsername(e.target.value)}/>
                                        </div>
                                    
										
                                        <div className="form-group d-flex justify-content-between">
                                            <label className="container1">Remember for 30 days
                                              <input type="checkbox" />
                                              <span className="checkmark"></span>
                                            </label>
                                            <Link to="/" className="theme-color">Login</Link>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-theme w-100">Send</button>
                                        </div>
                                        <div className="form-group text-center">
                                          ©2018-2021 CBI Consults- All rights reserved.
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-12 col-lg-6 d-none d-lg-flex">
                    <div className="login-bg">
                    </div>
                </div>
            </div>
        </div>

		</header>
    </div>
      
  )
}

export default ForgotPassword;
