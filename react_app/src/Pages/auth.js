import React from 'react';


export const setAutoLogout = (logoutTime, logoutCallback) => {
  setTimeout(() => {
    logoutCallback();
  }, logoutTime);
};

