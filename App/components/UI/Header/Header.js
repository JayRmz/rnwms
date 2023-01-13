import {faBars, faHamburger, faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Box, Button, Divider, Menu} from 'native-base';
import React, {useContext} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Redirect} from 'react-router-native';
import {UIContext} from '../../../store/context/ui-context';
import {UserContext} from '../../../store/context/user-context';
import Colors from '../../../util/Colors';
import IconButton from '../Buttons/IconButton';
import HeaderMenu from './HeaderMenu';
import HeaderUserMenu from './HeaderUserMenu';

export default function Header() {
  //context
  const userCtx = useContext(UserContext);
  const uiCtx = useContext(UIContext);
  function showLateralMenu() {
    console.log('Show lateral Menu');
    uiCtx.setShowDrawer(0);
  }
  function hideLateralMenu() {
    console.log('Show lateral Menu');
    uiCtx.setHideDrawer(0);
  }

  function showUserMenu() {
    console.log('User Menu');
  }

  return (
    <>
      {!userCtx.isLoggedIn ? (
        <Redirect to="/" />
      ) : (
        <View style={styles.header}>
          {userCtx.isLoggedIn && (
            <View style={styles.headerContainer}>
              <HeaderMenu />
              <Text style={styles.appTitle}> {userCtx.company}</Text>
              <HeaderUserMenu />
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.black,
    height: 60,
    paddingTop: 20,
    flexDirection: 'column',
  },
  appTitle: {
    color: Colors.lightGrey,
    fontSize: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    alignItems: 'center',
  },
});
