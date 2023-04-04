import React, {useEffect, useState} from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
import axios from 'axios';
import logos from '../img/logo.png';
import mailoutline from '../img/icon/mail-outline.svg';
import pwd from '../img/icon/password.svg';
import { setAutoLogout } from '../Pages/auth';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';  

function Login (){
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [timer, setTimer] = useState(null);
	const [errorMessage, setErrorMessage] = useState(''); // Add the errorMessage state variable
	
	
	const navigate = useNavigate();
	
	const handleSubmit = async e => {
    e.preventDefault();
	
        console.log(username);
        console.log(password);
		try {
		  const response = await axios.post(API_URL+'loginpost', {
			username,
			password
		  });
		  
		  var result=response.data;
		  
		  if(result.data != undefined)
		  {
			  if(result.data.loggedIn == true)
			  {
				 localStorage.setItem('token', result.data.users.token);
				 localStorage.setItem('userId', result.data.users.id);
				 localStorage.setItem('username', result.data.users.username);
				 localStorage.setItem('role', result.data.role);
				 localStorage.setItem('isAuth', true);
				 const remainingMilliseconds = 30 * 60 * 1000;
				const expiryDate = new Date(
				  new Date().getTime() + remainingMilliseconds
				);
				localStorage.setItem('expiryDate', expiryDate.toISOString());
				
				setAutoLogout(remainingMilliseconds, logout);
				
					// redirect to the dashboard page
					navigate('/group-uploads');
		
			  }
			  else
			  {
				  console.log(result.message);
			  
				  setErrorMessage(result.message);
				  
				  return <Navigate replace to="/" />;
			  }
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
  
 const logout = () => {
	 
	
    clearTimeout(timer); // Clear the auto logout timer
    localStorage.removeItem('token'); // Remove the authentication token from local storage
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to the login page
  };

  useEffect(() => {
    setTimer(setAutoLogout(30 * 60 * 1000, logout)); // Set auto logout timer when the component is mounted
    return () => {
      clearTimeout(timer); // Clear auto logout timer when the component is unmounted
    };
  }, []);
  
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
                                    <p className="bold ft-32 mb-2 text-dark">Login</p>
                                    <p className="mb-4 mb-lg-5">Welcome back! Please enter your details.</p>
									<p className="mb-4 mb-lg-5 text-danger">{errorMessage}</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group position-relative">
                                            <label className="bold text-dark mb-2">Email</label>
                                            <img src={mailoutline} className="img-fluid login-fc-icon" />
                                            <input type="text" name="" placeholder="Enter your email" className="login-form-control" onChange={e => setUsername(e.target.value)}/>
                                        </div>
                                        <div className="form-group position-relative">
                                            <label className="bold text-dark mb-2">Password</label>
                                            <img src={pwd} className="img-fluid login-fc-icon p-icon" />
                                            <input type="password" name="" placeholder="Password" className="login-form-control" onChange={e => setPassword(e.target.value)}/>
                                        </div>
										
                                        <div className="form-group d-flex justify-content-between">
                                            <label className="container1">Remember for 30 days
                                              <input type="checkbox" />
                                              <span className="checkmark"></span>
                                            </label>
                                            <Link to="forgot_password" className="theme-color">Forgot Password</Link>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-theme w-100">Sign in</button>
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

export default Login;
