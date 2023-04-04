import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { Switch, Redirect, withRouter,BrowserRouter, Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./Pages/login'));
const Dashboard = lazy(() => import('./Pages/dashboard'));
const Downloadlogs = lazy(() => import('./Pages/downloadlogs'));
const Groups = lazy(() => import('./Pages/groups'));
const Groupupload = lazy(() => import('./Pages/group-upload'));
const Users = lazy(() => import('./Pages/users'));
const Activitylogs = lazy(() => import('./Pages/activity-log'));
const IndividualUpload = lazy(() => import('./Pages/individual-upload'));
const ForgotPwd = lazy(() => import('./Pages/forgot_password'));
const ResetPwd = lazy(() => import('./Pages/reset-password'));
const Notification = lazy(() => import('./Pages/notification'));
const NotificationLog = lazy(() => import('./Pages/notificationlog'));
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loader"></div>}>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/download-logs" element={<Downloadlogs />} />
          <Route path="/activity-log" element={<Activitylogs />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group-uploads" element={<Groupupload />} />
          <Route path="/users" element={<Users />} />
          <Route path="/individual-upload/:id/" element={<IndividualUpload />} />
          <Route path="/forgot_password/" element={<ForgotPwd />} />
          <Route path="/reset-password/:id/" element={<ResetPwd />} />
          <Route path="/notification/" element={<Notification />} />
          <Route path="/notification-log/" element={<NotificationLog />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
