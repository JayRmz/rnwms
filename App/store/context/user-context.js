import React, {createContext, useState, useEffect, useContext} from 'react';
import {UIContext} from './ui-context';

export const UserContext = createContext({
  token: '',
  isLoggedIn: false,
  username: '',
  company: '',
  companyLogo: '',
  showWelcome: false,
  setLoggedIn: (isLogged) => {},
  setToken: (token) => {},
  setUsername: (uname) => {},
  setCompany: (company) => {},
  setCompanyLogo: (logo) => {},
  setShowWelcome: () => {},
});

function UserContextProvider({children}) {
  const [userLogged, setUserLogged] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userName, setUserName] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [userCompanyLogo, setUserCompanyLogo] = useState('');
  const [userWelcome, setUserWelcome] = useState(false);
  const uiCtx = useContext(UIContext);

  function setShowWelcome() {
    setUserWelcome(true);
  }

  function setLoggedIn(isLogged) {
    if (!isLogged) uiCtx.setSelectedScreen('/main');
    setUserLogged(isLogged);
  }

  function setToken(token) {
    setUserToken(token);
  }

  function setUsername(name) {
    setUserName(name);
  }

  function setCompany(company) {
    setUserCompany(company);
  }

  function setCompanyLogo(logo) {
    setUserCompanyLogo(logo);
  }

  const value = {
    isLoggedIn: userLogged,
    token: userToken,
    username: userName,
    company: userCompany,
    companyLogo: userCompanyLogo,
    showWelcome: userWelcome,

    setLoggedIn: setLoggedIn,
    setToken: setToken,
    setUsername: setUsername,
    setCompany: setCompany,
    setCompanyLogo: setCompanyLogo,
    setShowWelcome: setShowWelcome,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
