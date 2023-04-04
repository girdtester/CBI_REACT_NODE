import React, {useEffect, useState, Switch } from 'react';
import { Navigate,useNavigate } from 'react-router-dom';

import { setAutoLogout } from './Pages/auth';
import Login from './Pages/login';


function App (){
	
	 
  return (   
	<div className="App">
      <header className="App-header">	
			<Login />
		 </header>
    </div>
  )
}

export default App;
