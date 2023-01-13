import React, {createContext, useState} from 'react';

export const UIContext = createContext({
  //toast
  showToast: false,
  toastHeader: '',
  toastMessage: '',
  toastType: '',
  setVisibleToast: () => {},
  setToastConfig: (type, header, message) => {},
  //Navigation?
  selectedModule: '',
  setSelectedModule: (module) => {},
  showDrawer: false,
  setShowDrawer: () => {},
  setHideDrawer: () => {},
  isOnMenuScreen: true,
  selecetedScreen: '',
  setSelectedScreen: (screen) => {},
  backOnMenu: () => {},
  screenProps: {},
  setScreenProps: (props) => {},
});

function UIContextProvider({children}) {
  //Navigation
  const [userIsOnMenu, setUserIsOnMenu] = useState(true);
  const [userSelectedScreen, setUserSelectedScreen] = useState('');

  //toast
  const [toastIsVisible, setToastIsVisible] = useState(false);
  const [toastHeader, setToastHeader] = useState('');
  const [toastType, setToastType] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [userSelectedModule, setUserSelectedModule] = useState('');

  //Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  //screen
  const [userScreenProps, setUserScreenProps] = useState({});

  function setScreenProps(props) {
    setUserScreenProps((prevState) => props);
  }

  function setSelectedScreen(screen) {
    setUserIsOnMenu(false);
    setUserSelectedScreen(screen);
  }

  function backOnMenu() {
    console.log('Back on Menu');
    setUserIsOnMenu(true);
    setUserSelectedScreen(null);
  }

  function setShowDrawer() {
    setDrawerVisible(true);
  }
  function setHideDrawer() {
    setDrawerVisible(false);
  }

  function setSelectedModule(module) {
    setUserSelectedModule(module);
  }

  function setVisibleToast() {
    console.log('Setting visible Toast');
    setToastIsVisible(true);
    setTimeout(() => {
      setToastIsVisible(false);
      console.log('Setting invisible Toase');
    }, 5000);
  }

  function setToastConfig(type, header, message) {
    setToastType(type);
    setToastHeader(header);
    setToastMessage(message);
    console.log('TOAST: ', type, header, message);
  }

  const value = {
    showToast: toastIsVisible,
    toastHeader: toastHeader,
    toastMessage: toastMessage,
    toastType: toastType,
    setVisibleToast: setVisibleToast,
    setToastConfig: setToastConfig,
    selectedModule: userSelectedModule,
    setSelectedModule: setSelectedModule,
    showDrawer: drawerVisible,
    setShowDrawer: setShowDrawer,
    setHideDrawer: setHideDrawer,
    isOnMenuScreen: userIsOnMenu,
    selecetedScreen: userSelectedScreen,
    setSelectedScreen: setSelectedScreen,
    backOnMenu: backOnMenu,
    screenProps: userScreenProps,
    setScreenProps: setScreenProps,
  };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export default UIContextProvider;
