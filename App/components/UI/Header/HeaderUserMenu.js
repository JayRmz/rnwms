import React, {useContext} from 'react';
import {UserContext} from '../../../store/context/user-context';
import {
  Box,
  Button,
  Divider,
  Heading,
  Image,
  Menu,
  Pressable,
  Text,
} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import Colors from '../../../util/Colors';
import {UIContext} from '../../../store/context/ui-context';
import {StyleSheet} from 'react-native';

export default function HeaderUserMenu() {
  const userCtx = useContext(UserContext);
  const uiCtx = useContext(UIContext);

  function logOut() {
    // uiCtx.setSelectedScreen('/main');
    userCtx.setLoggedIn(false);
  }

  return (
    <Box alignItems="center">
      <Menu
        backgroundColor={Colors.white}
        w="200"
        m={2}
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps}>
              <FontAwesomeIcon icon={faUser} color={Colors.white} size={25} />
            </Pressable>
          );
        }}>
        <Menu.Item>
          <Image
            source={{uri: userCtx.companyLogo}}
            width={200}
            height={50}
            alt="Alternate Text"
          />
        </Menu.Item>

        <Divider mt="3" w="100%" />
        <Menu.Item>
          <Text>{userCtx.username}</Text>
        </Menu.Item>
        <Divider mt="3" w="100%" />
        <Menu.Item
          onPress={logOut}
          justifyContent="space-around"
          flexDirection="row">
          <Text style={styles.logout}>Cerrar Sesión</Text>
        </Menu.Item>
      </Menu>
    </Box>
  );
}

const styles = StyleSheet.create({
  logout: {
    color: Colors.error,
  },
});
